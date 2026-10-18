import { REGISTRY_METADATA_AS_OF } from '../constants';

/** True when the URL points at a GitHub repository (owner/repo). */
export const isGitHubRepoUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return parsed.hostname === 'github.com' && parsed.pathname.split('/').filter(Boolean).length >= 2;
  } catch {
    return false;
  }
};

/**
 * Compact star count. Closed-source tools without a public repository are
 * stored with 0 stars and render as an em dash rather than a misleading "0".
 */
export const formatStars = (stars: number): string => {
  if (!Number.isFinite(stars) || stars <= 0) return '—';
  if (stars < 1000) return stars.toLocaleString();
  if (stars < 100_000) return `${(stars / 1000).toFixed(1)}k`;
  return `${Math.round(stars / 1000)}k`;
};

/** Tooltip text explaining where a star count comes from. */
export const starsTooltip = (stars: number, repoUrl: string): string => {
  if (!Number.isFinite(stars) || stars <= 0) {
    return isGitHubRepoUrl(repoUrl) ? 'Star count unavailable' : 'No public GitHub repository';
  }
  const source = isGitHubRepoUrl(repoUrl) ? 'GitHub stars' : 'stars on the project\'s public forge or mirror';
  return `${stars.toLocaleString()} ${source} (as of ${REGISTRY_METADATA_AS_OF})`;
};
