/**
 * Security Utilities
 * 
 * Enhanced security measures to protect the trading platform
 */

import { toast } from "sonner";
import logger from "./logger";

// Storage keys
const AUTH_ATTEMPTS_KEY = 'auth_attempts';
const BLOCKED_IPS_KEY = 'blocked_ips';
const SECURITY_EVENTS_KEY = 'security_events';

export enum SecurityEventType {
  INVALID_INPUT = 'INVALID_INPUT',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  UNAUTHORIZED_ACCESS = 'UNAUTHORIZED_ACCESS',
  SUSPICIOUS_ACTIVITY = 'SUSPICIOUS_ACTIVITY'
}

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
  ipAddress?: string;
}

/**
 * Record a security event
 */
export const recordSecurityEvent = (
  type: SecurityEventType,
  details: string,
  severity: 'low' | 'medium' | 'high' = 'medium'
): void => {
  try {
    const event: SecurityEvent = {
      type,
      timestamp: new Date().toISOString(),
      details,
      severity,
      ipAddress: 'client' // In a real app, you'd get the actual IP
    };
    
    const storedEvents = localStorage.getItem(SECURITY_EVENTS_KEY);
    const events: SecurityEvent[] = storedEvents ? JSON.parse(storedEvents) : [];
    
    events.unshift(event);
    
    // Keep only the latest 100 events
    if (events.length > 100) {
      events.length = 100;
    }
    
    localStorage.setItem(SECURITY_EVENTS_KEY, JSON.stringify(events));
    
    // Log the security event
    logger.warn(`Security event: ${type}`, event);
    
    // For high severity events, show a toast notification
    if (severity === 'high') {
      toast.error('Security Alert', {
        description: 'A security issue was detected. Please contact support if this persists.'
      });
    }
  } catch (error) {
    console.error('Failed to record security event:', error);
  }
};

/**
 * Get all security events
 */
export const getSecurityEvents = (): SecurityEvent[] => {
  try {
    const storedEvents = localStorage.getItem(SECURITY_EVENTS_KEY);
    return storedEvents ? JSON.parse(storedEvents) : [];
  } catch (error) {
    console.error('Failed to retrieve security events:', error);
    return [];
  }
};

/**
 * Validate input to prevent injection attacks
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';
  
  // Remove potentially dangerous characters 
  // This is a basic implementation - in a real app you'd want more robust sanitization
  return input
    .replace(/[<>&"']/g, '')  // Remove HTML/script characters
    .trim();
};

/**
 * Validate a trading symbol 
 */
export const validateSymbol = (symbol: string): boolean => {
  if (!symbol) return false;
  
  // Only allow alphanumeric characters, -, . and $ in stock symbols
  const validPattern = /^[A-Z0-9\-\.$]{1,20}$/i;
  const isValid = validPattern.test(symbol);
  
  if (!isValid) {
    recordSecurityEvent(
      SecurityEventType.INVALID_INPUT,
      `Invalid symbol format: ${symbol}`,
      'medium'
    );
  }
  
  return isValid;
};

/**
 * Validate quantity to prevent unreasonable values
 */
export const validateQuantity = (quantity: number): boolean => {
  const isValid = Number.isInteger(quantity) && quantity > 0 && quantity <= 1000000;
  
  if (!isValid) {
    recordSecurityEvent(
      SecurityEventType.INVALID_INPUT,
      `Invalid trade quantity: ${quantity}`,
      'medium'
    );
  }
  
  return isValid;
};

/**
 * Check if input appears to contain SQL injection attempts
 */
export const checkForSQLInjection = (input: string): boolean => {
  if (!input) return false;
  
  // Basic checks for common SQL injection patterns
  const suspiciousPatterns = [
    /(\s|^)SELECT(\s|\(|$)/i,
    /(\s|^)INSERT(\s|\(|$)/i,
    /(\s|^)UPDATE(\s|\(|$)/i,
    /(\s|^)DELETE(\s|\(|$)/i,
    /(\s|^)DROP(\s|\(|$)/i,
    /(\s|^)UNION(\s|\(|$)/i,
    /(\s|^)OR(\s|\(|$).*?=.*?/i,
    /--/,
    /;.*?/
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(input));
  
  if (isSuspicious) {
    recordSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      `Potential SQL injection detected: ${input}`,
      'high'
    );
  }
  
  return isSuspicious;
};

/**
 * Check if input appears to contain XSS attempts
 */
export const checkForXSS = (input: string): boolean => {
  if (!input) return false;
  
  // Basic checks for common XSS patterns
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i,
    /<iframe/i,
    /document\./i,
    /eval\(/i,
    /alert\(/i
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(input));
  
  if (isSuspicious) {
    recordSecurityEvent(
      SecurityEventType.SUSPICIOUS_ACTIVITY,
      `Potential XSS attack detected: ${input}`,
      'high'
    );
  }
  
  return isSuspicious;
};

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
