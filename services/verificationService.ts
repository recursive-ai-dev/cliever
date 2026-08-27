import { Agent, StarsSource } from '../types';
import { sanitizeCommand, sanitizeUrl } from '../utils/sanitization';
import { GitHubService } from './githubService';
import { logger } from './logger';
import { AgentVerificationRecord, VerificationStorage } from './storageService';

const isoDateTime = (): string => new Date().toISOString();

const mergeNotes = (a: string[] | undefined, b: string[]): string[] => {
  const merged = [...(a ?? []), ...b];
  return Array.from(new Set(merged)).slice(0, 20);
};

export const VerificationService = {
  getCached: (agentId: string): AgentVerificationRecord | null => {
    return VerificationStorage.get(agentId);
  },

  /**
   * Verifies an agent locally:
   * - Validates repo URL scheme
   * - Validates installCommand against allow-list sanitizer
   * - If GitHub repo, attempts to fetch metadata to confirm repo exists and refresh stars timestamp
   */
  verifyAgent: async (agent: Agent): Promise<{ record: AgentVerificationRecord; agentPatch: Partial<Agent> }> => {
    const checkedAt = isoDateTime();

    const notes: string[] = [];

    const repoUrlValidated = sanitizeUrl(agent.repoUrl) !== null;
    if (repoUrlValidated) notes.push('Repo URL: valid http/https URL.');
    else notes.push('Repo URL: invalid or unsafe scheme.');

    const sanitizedInstall = sanitizeCommand(agent.installCommand);
    const installCommandValidated = sanitizedInstall.length > 0;
    if (installCommandValidated) notes.push('Install command: matches safe allow-list.');
    else notes.push('Install command: does not match safe allow-list.');

    let starsSource: StarsSource = 'REGISTRY';
    let repoUpdatedAt: string | undefined;

    // If GitHub repo, try to fetch metadata
    const parsed = GitHubService.parseGitHubUrl(agent.repoUrl);
    if (parsed) {
      try {
        const meta = await GitHubService.fetchRepoMetadata(agent.repoUrl);
        if (meta) {
          starsSource = 'GITHUB_API';
          repoUpdatedAt = meta.updated_at;
          notes.push('GitHub metadata: fetched successfully.');
        } else {
          notes.push('GitHub metadata: unavailable (repo missing or rate-limited).');
        }
      } catch (_error) {
        logger.warn('Verification GitHub fetch failed', { agentId: agent.id, agentName: agent.name });
        notes.push('GitHub metadata: fetch failed (network or rate limit).');
      }
    } else {
      notes.push('GitHub metadata: not applicable (non-GitHub repo URL).');
    }

    const previous = VerificationStorage.get(agent.id);
    const mergedVerificationNotes = mergeNotes(previous?.verificationNotes, notes);

    // Preserve higher previous status only when the new result isn't a hard failure.
    // Hard failures are deterministic local checks (unsafe URL/command) and must override.
    const record: AgentVerificationRecord = {
      lastVerified: checkedAt,
      starsSource,
      repoUpdatedAt,
      verificationNotes: mergedVerificationNotes
    };

    VerificationStorage.set(agent.id, record);

    const agentPatch: Partial<Agent> = {
      lastVerified: record.lastVerified,
      starsSource: record.starsSource,
      repoUpdatedAt: record.repoUpdatedAt,
      verificationNotes: record.verificationNotes
    };

    return { record, agentPatch };
  }
};
