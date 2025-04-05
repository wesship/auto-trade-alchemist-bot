
/**
 * Notification Preferences Management
 * 
 * This utility manages user notification preferences.
 */

import { NotificationType, NotificationPreference, PREFERENCES_KEY } from './types';

// Default user preferences
export const DEFAULT_PREFERENCES: Record<NotificationType, NotificationPreference> = {
  [NotificationType.TRADE_EXECUTION]: {
    type: NotificationType.TRADE_EXECUTION,
    enabled: true,
    minPriority: NotificationPriority.LOW
  },
  [NotificationType.MODEL_ALERT]: {
    type: NotificationType.MODEL_ALERT,
    enabled: true,
    minPriority: NotificationPriority.MEDIUM
  },
  [NotificationType.MARKET_ALERT]: {
    type: NotificationType.MARKET_ALERT,
    enabled: true,
    minPriority: NotificationPriority.MEDIUM
  },
  [NotificationType.SYSTEM_ALERT]: {
    type: NotificationType.SYSTEM_ALERT,
    enabled: true,
    minPriority: NotificationPriority.LOW
  },
  [NotificationType.PERFORMANCE_ALERT]: {
    type: NotificationType.PERFORMANCE_ALERT,
    enabled: true,
    minPriority: NotificationPriority.MEDIUM
  }
};

// Initialize notification preferences from localStorage
let userPreferences: Record<NotificationType, NotificationPreference> = { ...DEFAULT_PREFERENCES };

// Import NotificationPriority here to avoid circular dependency
import { NotificationPriority } from './types';

// Load preferences on module load
try {
  const storedPrefs = localStorage.getItem(PREFERENCES_KEY);
  if (storedPrefs) {
    userPreferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) };
  }
} catch (error) {
  console.error('Failed to load notification preferences:', error);
}

/**
 * Save notification preferences to localStorage
 */
export const savePreferences = (): void => {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(userPreferences));
  } catch (error) {
    console.error('Failed to save notification preferences:', error);
  }
};

/**
 * Get user notification preferences
 */
export const getNotificationPreferences = (): Record<NotificationType, NotificationPreference> => {
  return { ...userPreferences };
};

/**
 * Update notification preferences
 */
export const updateNotificationPreference = (preference: Partial<NotificationPreference> & { type: NotificationType }): void => {
  userPreferences[preference.type] = {
    ...userPreferences[preference.type],
    ...preference
  };
  savePreferences();
};

/**
 * Reset notification preferences to defaults
 */
export const resetNotificationPreferences = (): void => {
  userPreferences = { ...DEFAULT_PREFERENCES };
  savePreferences();
};
