
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
export * from './categories';
export * from './webhook';

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
import {
  getNotificationCategories,
  addNotificationCategory,
  updateNotificationCategory,
  deleteNotificationCategory
} from './categories';
import {
  processWebhookNotification,
  createWebhookSubscription
} from './webhook';

// Default export with all notification utilities
export default {
  // Preferences
  getPreferences: getNotificationPreferences,
  updatePreference: updateNotificationPreference,
  resetPreferences: resetNotificationPreferences,
  
  // Notifications management
  getNotifications,
  markAsRead: markNotificationAsRead,
  markAllAsRead: markAllNotificationsAsRead,
  deleteNotification,
  clearAll: clearAllNotifications,
  send: sendNotification,
  
  // Categories
  getCategories: getNotificationCategories,
  addCategory: addNotificationCategory,
  updateCategory: updateNotificationCategory,
  deleteCategory: deleteNotificationCategory,
  
  // Webhooks
  processWebhook: processWebhookNotification,
  createWebhookSubscription,
  
  // Constants
  NotificationType,
  NotificationPriority
};
