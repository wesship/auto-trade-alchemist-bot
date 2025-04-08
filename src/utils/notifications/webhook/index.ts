
/**
 * Webhook Notification Handler
 * 
 * This utility handles incoming webhook notifications from external services
 * and integrates them with the notification system.
 */

// Re-export all webhook components
export * from './processor';
export * from './tradingView';
export * from './subscription';
export * from './types';

// Default export with all webhook utilities
import { processWebhookNotification } from './processor';
import { processTradingViewWebhook } from './tradingView';
import { createWebhookSubscription, getWebhookSecretToken } from './subscription';

export default {
  processWebhook: processWebhookNotification,
  processTradingViewWebhook,
  createWebhookSubscription,
  getWebhookSecretToken
};
