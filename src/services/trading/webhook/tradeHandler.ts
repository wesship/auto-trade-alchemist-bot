
/**
 * Trade Webhook Handler
 * Handles trade execution requests via webhooks
 */

import logger from '@/utils/logger';
import { executeTradeAction } from '../trade/execution';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { TradeWebhookData, WebhookErrorResponse, WebhookSuccessResponse } from './types';
import { validateWebhookSecret, hasPermission, errorResponse, handleUnauthorizedAccess, handleInsufficientPermissions, getWebhookSecretName } from './auth';

/**
 * Handles a trade execution webhook request
 */
export const handleTradeWebhook = async (
  secret: string,
  data: TradeWebhookData
): Promise<WebhookSuccessResponse<any> | WebhookErrorResponse> => {
  if (!validateWebhookSecret(secret)) {
    return handleUnauthorizedAccess(secret);
  }
  
  if (!hasPermission(secret, 'write')) {
    return handleInsufficientPermissions(secret);
  }
  
  try {
    const { modelId, symbol, action, quantity } = data;
    const secretName = getWebhookSecretName(secret);
    logger.info('Webhook: Executing trade', { webhook: secretName, modelId, symbol, action, quantity });
    
    // Validate inputs
    if (!modelId || !symbol || !action || quantity <= 0) {
      return errorResponse('Invalid trade parameters', 400);
    }
    
    const trade = await executeTradeAction(modelId, symbol, action, quantity);
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "Webhook Trade Executed",
      `${action} ${quantity} ${symbol} at $${trade.price} via webhook (${secretName})`
    );
    
    return {
      status: 'success',
      data: trade,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Webhook: Error executing trade', error);
    return errorResponse('Error executing trade', 500);
  }
};
