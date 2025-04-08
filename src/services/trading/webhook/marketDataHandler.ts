
/**
 * Market Data Webhook Handler
 * Handles requests for market data via webhooks
 */

import logger from '@/utils/logger';
import { fetchMarketData } from '../marketService';
import { WebhookErrorResponse, WebhookSuccessResponse } from './types';
import { validateWebhookSecret, errorResponse, handleUnauthorizedAccess } from './auth';

/**
 * Handles a market data webhook request
 */
export const handleMarketDataWebhook = async (secret: string): Promise<WebhookSuccessResponse<any> | WebhookErrorResponse> => {
  if (!validateWebhookSecret(secret)) {
    return handleUnauthorizedAccess(secret);
  }
  
  try {
    logger.info('Webhook: Fetching market data', { webhookSecret: secret });
    const assets = await fetchMarketData();
    return {
      status: 'success',
      data: assets,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Webhook: Error fetching market data', error);
    return errorResponse('Error fetching market data', 500);
  }
};
