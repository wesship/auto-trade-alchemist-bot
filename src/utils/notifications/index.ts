
/**
 * Notification Manager
 * 
 * This utility provides a unified interface for managing notifications
 * across the application.
 */

// Re-export all components from the notifications folder
export * from './types';
export * from './preferences';
export * from './storage';
export * from './sender';

// Create a default export with all notification utilities
import { NotificationType, NotificationPriority } from './types';
import { 
  getNotificationPreferences, 
  updateNotificationPreference, 
  resetNotificationPreferences 
} from './preferences';
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification, 
  clearAllNotifications 
} from './storage';
import { sendNotification } from './sender';

// Default export with all notification utilities
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
