/**
 * Production-Grade Logger
 * Centralized logging service with structured output, batching, and export capabilities
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  CRITICAL = 'critical'
}

/**
 * Log level priority for filtering
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  [LogLevel.DEBUG]: 0,
  [LogLevel.INFO]: 1,
  [LogLevel.WARN]: 2,
  [LogLevel.ERROR]: 3,
  [LogLevel.CRITICAL]: 4
};

interface LogEntry {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  timestamp: number;
  sessionId?: string;
}

/**
 * Logger configuration
 */
interface LoggerConfig {
  maxLogs: number;
  minLevel: LogLevel;
  enableConsole: boolean;
  enableBatching: boolean;
  batchSize: number;
  flushIntervalMs: number;
}

const DEFAULT_CONFIG: LoggerConfig = {
  maxLogs: 1000,
  minLevel: LogLevel.DEBUG,
  enableConsole: true,
  enableBatching: false,
  batchSize: 50,
  flushIntervalMs: 30000
};

/**
 * Determines if running in development mode
 */
const isDevelopment = (): boolean => {
  try {
    return import.meta.env?.DEV === true || import.meta.env?.MODE === 'development';
  } catch {
    return false;
  }
};

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private batch: LogEntry[] = [];
  private config: LoggerConfig;
  private sessionId: string;
  private flushInterval: ReturnType<typeof setInterval> | null = null;

  private constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.sessionId = this.generateSessionId();
    
    if (this.config.enableBatching) {
      this.startBatchFlush();
    }
  }

  private generateSessionId(): string {
    return `log-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  private startBatchFlush(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flushInterval = setInterval(() => {
      this.flushBatch();
    }, this.config.flushIntervalMs);
  }

  static getInstance(config?: Partial<LoggerConfig>): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger(config);
    }
    return Logger.instance;
  }

  /**
   * Configure the logger after instantiation
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
    
    if (this.config.enableBatching && !this.flushInterval) {
      this.startBatchFlush();
    } else if (!this.config.enableBatching && this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
      this.flushBatch(); // Flush remaining
    }
  }

  /**
   * Core logging method with level filtering and batching support
   */
  log(level: LogLevel, message: string, context?: Record<string, unknown>): void {
    // Filter by minimum level
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.config.minLevel]) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      context: context ? this.sanitizeContext(context) : undefined,
      timestamp: Date.now(),
      sessionId: this.sessionId
    };

    // Add to main log store
    this.logs.push(entry);
    if (this.logs.length > this.config.maxLogs) {
      this.logs.shift();
    }

    // Add to batch if batching enabled
    if (this.config.enableBatching) {
      this.batch.push(entry);
      if (this.batch.length >= this.config.batchSize) {
        this.flushBatch();
      }
    }

    // Console output
    if (this.config.enableConsole && isDevelopment()) {
      this.writeToConsole(entry);
    }
  }

  /**
   * Sanitizes context to prevent circular references and oversized data
   */
  private sanitizeContext(context: Record<string, unknown>): Record<string, unknown> {
    try {
      const sanitized: Record<string, unknown> = {};
      
      for (const [key, value] of Object.entries(context)) {
        if (value === undefined) continue;
        
        if (typeof value === 'string') {
          // Truncate long strings
          sanitized[key] = value.length > 500 ? value.slice(0, 500) + '...' : value;
        } else if (typeof value === 'number' || typeof value === 'boolean') {
          sanitized[key] = value;
        } else if (value === null) {
          sanitized[key] = null;
        } else if (value instanceof Error) {
          sanitized[key] = {
            name: value.name,
            message: value.message,
            stack: value.stack?.slice(0, 500)
          };
        } else if (Array.isArray(value)) {
          sanitized[key] = value.slice(0, 10).map(v => 
            typeof v === 'object' ? '[object]' : v
          );
        } else if (typeof value === 'object') {
          // Shallow copy for nested objects
          sanitized[key] = '[object]';
        } else {
          sanitized[key] = String(value);
        }
      }
      
      return sanitized;
    } catch {
      return { _error: 'Failed to sanitize context' };
    }
  }

  /**
   * Writes a log entry to the console with appropriate formatting
   */
  private writeToConsole(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const contextStr = entry.context ? ` | ${JSON.stringify(entry.context)}` : '';
    const prefix = `[${timestamp}][${entry.level.toUpperCase()}]`;
    
    const method = 
      entry.level === LogLevel.ERROR || entry.level === LogLevel.CRITICAL ? 'error' :
      entry.level === LogLevel.WARN ? 'warn' :
      entry.level === LogLevel.DEBUG ? 'debug' : 'log';
    
    console[method](`${prefix} ${entry.message}${contextStr}`);
  }

  /**
   * Persists batch to IndexedDB for durable local storage
   * Implements production-grade persistence with quota management
   */
  private async persistToIndexedDB(entries: LogEntry[]): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('cliever_logs', 1);
        
        request.onerror = () => {
          // IndexedDB not available (private browsing, etc.)
          resolve(false);
        };
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('logs')) {
            const store = db.createObjectStore('logs', { keyPath: 'id', autoIncrement: true });
            store.createIndex('timestamp', 'timestamp', { unique: false });
            store.createIndex('level', 'level', { unique: false });
            store.createIndex('sessionId', 'sessionId', { unique: false });
          }
        };
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          try {
            const transaction = db.transaction(['logs'], 'readwrite');
            const store = transaction.objectStore('logs');
            
            // Add entries
            entries.forEach(entry => {
              store.add({
                ...entry,
                persistedAt: Date.now()
              });
            });
            
            // Prune old entries to prevent unbounded growth (keep last 5000)
            const countRequest = store.count();
            countRequest.onsuccess = () => {
              const count = countRequest.result;
              if (count > 5000) {
                const deleteCount = count - 5000;
                const cursorRequest = store.openCursor();
                let deleted = 0;
                
                cursorRequest.onsuccess = (e) => {
                  const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
                  if (cursor && deleted < deleteCount) {
                    cursor.delete();
                    deleted++;
                    cursor.continue();
                  }
                };
              }
            };
            
            transaction.oncomplete = () => {
              db.close();
              resolve(true);
            };
            
            transaction.onerror = () => {
              db.close();
              resolve(false);
            };
          } catch {
            db.close();
            resolve(false);
          }
        };
      } catch {
        resolve(false);
      }
    });
  }

  /**
   * Flushes the batch to IndexedDB for persistent storage
   * Production implementation with fallback to console logging
   */
  private flushBatch(): void {
    if (this.batch.length === 0) return;
    
    const batchToFlush = [...this.batch];
    this.batch = [];
    
    // Persist to IndexedDB asynchronously
    this.persistToIndexedDB(batchToFlush).then((success) => {
      if (isDevelopment()) {
        console.debug(`[Logger] Flushed ${batchToFlush.length} log entries (persisted: ${success})`);
      }
    }).catch(() => {
      // Fallback: Log to console if persistence fails
      if (isDevelopment()) {
        console.debug(`[Logger] Flushed ${batchToFlush.length} log entries (console only)`);
      }
    });
  }

  // Convenience methods
  debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.ERROR, message, context);
  }

  critical(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.CRITICAL, message, context);
  }

  /**
   * Get all logs
   */
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by level
   */
  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  /**
   * Get logs within a time range
   */
  getLogsInRange(startTime: number, endTime: number): LogEntry[] {
    return this.logs.filter(log => 
      log.timestamp >= startTime && log.timestamp <= endTime
    );
  }

  /**
   * Export logs in various formats
   */
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = 'timestamp,level,message,context\n';
      const rows = this.logs.map(log => 
        `${log.timestamp},${log.level},"${log.message.replace(/"/g, '""')}","${
          log.context ? JSON.stringify(log.context).replace(/"/g, '""') : ''
        }"`
      ).join('\n');
      return headers + rows;
    }
    
    return JSON.stringify(this.logs, null, 2);
  }

  /**
   * Get log statistics
   */
  getStats(): Record<string, number> {
    const stats: Record<string, number> = {
      total: this.logs.length,
      debug: 0,
      info: 0,
      warn: 0,
      error: 0,
      critical: 0
    };
    
    this.logs.forEach(log => {
      stats[log.level]++;
    });
    
    return stats;
  }

  /**
   * Clear all logs from memory and IndexedDB
   */
  clear(): void {
    this.logs = [];
    this.batch = [];
    
    // Also clear IndexedDB
    this.clearPersistedLogs().catch(() => {
      // Ignore errors during clear
    });
  }

  /**
   * Clear persisted logs from IndexedDB
   */
  private async clearPersistedLogs(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const request = indexedDB.open('cliever_logs', 1);
        
        request.onerror = () => reject(new Error('Failed to open IndexedDB'));
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          try {
            const transaction = db.transaction(['logs'], 'readwrite');
            const store = transaction.objectStore('logs');
            store.clear();
            
            transaction.oncomplete = () => {
              db.close();
              resolve();
            };
            
            transaction.onerror = () => {
              db.close();
              reject(new Error('Failed to clear logs'));
            };
          } catch (err) {
            db.close();
            reject(err);
          }
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Retrieve persisted logs from IndexedDB
   * Useful for crash analysis and historical debugging
   */
  async getPersistedLogs(options?: { 
    limit?: number; 
    level?: LogLevel; 
    since?: number 
  }): Promise<LogEntry[]> {
    return new Promise((resolve) => {
      try {
        const request = indexedDB.open('cliever_logs', 1);
        
        request.onerror = () => resolve([]);
        
        request.onsuccess = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          try {
            const transaction = db.transaction(['logs'], 'readonly');
            const store = transaction.objectStore('logs');
            const results: LogEntry[] = [];
            
            // Use timestamp index for efficient retrieval
            const index = store.index('timestamp');
            const range = options?.since 
              ? IDBKeyRange.lowerBound(options.since)
              : undefined;
            
            const cursorRequest = index.openCursor(range, 'prev'); // Newest first
            const limit = options?.limit ?? 1000;
            
            cursorRequest.onsuccess = (e) => {
              const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
              
              if (cursor && results.length < limit) {
                const entry = cursor.value as LogEntry;
                
                // Filter by level if specified
                if (!options?.level || entry.level === options.level) {
                  results.push(entry);
                }
                
                cursor.continue();
              } else {
                db.close();
                resolve(results);
              }
            };
            
            cursorRequest.onerror = () => {
              db.close();
              resolve([]);
            };
          } catch {
            db.close();
            resolve([]);
          }
        };
      } catch {
        resolve([]);
      }
    });
  }

  /**
   * Cleanup method for component unmount
   */
  dispose(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    this.flushBatch();
  }
}

export const logger = Logger.getInstance();
