
/**
 * Notification System Types
 * 
 * This file contains all types for the notification system.
 */

export enum NotificationType {
  TRADE_EXECUTION = 'TRADE_EXECUTION',
  MODEL_ALERT = 'MODEL_ALERT',
  MARKET_ALERT = 'MARKET_ALERT',
  SYSTEM_ALERT = 'SYSTEM_ALERT',
  PERFORMANCE_ALERT = 'PERFORMANCE_ALERT'
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  minPriority: NotificationPriority;
}

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

// Storage keys
export const PREFERENCES_KEY = 'notification_preferences';
export const NOTIFICATIONS_KEY = 'user_notifications';
