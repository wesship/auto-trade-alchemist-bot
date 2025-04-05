
/**
 * Notification Storage Management
 * 
 * This utility handles storing and retrieving notifications.
 */

import { Notification, NOTIFICATIONS_KEY } from './types';

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
 * Save a notification to storage
 */
export const saveNotification = (notification: Notification): void => {
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
};
