
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

export enum NotificationDeliveryMethod {
  IN_APP = 'IN_APP',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WEBHOOK = 'WEBHOOK',
  DESKTOP = 'DESKTOP'
}

export interface NotificationPreference {
  type: NotificationType;
  enabled: boolean;
  minPriority: NotificationPriority;
  deliveryMethods?: NotificationDeliveryMethod[];
  soundEnabled?: boolean;
  categoryIds?: string[];
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
  categoryIds?: string[];
  source?: string;
}

// Storage keys
export const PREFERENCES_KEY = 'notification_preferences';
export const NOTIFICATIONS_KEY = 'user_notifications';

/**
 * Sound options for notifications
 */
export enum NotificationSound {
  DEFAULT = 'default',
  ALERT = 'alert',
  BELL = 'bell',
  CHIME = 'chime',
  DING = 'ding',
  NONE = 'none'
}

/**
 * Sound settings
 */
export interface NotificationSoundSettings {
  enabled: boolean;
  volume: number; // 0-1
  sound: NotificationSound;
  muteTimeRanges?: Array<{
    start: string; // HH:MM format
    end: string; // HH:MM format
    days?: number[]; // 0-6, 0 is Sunday
  }>;
}

// Default sound settings
export const DEFAULT_SOUND_SETTINGS: NotificationSoundSettings = {
  enabled: true,
  volume: 0.5,
  sound: NotificationSound.DEFAULT
};

