
/**
 * Webhook Service
 * This file re-exports all webhook functionality from the modular structure
 * for backward compatibility.
 * 
 * New code should import directly from the webhook directory.
 */

// Re-export everything from webhook modules
export {
  handleMarketDataWebhook,
  handleTradeWebhook,
  handleStrategyGenerationWebhook,
  registerWebhookSecret
} from './webhook';

// Export default for backward compatibility
import {
  handleMarketDataWebhook,
  handleTradeWebhook,
  handleStrategyGenerationWebhook,
  registerWebhookSecret
} from './webhook';

// Export webhook functions
export default {
  handleMarketDataWebhook,
  handleTradeWebhook,
  handleStrategyGenerationWebhook,
  registerWebhookSecret
};
