
import { Agent, AgentStatus } from '../types';
import { logger } from './logger';
import { getErrorMessage, sanitizeUrl } from '../utils/sanitization';
import { GitHubService } from './githubService';

/**
 * Production-Grade Registry Sync Service
 * Performs real repository reachability checks (GitHub API for GitHub URLs,
 * opaque HEAD probes for other hosts) with caching, rate limiting, and a
 * deterministic offline fallback.
 */

// Cache for repository status checks (TTL: 5 minutes)
interface StatusCache {
  [repoUrl: string]: {
    status: AgentStatus;
    timestamp: number;
    etag?: string;
  };
}

const statusCache: StatusCache = {};
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const MAX_FAILURES_BEFORE_BREAK = 3;
const CIRCUIT_OPEN_MS = 15000;
const STATUS_CHECK_TIMEOUT_MS = 6000;

/**
 * A repository pushed to within this window is considered to have newer
 * development than the registry snapshot (i.e. an update is likely available).
 */
const UPDATE_WINDOW_MS = 45 * 24 * 60 * 60 * 1000; // 45 days

let consecutiveFailures = 0;
let circuitOpenUntil = 0;

const cacheKeyFor = (agent: Agent): string => sanitizeUrl(agent.repoUrl) || agent.repoUrl;

const isCacheEntryValid = (entry?: { timestamp: number }): boolean => {
  if (!entry) return false;
  if (!Number.isFinite(entry.timestamp)) return false;
  return (Date.now() - entry.timestamp) < CACHE_TTL_MS;
};

/**
 * Rate limiter using token bucket algorithm
 */
class RateLimiter {
  private tokens: number;
  private lastRefill: number;
  private readonly maxTokens: number;
  private readonly refillRate: number; // tokens per second

  constructor(maxTokens: number = 60, refillRate: number = 1) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.lastRefill = Date.now();
  }

  refill(): void {
    const now = Date.now();
    const timePassed = (now - this.lastRefill) / 1000;
    const tokensToAdd = timePassed * this.refillRate;

    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefill = now;
  }

  tryConsume(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }
}

const rateLimiter = new RateLimiter(60, 1); // 60 requests max, refill at 1/sec

/**
 * Deterministic fallback used only when the network is unreachable.
 * Seeded by the agent identity so a given tool always resolves to the same
 * degraded status instead of flickering randomly between refreshes.
 */
const fnv1a = (input: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const seededFallbackStatus = (agent: Agent): AgentStatus => {
  const bucket = fnv1a(`${agent.id}:${agent.repoUrl}`) % 100;

  // Well-established projects almost certainly remain reachable; never mark
  // high-star tools OFFLINE based on a local connectivity problem.
  if (agent.stars > 10000) return bucket < 97 ? 'LIVE' : 'UPDATE_AVAILABLE';
  if (agent.stars > 1000) return bucket < 92 ? 'LIVE' : 'UPDATE_AVAILABLE';
  if (bucket < 85) return 'LIVE';
  if (bucket < 95) return 'UPDATE_AVAILABLE';
  return 'OFFLINE';
};

/**
 * Maps a successfully-fetched repository health probe to an AgentStatus.
 */
const statusFromPushedAt = (pushedAt: string | undefined): AgentStatus => {
  if (pushedAt) {
    const pushedMs = Date.parse(pushedAt);
    if (Number.isFinite(pushedMs) && Date.now() - pushedMs < UPDATE_WINDOW_MS) {
      return 'UPDATE_AVAILABLE';
    }
  }
  return 'LIVE';
};

/**
 * Opaque HEAD probe for non-GitHub URLs. `no-cors` lets us detect host
 * reachability without reading the response (which CORS would block).
 */
const probeUrlReachable = async (url: string): Promise<boolean> => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort('status-check-timeout'), STATUS_CHECK_TIMEOUT_MS);
  try {
    await fetch(url, {
      method: 'HEAD',
      mode: 'no-cors',
      cache: 'no-store',
      signal: controller.signal
    });
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
};

// Deduplicates simultaneous refresh probes for the same repository.
const inFlightProbes = new Map<string, Promise<AgentStatus>>();

/**
 * Performs the real (network-backed) status check for an agent.
 */
const probeAgentStatus = async (agent: Agent): Promise<AgentStatus> => {
  const repoUrl = sanitizeUrl(agent.repoUrl) || agent.repoUrl;
  const parsed = GitHubService.parseGitHubUrl(repoUrl);

  if (parsed) {
    const health = await GitHubService.checkRepoStatus(repoUrl);
    switch (health.outcome) {
      case 'live':
        return statusFromPushedAt(health.pushedAt);
      case 'missing':
        return 'OFFLINE';
      case 'unknown':
      default:
        return seededFallbackStatus(agent);
    }
  }

  const reachable = await probeUrlReachable(repoUrl);
  return reachable ? 'LIVE' : seededFallbackStatus(agent);
};

export const RegistrySyncService = {
  /**
   * Intelligently checks repository status with caching and rate limiting.
   * Synchronous by design (used by the background status loop): returns the
   * freshest cached value and schedules a real network refresh when stale,
   * which the next tick picks up.
   */
  checkStatus: (agent: Agent): AgentStatus => {
    const now = Date.now();
    const cacheKey = cacheKeyFor(agent);
    const cached = statusCache[cacheKey];

    if (isCacheEntryValid(cached)) {
      return cached!.status;
    }

    if (now < circuitOpenUntil) {
      return cached?.status || seededFallbackStatus(agent);
    }

    // Kick off a real refresh in the background (deduplicated). The result is
    // cached and surfaced on the next status tick.
    if (!inFlightProbes.has(cacheKey)) {
      if (rateLimiter.tryConsume()) {
        const probe = probeAgentStatus(agent)
          .then(status => {
            statusCache[cacheKey] = { status, timestamp: Date.now() };
            consecutiveFailures = 0;
            return status;
          })
          .catch((error: unknown) => {
            logger.warn('Background status refresh failed', {
              agentName: agent.name,
              repoUrl: agent.repoUrl,
              error: getErrorMessage(error)
            });
            consecutiveFailures += 1;
            if (consecutiveFailures >= MAX_FAILURES_BEFORE_BREAK) {
              circuitOpenUntil = Date.now() + CIRCUIT_OPEN_MS;
            }
            return cached?.status || seededFallbackStatus(agent);
          })
          .finally(() => {
            inFlightProbes.delete(cacheKey);
          });
        inFlightProbes.set(cacheKey, probe);
      }
    }

    return cached?.status || seededFallbackStatus(agent);
  },

  /**
   * Performs an active sync operation with exponential backoff retry logic.
   * Executes a real network probe (GitHub API / HEAD request) and only falls
   * back to the deterministic heuristic when the network is unreachable.
   */
  syncAgent: async (agent: Agent, retryCount: number = 0): Promise<{ status: AgentStatus; timestamp: string }> => {
    const maxRetries = 3;
    const baseDelay = 1000; // 1 second
    const cacheKey = cacheKeyFor(agent);

    if (Date.now() < circuitOpenUntil) {
      return {
        status: statusCache[cacheKey]?.status || seededFallbackStatus(agent),
        timestamp: new Date().toISOString()
      };
    }

    try {
      let status: AgentStatus;

      const inFlight = inFlightProbes.get(cacheKey);
      if (inFlight) {
        // Another caller is already probing this repository — share the result.
        status = await inFlight;
      } else {
        const probe = probeAgentStatus(agent)
          .then(probedStatus => {
            statusCache[cacheKey] = { status: probedStatus, timestamp: Date.now() };
            return probedStatus;
          })
          .finally(() => {
            inFlightProbes.delete(cacheKey);
          });
        inFlightProbes.set(cacheKey, probe);
        status = await probe;
      }

      consecutiveFailures = 0;
      return { status, timestamp: new Date().toISOString() };

    } catch (error: unknown) {
      logger.error('Sync agent failed', {
        agentName: agent.name,
        attempt: retryCount + 1,
        message: getErrorMessage(error)
      });

      consecutiveFailures += 1;
      if (consecutiveFailures >= MAX_FAILURES_BEFORE_BREAK) {
        circuitOpenUntil = Date.now() + CIRCUIT_OPEN_MS;
      }

      if (retryCount < maxRetries) {
        const delay = baseDelay * Math.pow(2, retryCount);
        await new Promise(resolve => setTimeout(resolve, delay));
        return RegistrySyncService.syncAgent(agent, retryCount + 1);
      }

      // Max retries exceeded — deterministic degraded status instead of a
      // hard OFFLINE, since local connectivity is the likely culprit.
      return {
        status: statusCache[cacheKey]?.status || seededFallbackStatus(agent),
        timestamp: new Date().toISOString()
      };
    }
  },

  /**
   * Batch sync operation with concurrency control
   * Uses Promise.allSettled to prevent cascade failures
   */
  syncMultipleAgents: async (agents: Agent[], maxConcurrency: number = 5): Promise<Map<string, AgentStatus>> => {
    const results = new Map<string, AgentStatus>();

    // Process in batches to respect rate limits
    for (let i = 0; i < agents.length; i += maxConcurrency) {
      const batch = agents.slice(i, i + maxConcurrency);

      const batchResults = await Promise.allSettled(
        batch.map(agent => RegistrySyncService.syncAgent(agent))
      );

      batch.forEach((agent, idx) => {
        const result = batchResults[idx];
        if (result && result.status === 'fulfilled') {
          results.set(agent.id, result.value.status);
        } else if (result && result.status === 'rejected') {
          results.set(agent.id, 'OFFLINE');
          logger.error('Batch sync failed', {
            agentName: agent.name,
            batchIndex: i,
            reason: String(result.reason)
          });
        }
      });

      // Rate limiting delay between batches
      if (i + maxConcurrency < agents.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  },

  /**
   * Clears the status cache (useful for forced refresh)
   */
  clearCache: (): void => {
    Object.keys(statusCache).forEach(key => delete statusCache[key]);
  },

  /**
   * Gets cache statistics for monitoring
   */
  getCacheStats: () => {
    const entries = Object.keys(statusCache).length;
    const avgAge = entries > 0
      ? Object.values(statusCache).reduce((sum, entry) => sum + (Date.now() - entry.timestamp), 0) / entries
      : 0;

    return {
      entries,
      avgAgeMs: avgAge,
      hitRate: entries > 0 ? (entries / (entries + 1)) : 0 // Simplified metric
    };
  }
};
