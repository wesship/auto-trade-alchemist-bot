import { TradeExecution, TradeLog } from '../../types/trading';
import { marketAssets } from '../mockData';
import logger from '@/utils/logger';
import securityUtils from '@/utils/securityUtils';
import { getCircuitBreaker } from '@/utils/circuitBreaker';
import featureFlags from '@/utils/featureFlags';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { validateTradeExecution } from '@/utils/dataValidator';
import { withRetry } from './utils';
import { toast } from 'sonner';
import { initCircuitBreaker } from './signalService';

// Maximum trades per symbol per minute
const MAX_TRADES_PER_MINUTE = 5;
// Tracking recent trade executions to implement rate limiting
const recentTradeExecutions: { timestamp: number; symbol: string }[] = [];
// Trading logs for audit purposes
const tradeLogs: TradeLog[] = [];

/**
 * Check if we're exceeding rate limits for a symbol
 */
const checkRateLimit = (symbol: string): boolean => {
  const now = Date.now();
  const oneMinuteAgo = now - 60000;
  
  // Clean up old executions
  while (recentTradeExecutions.length > 0 && recentTradeExecutions[0].timestamp < oneMinuteAgo) {
    recentTradeExecutions.shift();
  }
  
  // Count recent trades for this symbol
  const recentTradesForSymbol = recentTradeExecutions.filter(
    execution => execution.symbol === symbol
  ).length;
  
  if (recentTradesForSymbol >= MAX_TRADES_PER_MINUTE) {
    securityUtils.recordSecurityEvent(
      securityUtils.SecurityEventType.RATE_LIMIT_EXCEEDED,
      `Rate limit exceeded for symbol: ${symbol}`,
      'medium'
    );
    return false;
  }
  
  return true;
};

/**
 * Record a trade execution for rate limiting
 */
const recordTradeExecution = (symbol: string, action: 'BUY' | 'SELL', modelId: string): void => {
  recentTradeExecutions.push({
    timestamp: Date.now(),
    symbol
  });
  
  // Also add to trade logs
  const tradeLog: TradeLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    modelId,
    action,
    symbol,
    timestamp: new Date().toISOString(),
    quantity: 0,
    price: 0,
    executed: true
  };
  
  tradeLogs.push(tradeLog);
  
  // Keep trade logs at a reasonable size
  if (tradeLogs.length > 1000) {
    tradeLogs.shift();
  }
};

/**
 * Get trade logs for auditing
 */
export const getTradeLogs = (): TradeLog[] => {
  return [...tradeLogs];
};

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
    // Input validation using the data validation pipeline
    const validationResults = validateTradeExecution(symbol, action, quantity);
    if (validationResults.length > 0) {
      const errorMessage = validationResults.map(r => r.message).join('; ');
      logger.error(`Trade validation failed: ${errorMessage}`, { modelId, symbol, action, quantity });
      notificationManager.send(
        NotificationType.TRADE_EXECUTION,
        NotificationPriority.HIGH,
        "Trade Validation Failed",
        errorMessage
      );
      throw new Error(errorMessage);
    }
    
    // Security validation
    if (!securityUtils.validateSymbol(symbol) || !securityUtils.validateQuantity(quantity)) {
      throw new Error("Invalid trade parameters");
    }
    
    // Check rate limit
    if (!checkRateLimit(symbol)) {
      const errorMessage = `Rate limit exceeded for ${symbol}. Maximum ${MAX_TRADES_PER_MINUTE} trades per minute.`;
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
    recordTradeExecution(symbol, action, modelId);
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker(`symbol-${symbol}`);
      
      return await circuitBreaker.execute(() => withRetry(() => new Promise((resolve, reject) => {
        setTimeout(() => {
          const asset = marketAssets.find(a => a.symbol === symbol);
          if (!asset) {
            logger.error(`Asset with symbol ${symbol} not found`);
            notificationManager.send(
              NotificationType.TRADE_EXECUTION,
              NotificationPriority.HIGH,
              "Trade Execution Failed",
              `Asset ${symbol} not found`
            );
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
          
          logger.info(`Trade executed: ${action} ${quantity} ${symbol} at $${asset.price.toFixed(2)}`, trade);
          notificationManager.send(
            NotificationType.TRADE_EXECUTION,
            NotificationPriority.MEDIUM,
            "Trade Executed",
            `${action} ${quantity} ${symbol} at $${asset.price.toFixed(2)}`
          );
          
          // Add to trade logs
          const tradeLog: TradeLog = {
            id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
            modelId,
            action,
            symbol,
            timestamp: new Date().toISOString(),
            quantity,
            price: asset.price,
            executed: true
          };
          
          tradeLogs.push(tradeLog);
          
          resolve(trade);
        }, 1500);
      })));
    } else {
      return await withRetry(() => new Promise((resolve, reject) => {
        setTimeout(() => {
          const asset = marketAssets.find(a => a.symbol === symbol);
          if (!asset) {
            logger.error(`Asset with symbol ${symbol} not found`);
            toast.error("Trade execution failed", {
              description: `Asset ${symbol} not found`,
            });
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
          
          resolve(trade);
        }, 1500);
      }));
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
