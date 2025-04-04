
/**
 * Notification Manager
 * 
 * This utility manages user notification preferences and handles
 * the delivery of notifications.
 */

import { toast } from "sonner";

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

// Default user preferences
const DEFAULT_PREFERENCES: Record<NotificationType, NotificationPreference> = {
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

// Storage keys
const PREFERENCES_KEY = 'notification_preferences';
const NOTIFICATIONS_KEY = 'user_notifications';

/**
 * Initialize notification preferences from localStorage
 */
let userPreferences: Record<NotificationType, NotificationPreference> = { ...DEFAULT_PREFERENCES };

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
const savePreferences = (): void => {
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

/**
 * Get all user notifications
 */
export const getNotifications = (): Notification[] => {
  try {
    const storedNotifications = localStorage.getItem(NOTIFICATIONS_KEY);
    return storedNotifications ? JSON.parse(storedNotifications) : [];
  } catch (error) {
    console.error('Failed to retrieve notifications:', error);
    return [];
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = (notificationId: string): void => {
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsAsRead = (): void => {
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.map(notification => ({ 
      ...notification, 
      read: true 
    }));
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to mark all notifications as read:', error);
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = (notificationId: string): void => {
  try {
    const notifications = getNotifications();
    const updatedNotifications = notifications.filter(
      notification => notification.id !== notificationId
    );
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));
  } catch (error) {
    console.error('Failed to delete notification:', error);
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = (): void => {
  localStorage.removeItem(NOTIFICATIONS_KEY);
};

/**
 * Send a notification
 */
export const sendNotification = (
  type: NotificationType,
  priority: NotificationPriority,
  title: string,
  message: string,
  data?: any
): Notification | null => {
  // Check if this type of notification is enabled
  const preference = userPreferences[type];
  if (!preference || !preference.enabled) {
    return null;
  }
  
  // Check if this notification meets the minimum priority
  const priorityValues = {
    [NotificationPriority.LOW]: 1,
    [NotificationPriority.MEDIUM]: 2,
    [NotificationPriority.HIGH]: 3,
    [NotificationPriority.CRITICAL]: 4
  };
  
  if (priorityValues[priority] < priorityValues[preference.minPriority]) {
    return null;
  }
  
  // Create notification object
  const notification: Notification = {
    id: `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    priority,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false,
    data
  };
  
  // Save to storage
  try {
    const notifications = getNotifications();
    notifications.unshift(notification);
    
    // Limit to 100 notifications
    if (notifications.length > 100) {
      notifications.pop();
    }
    
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Failed to save notification:', error);
  }
  
  // Show toast notification based on priority
  switch (priority) {
    case NotificationPriority.CRITICAL:
      toast.error(title, { description: message });
      break;
    case NotificationPriority.HIGH:
      toast.error(title, { description: message });
      break;
    case NotificationPriority.MEDIUM:
      toast.warning(title, { description: message });
      break;
    case NotificationPriority.LOW:
    default:
      toast.info(title, { description: message });
      break;
  }
  
  return notification;
};

export default {
  getPreferences: getNotificationPreferences,
  updatePreference: updateNotificationPreference,
  resetPreferences: resetNotificationPreferences,
  getNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  deleteNotification,
  clearAll: clearAllNotifications,
  send: sendNotification,
  NotificationType,
  NotificationPriority
};
