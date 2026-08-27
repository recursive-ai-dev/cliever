/**
 * Production-Grade Data Validation Utilities
 * Provides runtime validation for all data structures with comprehensive error reporting
 */

import { Agent, AgentCategory, Review } from '../types';
import { logger } from '../services/logger';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Creates a successful validation result
 */
const success = (): ValidationResult => ({
  valid: true,
  errors: [],
  warnings: []
});

/**
 * Creates a failed validation result
 */
const failure = (errors: string[], warnings: string[] = []): ValidationResult => ({
  valid: false,
  errors,
  warnings
});

/**
 * Merges multiple validation results
 */
export const mergeValidationResults = (...results: ValidationResult[]): ValidationResult => {
  const errors = results.flatMap(r => r.errors);
  const warnings = results.flatMap(r => r.warnings);
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * Validates a string field with length constraints
 */
const validateString = (
  value: unknown, 
  fieldName: string, 
  minLength: number = 1, 
  maxLength: number = 1000
): ValidationResult => {
  if (typeof value !== 'string') {
    return failure([`${fieldName}: expected string, got ${typeof value}`]);
  }
  if (value.length < minLength) {
    return failure([`${fieldName}: length ${value.length} below minimum ${minLength}`]);
  }
  if (value.length > maxLength) {
    return failure([`${fieldName}: length ${value.length} exceeds maximum ${maxLength}`]);
  }
  return success();
};

/**
 * Validates a number field with range constraints
 */
const validateNumber = (
  value: unknown, 
  fieldName: string, 
  min: number = Number.MIN_SAFE_INTEGER, 
  max: number = Number.MAX_SAFE_INTEGER
): ValidationResult => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return failure([`${fieldName}: expected finite number, got ${typeof value}`]);
  }
  if (value < min) {
    return failure([`${fieldName}: value ${value} below minimum ${min}`]);
  }
  if (value > max) {
    return failure([`${fieldName}: value ${value} exceeds maximum ${max}`]);
  }
  return success();
};

/**
 * Validates an array field with element validation
 */
const validateArray = (
  value: unknown,
  fieldName: string,
  elementValidator: (element: unknown, index: number) => ValidationResult,
  minLength: number = 0,
  maxLength: number = 100
): ValidationResult => {
  if (!Array.isArray(value)) {
    return failure([`${fieldName}: expected array, got ${typeof value}`]);
  }
  if (value.length < minLength) {
    return failure([`${fieldName}: array length ${value.length} below minimum ${minLength}`]);
  }
  if (value.length > maxLength) {
    return failure([`${fieldName}: array length ${value.length} exceeds maximum ${maxLength}`]);
  }
  
  const elementErrors: string[] = [];
  const elementWarnings: string[] = [];
  
  value.forEach((element, index) => {
    const result = elementValidator(element, index);
    elementErrors.push(...result.errors.map(e => `${fieldName}[${index}]: ${e}`));
    elementWarnings.push(...result.warnings.map(w => `${fieldName}[${index}]: ${w}`));
  });
  
  return {
    valid: elementErrors.length === 0,
    errors: elementErrors,
    warnings: elementWarnings
  };
};

/**
 * Validates URL format
 */
const validateUrl = (value: unknown, fieldName: string): ValidationResult => {
  const stringResult = validateString(value, fieldName, 1, 500);
  if (!stringResult.valid) return stringResult;
  
  try {
    const url = new URL(value as string);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return failure([`${fieldName}: URL must use http or https protocol`]);
    }
    return success();
  } catch {
    return failure([`${fieldName}: invalid URL format`]);
  }
};

/**
 * Validates a Review object
 */
export const validateReview = (review: unknown): ValidationResult => {
  if (!review || typeof review !== 'object') {
    return failure(['Review: expected object']);
  }
  
  const r = review as Record<string, unknown>;
  
  return mergeValidationResults(
    validateString(r['id'], 'id', 1, 100),
    validateString(r['user'], 'user', 1, 50),
    validateNumber(r['rating'], 'rating', 1, 5),
    validateString(r['comment'], 'comment', 1, 2000),
    validateString(r['date'], 'date', 10, 10)
  );
};

/**
 * Validates agent category
 */
const validateCategory = (value: unknown): ValidationResult => {
  if (typeof value !== 'string') {
    return failure(['category: expected string']);
  }
  
  const validCategories = Object.values(AgentCategory);
  if (!validCategories.includes(value as AgentCategory)) {
    return {
      valid: true,
      errors: [],
      warnings: [`category: "${value}" is not a standard category`]
    };
  }
  return success();
};

/**
 * Validates a complete Agent object
 */
export const validateAgent = (agent: unknown): ValidationResult => {
  if (!agent || typeof agent !== 'object') {
    return failure(['Agent: expected object']);
  }
  
  const a = agent as Record<string, unknown>;
  
  const results = [
    validateString(a['id'], 'id', 1, 50),
    validateString(a['name'], 'name', 1, 100),
    validateString(a['description'], 'description', 1, 500),
    validateString(a['longDescription'], 'longDescription', 1, 2000),
    validateCategory(a['category']),
    validateNumber(a['stars'], 'stars', 0, 10000000),
    validateString(a['language'], 'language', 1, 50),
    validateString(a['installCommand'], 'installCommand', 1, 300),
    validateUrl(a['repoUrl'], 'repoUrl'),
    validateArray(
      a['features'], 
      'features',
      (el) => validateString(el, 'feature', 1, 100),
      0, 
      20
    ),
    validateArray(
      a['tags'],
      'tags',
      (el) => validateString(el, 'tag', 1, 30),
      0,
      20
    ),
    validateArray(
      a['useCases'],
      'useCases',
      (el) => validateString(el, 'useCase', 1, 200),
      0,
      10
    ),
    validateArray(
      a['reviews'] || [],
      'reviews',
      validateReview,
      0,
      100
    )
  ];
  
  return mergeValidationResults(...results);
};

/**
 * Validates an array of agents and returns sanitized list
 */
export const validateAgents = (agents: unknown[]): {
  valid: Agent[];
  invalid: Array<{ index: number; errors: string[] }>;
  warnings: string[];
} => {
  const valid: Agent[] = [];
  const invalid: Array<{ index: number; errors: string[] }> = [];
  const warnings: string[] = [];
  
  agents.forEach((agent, index) => {
    const result = validateAgent(agent);
    
    if (result.valid) {
      valid.push(agent as Agent);
      if (result.warnings.length > 0) {
        warnings.push(...result.warnings.map(w => `Agent[${index}]: ${w}`));
      }
    } else {
      invalid.push({ index, errors: result.errors });
      logger.warn('Invalid agent data', {
        index,
        agentId: (agent as Record<string, unknown>)?.['id'],
        errors: result.errors
      });
    }
  });
  
  return { valid, invalid, warnings };
};

/**
 * Sanitizes an agent by applying safe defaults and clamping values
 */
export const sanitizeAgent = (agent: Agent): Agent => {
  return {
    ...agent,
    id: agent.id?.slice(0, 50) || 'unknown',
    name: agent.name?.slice(0, 100) || 'Unknown Agent',
    description: agent.description?.slice(0, 500) || '',
    longDescription: agent.longDescription?.slice(0, 2000) || agent.description || '',
    stars: Math.max(0, Math.min(10000000, agent.stars || 0)),
    features: (agent.features || []).slice(0, 20),
    tags: (agent.tags || []).slice(0, 20),
    useCases: (agent.useCases || []).slice(0, 10),
    reviews: (agent.reviews || []).slice(0, 100),
    lastSynced: agent.lastSynced || new Date().toISOString()
  };
};

/**
 * Type guard for Agent
 */
export const isValidAgent = (value: unknown): value is Agent => {
  return validateAgent(value).valid;
};

/**
 * Type guard for Review
 */
export const isValidReview = (value: unknown): value is Review => {
  return validateReview(value).valid;
};

export default {
  validateAgent,
  validateAgents,
  validateReview,
  sanitizeAgent,
  isValidAgent,
  isValidReview,
  mergeValidationResults
};
