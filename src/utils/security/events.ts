/**
 * Security Events
 * Handles recording and retrieving security events
 */

import logger from "../logger";
import { toast } from "sonner";
import { SecurityEvent, SecurityEventType } from "./types";

// Storage key
const SECURITY_EVENTS_KEY = 'security_events';

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
