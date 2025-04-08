
/**
 * Injection Detection
 * Functions for detecting potential injection attacks
 */

import { recordSecurityEvent } from "./events";
import { SecurityEventType } from "./types";

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
