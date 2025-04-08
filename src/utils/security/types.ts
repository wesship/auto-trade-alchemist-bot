
/**
 * Security Types
 * Contains type definitions for the security utilities
 */

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
