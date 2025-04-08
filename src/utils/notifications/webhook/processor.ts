
/**
 * General Webhook Processor
 * 
 * Handles processing of general webhook notifications
 */

import { v4 as uuidv4 } from 'uuid';
import { Notification, NotificationType } from '../types';
import { sendNotification } from '../sender';
import logger from '@/utils/logger';
import { WebhookPayload, eventTypeToNotificationType, priorityMap } from './types';

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
      : priorityMap.medium;
    
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
