
/**
 * TradingView Webhook Handler
 * 
 * Processes webhooks specifically from TradingView
 */

import { v4 as uuidv4 } from 'uuid';
import { NotificationType, NotificationPriority } from '../types';
import { sendNotification } from '../sender';
import logger from '@/utils/logger';
import { validateTradeExecution } from '@/utils/validation/tradeValidator';
import { TradeWebhookPayload } from './types';

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
