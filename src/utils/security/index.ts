
/**
 * Security Utilities
 * 
 * Enhanced security measures to protect the trading platform
 */

// Re-export all security components
export * from './types';
export * from './events';
export * from './inputValidation';
export * from './injectionDetection';

// Default export with all security utilities
import { SecurityEventType } from './types';
import { recordSecurityEvent, getSecurityEvents } from './events';
import { sanitizeInput, validateSymbol, validateQuantity } from './inputValidation';
import { checkForSQLInjection, checkForXSS } from './injectionDetection';

export default {
  recordSecurityEvent,
  getSecurityEvents,
  sanitizeInput,
  validateSymbol,
  validateQuantity,
  checkForSQLInjection,
  checkForXSS,
  SecurityEventType
};
