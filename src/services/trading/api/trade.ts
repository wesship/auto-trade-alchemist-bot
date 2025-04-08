
/**
 * Trade API
 * Handles trade execution requests via the API
 */

import logger from '@/utils/logger';
import { executeTradeAction } from '../trade/execution';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { ApiErrorResponse, ApiTradeRequest } from './types';
import { validateApiKey, hasPermission, errorResponse, handleUnauthorizedAccess, handleInsufficientPermissions, getApiKeyName } from './auth';
import { TradeExecution } from '@/types/trading';

/**
 * Execute a trade
 */
export const executeTrade = async (
  apiKey: string, 
  request: ApiTradeRequest
): Promise<TradeExecution | ApiErrorResponse> => {
  if (!validateApiKey(apiKey)) {
    logger.warn('Unauthorized API access attempt', { apiKey });
    return handleUnauthorizedAccess(apiKey);
  }
  
  if (!hasPermission(apiKey, 'write')) {
    logger.warn('Insufficient permissions for trade execution', { apiKey });
    return handleInsufficientPermissions(apiKey);
  }
  
  try {
    const { modelId, symbol, action, quantity } = request;
    const keyName = getApiKeyName(apiKey);
    logger.info('API: Executing trade', { apiKey, modelId, symbol, action, quantity });
    
    // Validate inputs
    if (!modelId || !symbol || !action || quantity <= 0) {
      return errorResponse('Invalid trade parameters', 400);
    }
    
    const trade = await executeTradeAction(modelId, symbol, action, quantity);
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "API Trade Executed",
      `${action} ${quantity} ${symbol} at $${trade.price} via API (${keyName})`
    );
    
    return trade;
  } catch (error) {
    logger.error('API: Error executing trade', error);
    return errorResponse('Error executing trade', 500);
  }
};
