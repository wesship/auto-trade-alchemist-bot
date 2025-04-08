
/**
 * Webhook Types
 * Contains type definitions for the webhook service
 */

export interface WebhookSecret {
  name: string;
  permissions: string[];
}

export interface WebhookErrorResponse {
  status: number;
  error: string;
  timestamp: string;
}

export interface WebhookSuccessResponse<T> {
  status: 'success';
  data: T;
  timestamp: string;
}

export interface TradeWebhookData {
  modelId: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
}

export interface StrategyGenerationWebhookData {
  modelId: string;
  promptId: string;
}
