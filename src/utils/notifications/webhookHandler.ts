
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
import { validateTradeExecution } from '@/utils/validation/tradeValidator';

interface WebhookPayload {
  source: string;
  eventType: string;
  title: string;
  message: string;
  priority?: string;
  data?: any;
}

interface TradeWebhookPayload extends WebhookPayload {
  data: {
    symbol: string;
    side: 'BUY' | 'SELL';
    qty: number;
    strategy?: string;
  }
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
 * Process a trade execution webhook (TradingView format)
 * This supports the format outlined in the Python project
 */
export const processTradingViewWebhook = (
  payload: TradeWebhookPayload, 
  token: string,
  secretToken: string
): { success: boolean; message: string; data?: any } => {
  try {
    // Validate webhook token
    if (token !== secretToken) {
      logger.warn('Invalid webhook token received');
      return { 
        success: false, 
        message: 'Invalid authentication token' 
      };
    }

    // Validate trade data
    if (!payload.data || !payload.data.symbol || !payload.data.side || !payload.data.qty) {
      return { 
        success: false, 
        message: 'Missing required trade parameters' 
      };
    }

    // Validate trade execution
    const validationResults = validateTradeExecution(
      payload.data.symbol,
      payload.data.side,
      payload.data.qty
    );

    // If validation fails, return error
    if (validationResults.some(result => !result.isValid)) {
      const errorMessages = validationResults
        .filter(result => !result.isValid)
        .map(result => result.message)
        .join('; ');
      
      return {
        success: false,
        message: errorMessages
      };
    }

    // Create a notification for the trade
    const notification = sendNotification(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      `Trade Signal: ${payload.data.side} ${payload.data.symbol}`,
      `Received ${payload.data.side} signal for ${payload.data.qty} shares of ${payload.data.symbol}${
        payload.data.strategy ? ` using strategy ${payload.data.strategy}` : ''
      }`,
      {
        source: 'tradingview',
        symbol: payload.data.symbol,
        side: payload.data.side,
        quantity: payload.data.qty,
        strategy: payload.data.strategy,
        webhookId: uuidv4()
      }
    );

    // Log the trade
    logger.trade(
      `TradingView webhook: ${payload.data.side} ${payload.data.qty} ${payload.data.symbol}`,
      payload.data,
      'webhook'
    );

    return {
      success: true,
      message: 'Trade signal received and processed',
      data: {
        notification: notification?.id,
        timestamp: new Date().toISOString(),
        status: 'queued'
      }
    };
  } catch (error) {
    logger.error('Error processing TradingView webhook:', error);
    return {
      success: false,
      message: 'Internal server error processing webhook'
    };
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

/**
 * Get a secret token for webhook authentication
 * In a production app, this would be more secure and stored in a database
 */
export const getWebhookSecretToken = (): string => {
  // In a real implementation, this would retrieve from environment variables or generate and store in the database
  return process.env.WEBHOOK_SECRET || uuidv4();
};

