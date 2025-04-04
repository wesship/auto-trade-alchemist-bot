/**
 * Enhanced logging system for trading activities
 */

// Log levels
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  TRADE = 'TRADE'
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: any;
  source?: string;
}

// Maximum number of logs to keep in memory
const MAX_LOGS = 1000;

// In-memory log storage
const logs: LogEntry[] = [];

/**
 * Add a log entry
 */
const addLog = (level: LogLevel, message: string, data?: any, source?: string): LogEntry => {
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    data,
    source
  };
  
  // Add to in-memory logs
  logs.unshift(logEntry);
  
  // Trim logs if they exceed the maximum
  if (logs.length > MAX_LOGS) {
    logs.length = MAX_LOGS;
  }
  
  // Also log to console
  const logMethod = level === LogLevel.ERROR ? console.error :
                    level === LogLevel.WARN ? console.warn :
                    console.log;
  
  logMethod(`[${level}] ${message}`, data ? data : '');
  
  // If this is a TRADE log, also persist it to localStorage
  if (level === LogLevel.TRADE) {
    persistTradeLog(logEntry);
  }
  
  return logEntry;
};

/**
 * Persist trade logs to localStorage
 */
const persistTradeLog = (logEntry: LogEntry): void => {
  try {
    const storedLogs = localStorage.getItem('tradeLogs');
    const tradeLogs = storedLogs ? JSON.parse(storedLogs) : [];
    
    tradeLogs.unshift(logEntry);
    
    // Keep only the last 100 trade logs
    if (tradeLogs.length > 100) {
      tradeLogs.length = 100;
    }
    
    localStorage.setItem('tradeLogs', JSON.stringify(tradeLogs));
  } catch (error) {
    console.error('Failed to persist trade log:', error);
  }
};

/**
 * Get all logs
 */
export const getLogs = (level?: LogLevel, limit = 100): LogEntry[] => {
  if (level) {
    return logs.filter(log => log.level === level).slice(0, limit);
  }
  return logs.slice(0, limit);
};

/**
 * Get trade logs from localStorage
 */
export const getTradeLogs = (): LogEntry[] => {
  try {
    const storedLogs = localStorage.getItem('tradeLogs');
    return storedLogs ? JSON.parse(storedLogs) : [];
  } catch (error) {
    console.error('Failed to retrieve trade logs:', error);
    return [];
  }
};

/**
 * Clear all logs
 */
export const clearLogs = (): void => {
  logs.length = 0;
};

/**
 * Export logger methods
 */
export const logger = {
  debug: (message: string, data?: any, source?: string) => 
    addLog(LogLevel.DEBUG, message, data, source),
  
  info: (message: string, data?: any, source?: string) => 
    addLog(LogLevel.INFO, message, data, source),
  
  warn: (message: string, data?: any, source?: string) => 
    addLog(LogLevel.WARN, message, data, source),
  
  error: (message: string, data?: any, source?: string) => 
    addLog(LogLevel.ERROR, message, data, source),
  
  trade: (message: string, data?: any, source?: string) => 
    addLog(LogLevel.TRADE, message, data, source),
  
  getLogs,
  getTradeLogs,
  clearLogs
};

// Export a default logger instance
export default logger;
