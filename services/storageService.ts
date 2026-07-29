/**
 * Production-Grade Local Storage Service
 * Implements type-safe persistence with validation, versioning, and migration support
 */

import { AgentVerificationStatus, Review, StarsSource } from '../types';
import { logger } from './logger';
import { sanitizeDisplayText, getErrorMessage } from '../utils/sanitization';

// Storage version for migration support
const STORAGE_VERSION = 1;
const STORAGE_PREFIX = 'cliever_';

/**
 * Storage keys enum for type safety
 */
export enum StorageKey {
  REVIEWS = 'reviews',
  VERIFICATIONS = 'verifications',
  USER_PREFERENCES = 'user_preferences',
  CHAT_HISTORY = 'chat_history',
  SYNC_STATE = 'sync_state',
  ANALYTICS_CONSENT = 'analytics_consent'
}

export interface AgentVerificationRecord {
  verificationStatus: AgentVerificationStatus;
  lastVerified: string;
  starsSource: StarsSource;
  repoUpdatedAt?: string;
  verificationNotes: string[];
}

/**
 * Storage schema interface
 */
interface StorageSchema {
  [StorageKey.REVIEWS]: Record<string, Review[]>;
  [StorageKey.VERIFICATIONS]: Record<string, AgentVerificationRecord>;
  [StorageKey.USER_PREFERENCES]: UserPreferences;
  [StorageKey.CHAT_HISTORY]: ChatHistoryEntry[];
  [StorageKey.SYNC_STATE]: SyncState;
  [StorageKey.ANALYTICS_CONSENT]: boolean;
}

interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  compactMode: boolean;
  notificationsEnabled: boolean;
  lastViewedCategory: string;
}

interface ChatHistoryEntry {
  role: 'user' | 'model';
  text: string;
  timestamp?: number;
}

interface SyncState {
  lastSync: string;
  pendingUpdates: string[];
}

/**
 * Versioned storage wrapper
 */
interface VersionedStorage<T> {
  version: number;
  data: T;
  lastModified: string;
}

/**
 * Review validation schema
 */
const validateReview = (review: unknown): review is Review => {
  if (!review || typeof review !== 'object') return false;
  
  const r = review as Record<string, unknown>;
  
  return (
    typeof r['id'] === 'string' &&
    typeof r['user'] === 'string' &&
    typeof r['rating'] === 'number' &&
    (r['rating'] as number) >= 1 &&
    (r['rating'] as number) <= 5 &&
    typeof r['comment'] === 'string' &&
    typeof r['date'] === 'string'
  );
};

const validateVerificationRecord = (rec: unknown): rec is AgentVerificationRecord => {
  if (!rec || typeof rec !== 'object') return false;
  const r = rec as Record<string, unknown>;
  const status = r['verificationStatus'];
  const starsSource = r['starsSource'];

  const validStatus: AgentVerificationStatus[] = ['UNVERIFIED', 'VERIFIED', 'DEGRADED', 'FAILED'];
  const validStars: StarsSource[] = ['REGISTRY', 'GITHUB_API', 'UNKNOWN'];

  return (
    typeof r['lastVerified'] === 'string' &&
    validStatus.includes(status as AgentVerificationStatus) &&
    validStars.includes(starsSource as StarsSource) &&
    Array.isArray(r['verificationNotes'])
  );
};

/**
 * Sanitize a review for safe storage
 */
const sanitizeReview = (review: Review): Review => ({
  id: review.id,
  user: sanitizeDisplayText(review.user.slice(0, 50)), // Limit username length
  rating: Math.max(1, Math.min(5, Math.round(review.rating))),
  comment: sanitizeDisplayText(review.comment.slice(0, 2000)), // Limit comment length
  date: review.date
});

/**
 * Storage service with comprehensive error handling
 */
export const StorageService = {
  /**
   * Get raw storage key with prefix
   */
  getKey: (key: StorageKey): string => `${STORAGE_PREFIX}${key}`,

  /**
   * Check if localStorage is available
   */
  isAvailable: (): boolean => {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get data from storage with validation
   */
  get: <K extends StorageKey>(key: K): StorageSchema[K] | null => {
    if (!StorageService.isAvailable()) {
      logger.warn('localStorage not available', { key });
      return null;
    }

    try {
      const raw = localStorage.getItem(StorageService.getKey(key));
      if (!raw) return null;

      const parsed: VersionedStorage<StorageSchema[K]> = JSON.parse(raw);
      
      // Version check for potential migrations
      if (parsed.version !== STORAGE_VERSION) {
        logger.info('Storage version mismatch, migrating', {
          key,
          storedVersion: parsed.version,
          currentVersion: STORAGE_VERSION
        });
        // For now, return null to trigger fresh data
        // In production, implement migration logic here
        return null;
      }

      return parsed.data;
    } catch (error) {
      logger.error('Storage read failed', {
        key,
        error: getErrorMessage(error)
      });
      return null;
    }
  },

  /**
   * Set data to storage with versioning
   */
  set: <K extends StorageKey>(key: K, data: StorageSchema[K]): boolean => {
    if (!StorageService.isAvailable()) {
      logger.warn('localStorage not available for write', { key });
      return false;
    }

    try {
      const wrapped: VersionedStorage<StorageSchema[K]> = {
        version: STORAGE_VERSION,
        data,
        lastModified: new Date().toISOString()
      };

      localStorage.setItem(StorageService.getKey(key), JSON.stringify(wrapped));
      return true;
    } catch (error) {
      // Handle quota exceeded
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        logger.error('Storage quota exceeded', { key });
        // Try to clear old data and retry
        StorageService.pruneOldData();
        try {
          const wrapped: VersionedStorage<StorageSchema[K]> = {
            version: STORAGE_VERSION,
            data,
            lastModified: new Date().toISOString()
          };
          localStorage.setItem(StorageService.getKey(key), JSON.stringify(wrapped));
          return true;
        } catch {
          return false;
        }
      }
      
      logger.error('Storage write failed', {
        key,
        error: getErrorMessage(error)
      });
      return false;
    }
  },

  /**
   * Remove data from storage
   */
  remove: (key: StorageKey): boolean => {
    if (!StorageService.isAvailable()) return false;

    try {
      localStorage.removeItem(StorageService.getKey(key));
      return true;
    } catch (error) {
      logger.error('Storage remove failed', {
        key,
        error: getErrorMessage(error)
      });
      return false;
    }
  },

  /**
   * Clear all app storage
   */
  clear: (): boolean => {
    if (!StorageService.isAvailable()) return false;

    try {
      Object.values(StorageKey).forEach(key => {
        localStorage.removeItem(StorageService.getKey(key));
      });
      return true;
    } catch (error) {
      logger.error('Storage clear failed', {
        error: getErrorMessage(error)
      });
      return false;
    }
  },

  /**
   * Prune old data to free space
   */
  pruneOldData: (): void => {
    try {
      // Clear chat history (can be regenerated)
      localStorage.removeItem(StorageService.getKey(StorageKey.CHAT_HISTORY));
      logger.info('Pruned old chat history to free storage');
    } catch (error) {
      logger.error('Prune failed', { error: getErrorMessage(error) });
    }
  },

  /**
   * Get storage usage statistics
   */
  getUsageStats: (): { used: number; available: number; keys: string[] } => {
    if (!StorageService.isAvailable()) {
      return { used: 0, available: 0, keys: [] };
    }

    const keys: string[] = [];
    let used = 0;

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key);
        const value = localStorage.getItem(key);
        if (value) {
          used += key.length + value.length;
        }
      }
    }

    // Estimate available (5MB typical limit)
    const estimatedLimit = 5 * 1024 * 1024;

    return {
      used: used * 2, // UTF-16 encoding
      available: Math.max(0, estimatedLimit - used * 2),
      keys
    };
  }
};

/**
 * Reviews-specific storage operations
 */
export const ReviewStorage = {
  /**
   * Get reviews for a specific agent
   */
  getReviews: (agentId: string): Review[] => {
    const allReviews = StorageService.get(StorageKey.REVIEWS) || {};
    return allReviews[agentId] || [];
  },

  /**
   * Get all reviews for all agents
   */
  getAllReviews: (): Record<string, Review[]> => {
    return StorageService.get(StorageKey.REVIEWS) || {};
  },

  /**
   * Add a new review for an agent
   */
  addReview: (agentId: string, review: Omit<Review, 'id' | 'date'>): Review | null => {
    try {
      const allReviews = StorageService.get(StorageKey.REVIEWS) || {};
      const agentReviews = allReviews[agentId] || [];

      // Generate unique ID and date
      const dateStr = new Date().toISOString().split('T')[0] ?? new Date().toISOString().slice(0, 10);
      const newReview: Review = {
        id: `user-${agentId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        user: review.user,
        rating: review.rating,
        comment: review.comment,
        date: dateStr
      };

      // Validate
      if (!validateReview(newReview)) {
        logger.error('Review validation failed', { agentId, review });
        return null;
      }

      // Sanitize
      const sanitized = sanitizeReview(newReview);

      // Limit reviews per agent to prevent storage bloat
      const MAX_REVIEWS_PER_AGENT = 50;
      const updatedReviews = [sanitized, ...agentReviews].slice(0, MAX_REVIEWS_PER_AGENT);

      allReviews[agentId] = updatedReviews;
      
      if (StorageService.set(StorageKey.REVIEWS, allReviews)) {
        logger.info('Review added', { agentId, reviewId: sanitized.id });
        return sanitized;
      }

      return null;
    } catch (error) {
      logger.error('Add review failed', {
        agentId,
        error: getErrorMessage(error)
      });
      return null;
    }
  },

  /**
   * Delete a review
   */
  deleteReview: (agentId: string, reviewId: string): boolean => {
    try {
      const allReviews = StorageService.get(StorageKey.REVIEWS) || {};
      const agentReviews = allReviews[agentId] || [];

      const filteredReviews = agentReviews.filter(r => r.id !== reviewId);
      
      if (filteredReviews.length === agentReviews.length) {
        // Review not found
        return false;
      }

      allReviews[agentId] = filteredReviews;
      return StorageService.set(StorageKey.REVIEWS, allReviews);
    } catch (error) {
      logger.error('Delete review failed', {
        agentId,
        reviewId,
        error: getErrorMessage(error)
      });
      return false;
    }
  }
};

/**
 * Verification-specific storage operations
 * Stores local verification state only (never fabricated)
 */
export const VerificationStorage = {
  getAll: (): Record<string, AgentVerificationRecord> => {
    const all = StorageService.get(StorageKey.VERIFICATIONS) || {};
    const entries = Object.entries(all);

    const sanitized: Record<string, AgentVerificationRecord> = {};
    for (const [agentId, rec] of entries) {
      if (validateVerificationRecord(rec)) {
        sanitized[agentId] = rec;
      }
    }
    return sanitized;
  },

  get: (agentId: string): AgentVerificationRecord | null => {
    const all = StorageService.get(StorageKey.VERIFICATIONS) || {};
    const rec = all[agentId];
    return validateVerificationRecord(rec) ? rec : null;
  },

  set: (agentId: string, record: AgentVerificationRecord): boolean => {
    const all = StorageService.get(StorageKey.VERIFICATIONS) || {};
    all[agentId] = record;
    return StorageService.set(StorageKey.VERIFICATIONS, all);
  },

  clear: (): boolean => StorageService.remove(StorageKey.VERIFICATIONS)
};

export default StorageService;
