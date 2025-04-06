
/**
 * Webhook Notification Handler
 * 
 * This utility handles incoming webhook notifications from external services
 * and integrates them with the notification system.
 */

import { v4 as uuidv4 } from 'uuid';
import { NotificationType, NotificationPriority, Notification } from './types';
import { sendNotification } from './sender';
import logger from '@/utils/logger';

interface WebhookPayload {
  source: string;
  eventType: string;
  title: string;
  message: string;
  priority?: string;
  data?: any;
}

/**
 * Map webhook event types to notification types
 */
const eventTypeToNotificationType: Record<string, NotificationType> = {
  'trade.executed': NotificationType.TRADE_EXECUTION,
  'market.alert': NotificationType.MARKET_ALERT,
  'model.alert': NotificationType.MODEL_ALERT,
  'system.alert': NotificationType.SYSTEM_ALERT,
  'performance.alert': NotificationType.PERFORMANCE_ALERT
};

/**
 * Map webhook priority to notification priority
 */
const priorityMap: Record<string, NotificationPriority> = {
  'low': NotificationPriority.LOW,
  'medium': NotificationPriority.MEDIUM,
  'high': NotificationPriority.HIGH,
  'critical': NotificationPriority.CRITICAL
};

/**
 * Process a webhook payload and create a notification
 */
export const processWebhookNotification = (payload: WebhookPayload): Notification | null => {
  try {
    // Validate required fields
    if (!payload.source || !payload.eventType || !payload.title || !payload.message) {
      logger.error('Invalid webhook payload:', payload);
      return null;
    }
    
    // Determine notification type based on event type
    const notificationType = eventTypeToNotificationType[payload.eventType] || NotificationType.SYSTEM_ALERT;
    
    // Determine priority
    const notificationPriority = payload.priority && priorityMap[payload.priority.toLowerCase()]
      ? priorityMap[payload.priority.toLowerCase()]
      : NotificationPriority.MEDIUM;
    
    // Create and send notification
    return sendNotification(
      notificationType,
      notificationPriority,
      `${payload.source}: ${payload.title}`,
      payload.message,
      {
        source: payload.source,
        eventType: payload.eventType,
        originalData: payload.data,
        webhookId: uuidv4()
      }
    );
  } catch (error) {
    logger.error('Error processing webhook notification:', error);
    return null;
  }
};

/**
 * Create a webhook subscription URL
 * Note: In a real app, this would be a more complex implementation with authentication
 */
export const createWebhookSubscription = (name: string): string => {
  const subscriptionId = uuidv4().slice(0, 8);
  // In a real implementation, this would store the subscription in a database
  logger.info(`Created webhook subscription: ${name} (${subscriptionId})`);
  return `https://api.example.com/webhooks/${subscriptionId}`;
};

