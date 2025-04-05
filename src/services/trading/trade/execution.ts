
import { TradeExecution } from '@/types';
import { marketAssets } from '../../mockData';
import logger from '@/utils/logger';
import { getCircuitBreaker } from '@/utils/circuitBreaker';
import featureFlags from '@/utils/featureFlags';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { withRetry } from '../utils';
import { toast } from 'sonner';
import { initCircuitBreaker } from '../signalService';
import { checkRateLimit, recordTradeExecution } from './rateLimit';
import { validateTrade } from './validation';
import { recordTradeLog } from './logger';

/**
 * Execute a trade action
 */
export const executeTradeAction = async (
  modelId: string, 
  symbol: string, 
  action: 'BUY' | 'SELL', 
  quantity: number
): Promise<TradeExecution> => {
  try {
    // Validate the trade parameters
    const validation = validateTrade(modelId, symbol, action, quantity);
    if (!validation.valid) {
      throw new Error(validation.errorMessage);
    }
    
    // Check rate limit
    if (!checkRateLimit(symbol)) {
      const errorMessage = `Rate limit exceeded for ${symbol}. Maximum 5 trades per minute.`;
      logger.error(errorMessage);
      notificationManager.send(
        NotificationType.SYSTEM_ALERT,
        NotificationPriority.HIGH,
        "Rate Limit Exceeded",
        errorMessage
      );
      throw new Error(errorMessage);
    }
    
    // Initialize circuit breaker for this symbol
    initCircuitBreaker(symbol);
    
    logger.info(`Executing ${action} trade for ${quantity} ${symbol} using model ${modelId}`);
    
    // Record trade for rate limiting
    recordTradeExecution(symbol);
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker(`symbol-${symbol}`);
      
      return await circuitBreaker.execute(() => withRetry(() => executeTrade(modelId, symbol, action, quantity)));
    } else {
      return await withRetry(() => executeTrade(modelId, symbol, action, quantity));
    }
  } catch (error) {
    logger.error(`Error executing trade:`, error);
    notificationManager.send(
      NotificationType.TRADE_EXECUTION,
      NotificationPriority.HIGH,
      "Trade Execution Failed",
      error instanceof Error ? error.message : "An unexpected error occurred"
    );
    throw error;
  }
};

/**
 * Execute the actual trade
 */
const executeTrade = (
  modelId: string,
  symbol: string,
  action: 'BUY' | 'SELL',
  quantity: number
): Promise<TradeExecution> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const asset = marketAssets.find(a => a.symbol === symbol);
      if (!asset) {
        logger.error(`Asset with symbol ${symbol} not found`);
        toast.error("Trade execution failed", {
          description: `Asset ${symbol} not found`,
        });
        
        // Record failed trade
        recordTradeLog(modelId, action, symbol, quantity, 0, false, `Asset with symbol ${symbol} not found`);
        
        reject(new Error(`Asset with symbol ${symbol} not found`));
        return;
      }
      
      const trade: TradeExecution = {
        id: `trade-${Date.now()}`,
        symbol,
        timestamp: new Date().toISOString(),
        action,
        price: asset.price,
        quantity,
        value: parseFloat((asset.price * quantity).toFixed(2)),
        modelId
      };
      
      logger.info(`Trade executed successfully:`, trade);
      toast.success(`${action} order executed`, {
        description: `${quantity} ${symbol} at $${asset.price.toFixed(2)}`,
      });
      
      // Record successful trade log
      recordTradeLog(modelId, action, symbol, quantity, asset.price, true);
      
      resolve(trade);
    }, 1500);
  });
};
