
/**
 * Webhook Service
 * Main export file for webhook functionality
 */

import { handleMarketDataWebhook } from './marketDataHandler';
import { handleTradeWebhook } from './tradeHandler';
import { handleStrategyGenerationWebhook } from './strategyHandler';
import { registerWebhookSecret } from './auth';

// Export all webhook handlers
export {
  handleMarketDataWebhook,
  handleTradeWebhook,
  handleStrategyGenerationWebhook,
  registerWebhookSecret
};

// Export default object with all webhook utilities
export default {
  handleMarketDataWebhook,
  handleTradeWebhook,
  handleStrategyGenerationWebhook,
  registerWebhookSecret
};
