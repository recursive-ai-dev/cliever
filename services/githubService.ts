
/**
 * Production-Grade GitHub API Integration Service
 * Implements real repository metadata fetching with intelligent caching and error handling
 */

import { Agent } from '../types';
import { logger } from './logger';
import { getErrorMessage } from '../utils/sanitization';

// GitHub API configuration
const GITHUB_API_BASE = 'https://api.github.com';
const GITHUB_API_VERSION = '2022-11-28';

/**
 * GitHub Repository Metadata Interface
 */
interface GitHubRepoMetadata {
  id: number;
  name: string;
  full_name: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  created_at: string;
  updated_at: string;
  pushed_at: string;
  language: string;
  homepage?: string;
  topics?: string[];
}

// Response cache with LRU eviction
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  etag?: string;
}

class LRUCache<T> {
  private cache: Map<string, CacheEntry<T>>;
  private readonly maxSize: number;
  private readonly ttlMs: number;

  constructor(maxSize: number = 100, ttlMs: number = 5 * 60 * 1000) {
    this.cache = new Map();
    this.maxSize = maxSize;
    this.ttlMs = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > this.ttlMs) {
      // Do not delete: stale entries are preserved for ETag / offline fallback.
      // Eviction happens only on capacity overflow in set().
      return null;
    }

    // Move to end (most recently used)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  set(key: string, data: T, etag?: string): void {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      etag
    });
  }

  clear(): void {
    this.cache.clear();
  }

  getEtag(key: string): string | undefined {
    // Bypass TTL: etags are valid even for expired entries (used for conditional requests)
    return this.cache.get(key)?.etag;
  }

  /**
   * Returns cached data even if expired (for 304 fallback and offline resilience).
   * Does NOT promote the entry (no LRU reorder) since the data is stale.
   */
  getStale(key: string): T | null {
    const entry = this.cache.get(key);
    return entry ? entry.data : null;
  }
}

// Specialized caches for different data types
const repoMetadataCache = new LRUCache<GitHubRepoMetadata>(200, 10 * 60 * 1000); // 10 min TTL

/**
 * Circuit breaker pattern for API resilience
 */
class CircuitBreaker {
  private failureCount: number = 0;
  private lastFailureTime: number = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  private readonly threshold: number;
  private readonly timeout: number;

  constructor(threshold: number = 5, timeout: number = 60000) {
    this.threshold = threshold;
    this.timeout = timeout;
  }

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'half-open';
      } else {
        throw new Error('Circuit breaker is OPEN - service temporarily unavailable');
      }
    }

    try {
      const result = await fn();

      if (this.state === 'half-open') {
        this.state = 'closed';
        this.failureCount = 0;
      }

      return result;
    } catch (error) {
      this.failureCount++;
      this.lastFailureTime = Date.now();

      if (this.failureCount >= this.threshold) {
        this.state = 'open';
      }

      throw error;
    }
  }

  getState(): string {
    return this.state;
  }

  reset(): void {
    this.failureCount = 0;
    this.state = 'closed';
  }
}

const circuitBreaker = new CircuitBreaker(5, 60000);

export const GitHubService = {
  /**
   * Extracts owner and repo from GitHub URL
   */
  parseGitHubUrl: (url: string): { owner: string; repo: string } | null => {
    const patterns = [
      new RegExp('github\\.com/([^/]+)/([^/?#]+)'),
      new RegExp('github\\.com/([^/]+)/([^/]+)\\.git')
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1] && match[2]) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, '')
        };
      }
    }

    return null;
  },

  /**
   * Fetches repository metadata with caching and conditional requests
   */
  fetchRepoMetadata: async (repoUrl: string): Promise<GitHubRepoMetadata | null> => {
    const parsed = GitHubService.parseGitHubUrl(repoUrl);
    if (!parsed) return null;

    const cacheKey = `${parsed.owner}/${parsed.repo}`;

    // Check cache first (returns null if expired or absent)
    const cached = repoMetadataCache.get(cacheKey);
    if (cached) return cached;

    // Preserve stale entry for ETag conditional requests and offline fallback.
    // The fresh cache.get() above already deleted expired entries, so we
    // look up the etag/data from the raw internal store via getEtag/getStale.
    const staleEtag = repoMetadataCache.getEtag(cacheKey);
    const staleData = repoMetadataCache.getStale(cacheKey);

    try {
      return await circuitBreaker.execute(async () => {
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github+json',
          'X-GitHub-Api-Version': GITHUB_API_VERSION
        };

        // Add ETag for conditional request when stale data exists
        if (staleEtag) {
          headers['If-None-Match'] = staleEtag;
        }

        const response = await fetch(
          `${GITHUB_API_BASE}/repos/${parsed.owner}/${parsed.repo}`,
          { headers }
        );

        // 304 Not Modified - refresh the TTL on stale data and return it
        if (response.status === 304 && staleData) {
          repoMetadataCache.set(cacheKey, staleData, staleEtag);
          return staleData;
        }

        if (!response.ok) {
          if (response.status === 404) {
            // Repository not found - log but don't treat as critical error
            logger.warn('Repository not found', {
              cacheKey,
              statusCode: 404
            });
            return null;
          }
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const responseEtag = response.headers.get('etag') || undefined;

        repoMetadataCache.set(cacheKey, data, responseEtag);

        return data;
      });
    } catch (error: unknown) {
      // Use structured logging
      logger.error('GitHub metadata fetch failed', {
        cacheKey,
        message: getErrorMessage(error)
      });
      return staleData || null; // Fallback to stale cache if available
    }
  },

  /**
   * Updates agent with real GitHub data
   */
  enrichAgentWithGitHubData: async (agent: Agent): Promise<Agent> => {
    const metadata = await GitHubService.fetchRepoMetadata(agent.repoUrl);

    if (!metadata) return agent;

    return {
      ...agent,
      stars: metadata.stargazers_count || agent.stars,
      // Update other fields if needed, but preserve existing data as fallback
      description: metadata.description || agent.description,
    };
  },

  /**
   * Batch fetch metadata for multiple agents
   */
  batchFetchMetadata: async (agents: Agent[], maxConcurrency: number = 3): Promise<Map<string, GitHubRepoMetadata>> => {
    const results = new Map<string, GitHubRepoMetadata>();

    for (let i = 0; i < agents.length; i += maxConcurrency) {
      const batch = agents.slice(i, i + maxConcurrency);

      const batchResults = await Promise.allSettled(
        batch.map(agent => GitHubService.fetchRepoMetadata(agent.repoUrl))
      );

      batch.forEach((agent, idx) => {
        const result = batchResults[idx];
        if (result && result.status === 'fulfilled' && result.value) {
          results.set(agent.id, result.value);
        }
      });

      // Rate limiting delay
      if (i + maxConcurrency < agents.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  },

  /**
   * Clear all caches
   */
  clearCaches: (): void => {
    repoMetadataCache.clear();
  },

  /**
   * Get circuit breaker state for monitoring
   */
  getHealthStatus: () => ({
    circuitBreakerState: circuitBreaker.getState(),
    timestamp: new Date().toISOString()
  })
};
