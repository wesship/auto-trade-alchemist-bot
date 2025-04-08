
/**
 * Webhook Notification Types
 */
import { NotificationType, NotificationPriority } from '../types';

export interface WebhookPayload {
  source: string;
  eventType: string;
  title: string;
  message: string;
  priority?: string;
  data?: any;
}

export interface TradeWebhookPayload extends WebhookPayload {
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
export const eventTypeToNotificationType: Record<string, NotificationType> = {
  'trade.executed': NotificationType.TRADE_EXECUTION,
  'market.alert': NotificationType.MARKET_ALERT,
  'model.alert': NotificationType.MODEL_ALERT,
  'system.alert': NotificationType.SYSTEM_ALERT,
  'performance.alert': NotificationType.PERFORMANCE_ALERT
};

/**
 * Map webhook priority to notification priority
 */
export const priorityMap: Record<string, NotificationPriority> = {
  'low': NotificationPriority.LOW,
  'medium': NotificationPriority.MEDIUM,
  'high': NotificationPriority.HIGH,
  'critical': NotificationPriority.CRITICAL
};
