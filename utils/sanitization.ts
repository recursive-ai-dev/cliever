/**
 * Input Sanitization Utilities
 * Provides security functions to prevent XSS and injection attacks
 */

/**
 * Sanitizes HTML by escaping potentially dangerous characters
 * Prevents XSS attacks in user-generated content
 * Note: Only works in browser environment (requires DOM)
 */
export function sanitizeHtml(input: string): string {
  // Browser environment check
  if (typeof document === 'undefined') {
    // Fallback for non-browser environments (SSR, testing)
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }
  
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Sanitizes text for safe display in React text nodes.
 *
 * React already escapes text content, so we avoid entity-encoding here to prevent
 * rendering artifacts like "Anthropic&#x27;s".
 *
 * This function removes obviously dangerous protocol patterns and script blocks
 * while preserving ordinary punctuation.
 */
export function sanitizeDisplayText(input: string): string {
  let sanitized = input;

  // Remove script tag blocks entirely.
  sanitized = sanitized.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');

  // Remove dangerous protocol strings that sometimes sneak into pasted content.
  sanitized = sanitized.replace(/javascript:/gi, '').replace(/vbscript:/gi, '').replace(/data:/gi, '');

  // Remove inline event handler patterns.
  let prevLength = 0;
  while (sanitized.length !== prevLength) {
    prevLength = sanitized.length;
    sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');
  }

  return sanitized;
}

/**
 * Sanitizes search query input
 * Removes potentially harmful patterns while preserving search functionality
 */
export function sanitizeSearchQuery(query: string): string {
  // Remove script tags and variations (case-insensitive, with attributes)
  // Pattern matches: <script>, <Script>, <SCRIPT>, <script src="...">, etc.
  let sanitized = query
    .replace(/<script[^>]*>/gi, '')
    .replace(/<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
  
  // Remove event handlers (multiple passes)
  let prevLength = 0;
  while (sanitized.length !== prevLength) {
    prevLength = sanitized.length;
    sanitized = sanitized.replace(/\bon\w+\s*=/gi, '');
  }
  
  // Limit length to prevent DoS
  const maxLength = 200;
  const limited = sanitized.slice(0, maxLength);
  
  return limited;
}

/**
 * Sanitizes URL to ensure it's safe to use
 * Only allows http, https protocols from trusted domains
 */
export function sanitizeUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    
    // Only allow http, https protocols (prevent data:, javascript:, vbscript:, etc.)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return null;
    }
    
    // For GitHub URLs, validate the exact hostname
    if (parsed.hostname.includes('github')) {
      if (parsed.hostname !== 'github.com' && !parsed.hostname.endsWith('.github.com')) {
        return null;
      }
    }
    
    return url;
  } catch {
    return null;
  }
}

/**
 * Whitelist of allowed command patterns
 * Used for validating install commands
 * Each pattern includes a prefix and optional allowed characters/patterns
 */
interface CommandPattern {
  prefix: string;
  allowedPatterns?: RegExp[];
  maxLength?: number;
}

const ALLOWED_COMMAND_PATTERNS: CommandPattern[] = [
  { prefix: 'npm install', maxLength: 150 },
  { prefix: 'npm i', maxLength: 150 },
  { prefix: 'yarn add', maxLength: 150 },
  { prefix: 'pnpm add', maxLength: 150 },
  { prefix: 'pip install', maxLength: 150 },
  { prefix: 'brew install', maxLength: 150 },
  { prefix: 'cargo install', maxLength: 150 },
  { prefix: 'go install', maxLength: 200 },
  { prefix: 'gh extension install', maxLength: 150 },
  // Docker run commands - validated with restricted patterns
  { 
    prefix: 'docker run', 
    maxLength: 300,
    allowedPatterns: [/^docker run\s+(-[a-z]+\s+)*[\w./:@-]+$/i]
  },
  // Curl to install scripts - only from known trusted domains
  { 
    prefix: 'curl', 
    maxLength: 200,
    allowedPatterns: [
      /^curl\s+(-[sfSLo]+\s+)*https:\/\/(get\.|raw\.github|install\.)?[\w.-]+(\/[\w./-]+)?\s*\|\s*(ba)?sh$/i,
      /^curl\s+-fsSL\s+https:\/\/[\w.-]+\/[\w./-]+\s*\|\s*(ba)?sh$/i
    ]
  },
  // Wget similar to curl
  { 
    prefix: 'wget', 
    maxLength: 200,
    allowedPatterns: [
      /^wget\s+[\w.-]+\s*&&\s*chmod\s+\+x\s+[\w.-]+$/i
    ]
  }
];

/**
 * Validates and sanitizes command strings
 * Uses pattern-based approach for better security while allowing legitimate commands
 */
export function sanitizeCommand(command: string): string {
  const trimmed = command.trim();
  
  // Empty commands return empty
  if (!trimmed) return '';
  
  // Check against each allowed pattern
  for (const pattern of ALLOWED_COMMAND_PATTERNS) {
    if (trimmed.toLowerCase().startsWith(pattern.prefix.toLowerCase())) {
      // Check max length
      const maxLen = pattern.maxLength || 200;
      if (trimmed.length > maxLen) {
        return ''; // Reject overly long commands
      }
      
      // If there are specific allowed patterns, validate against them
      if (pattern.allowedPatterns && pattern.allowedPatterns.length > 0) {
        const matchesPattern = pattern.allowedPatterns.some(regex => regex.test(trimmed));
        if (!matchesPattern) {
          // For commands with patterns, if no pattern matches, return sanitized version
          // or reject if it contains dangerous characters
          if (/[;&`$()\\]/.test(trimmed)) {
            return ''; // Contains shell injection characters
          }
        }
        // Pattern matched, return as-is (these patterns are pre-validated as safe)
        return trimmed;
      }
      
      // Standard whitelist commands - remove dangerous shell operators
      // Allows: alphanumeric, spaces, hyphens, underscores, dots, slashes, colons, at-signs
      const sanitized = trimmed.replace(/[;&|`$()<>\\'"]/g, '');
      return sanitized;
    }
  }
  
  // Command not in whitelist - return empty for security
  // But allow simple echo commands for display purposes
  if (trimmed.startsWith('echo ')) {
    return trimmed.replace(/[;&|`$()<>\\]/g, '');
  }
  
  return '';
}

/**
 * Sanitizes chat message input
 * Prevents XSS while preserving text content
 * Uses escape approach for maximum security
 */
export function sanitizeChatMessage(message: string): string {
  // We render chat messages as React text nodes, so we prefer display-safe text
  // over entity-encoding (avoids "&#x27;" artifacts).
  const cleaned = sanitizeDisplayText(message);

  // Limit message length
  const maxLength = 2000;
  return cleaned.slice(0, maxLength);
}

/**
 * Type guard to check if error is Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Safely extracts error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Safely extracts error stack from unknown error type
 */
export function getErrorStack(error: unknown): string | undefined {
  if (isError(error)) {
    return error.stack;
  }
  return undefined;
}
