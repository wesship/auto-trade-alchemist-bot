
/**
 * Notification Sender
 * 
 * This utility handles the creation and delivery of notifications.
 */

import { toast } from "sonner";
import { 
  Notification, 
  NotificationType, 
  NotificationPriority
} from './types';
import { getNotificationPreferences } from './preferences';
import { saveNotification } from './storage';

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
  const preferences = getNotificationPreferences();
  const preference = preferences[type];
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
  saveNotification(notification);
  
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
