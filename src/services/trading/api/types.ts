
/**
 * API Types
 * Contains type definitions for the API service
 */

export interface ApiKey {
  name: string;
  permissions: string[];
}

export interface ApiErrorResponse {
  status: number;
  error: string;
  timestamp: string;
}

export interface ApiTradeRequest {
  modelId: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  quantity: number;
}

export interface ApiStrategyRequest {
  modelId: string;
  promptId: string;
}

export interface ApiModelComparisonRequest {
  promptId: string;
  modelIds?: string[];
}
