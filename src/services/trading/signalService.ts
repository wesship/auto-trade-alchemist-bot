import { TradeSignal } from '../../types/trading';
import { getTradeSignals as mockGetTradeSignals } from '../mockData';
import logger from '@/utils/logger';
import securityUtils from '@/utils/securityUtils';
import { getCircuitBreaker } from '@/utils/circuitBreaker';
import featureFlags from '@/utils/featureFlags';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import { recordModelMetric } from '@/utils/monitoring';
import { toast } from 'sonner';
import { withRetry } from './utils';

/**
 * Initializes circuit breaker for a symbol
 */
export const initCircuitBreaker = (symbol: string): void => {
  if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
    const circuitBreaker = getCircuitBreaker(`symbol-${symbol}`, {
      failureThreshold: 5,
      resetTimeout: 30000,
      onStateChange: (oldState, newState) => {
        if (newState === 'OPEN') {
          logger.warn(`Circuit breaker triggered for ${symbol}`, { oldState, newState });
          notificationManager.send(
            NotificationType.SYSTEM_ALERT,
            NotificationPriority.HIGH,
            'Circuit Breaker Activated',
            `Trading for ${symbol} has been temporarily suspended due to errors`
          );
        } else if (newState === 'CLOSED' && oldState === 'OPEN') {
          logger.info(`Circuit breaker reset for ${symbol}`, { oldState, newState });
          notificationManager.send(
            NotificationType.SYSTEM_ALERT,
            NotificationPriority.MEDIUM,
            'Circuit Breaker Reset',
            `Trading for ${symbol} has been resumed`
          );
        }
      }
    });
  }
};

/**
 * Generates trade signals for a specific model and symbol
 */
export const generateTradeSignals = async (modelId: string, symbol: string): Promise<TradeSignal[]> => {
  try {
    // Input validation
    if (!modelId || !symbol) {
      logger.error("Invalid parameters for trade signal generation");
      notificationManager.send(
        NotificationType.SYSTEM_ALERT,
        NotificationPriority.MEDIUM,
        "Invalid Parameters",
        "Please provide valid model ID and symbol for signal generation"
      );
      return [];
    }
    
    // Security validation
    if (!securityUtils.validateSymbol(symbol)) {
      return [];
    }
    
    if (securityUtils.checkForSQLInjection(modelId) || securityUtils.checkForXSS(modelId)) {
      securityUtils.recordSecurityEvent(
        securityUtils.SecurityEventType.SUSPICIOUS_ACTIVITY,
        `Suspicious modelId for signal generation: ${modelId}`,
        'high'
      );
      return [];
    }
    
    // Initialize circuit breaker for this symbol
    initCircuitBreaker(symbol);
    
    logger.info(`Generating trade signals for model ${modelId} on ${symbol}`);
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker(`symbol-${symbol}`);
      
      const signals = await circuitBreaker.execute(() => 
        withRetry(() => mockGetTradeSignals(modelId, symbol))
      );
      
      if (signals.length > 0) {
        logger.info(`Generated ${signals.length} trade signals successfully`);
        notificationManager.send(
          NotificationType.TRADE_EXECUTION,
          NotificationPriority.LOW,
          "Trade Signals Generated",
          `Generated ${signals.length} signals for ${symbol}`
        );
        
        // Record model metrics
        const mockMetrics = {
          modelId,
          accuracy: 0.75 + (Math.random() * 0.2 - 0.1),
          precision: 0.7 + (Math.random() * 0.2 - 0.1),
          recall: 0.7 + (Math.random() * 0.2 - 0.1),
          f1Score: 0.7 + (Math.random() * 0.2 - 0.1),
          profitLoss: Math.random() > 0.6 ? Math.random() * 1000 : -Math.random() * 500,
          successRate: 0.6 + (Math.random() * 0.3 - 0.1),
          tradeCount: Math.floor(Math.random() * 50) + 10,
          timestamp: new Date().toISOString()
        };
        
        recordModelMetric(mockMetrics);
      } else {
        logger.warn(`No trade signals generated for ${symbol}`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.LOW,
          "No Signals Generated",
          `No trade signals were generated for ${symbol}`
        );
      }
      
      return signals;
    } else {
      const signals = await withRetry(() => mockGetTradeSignals(modelId, symbol));
      
      if (signals.length > 0) {
        logger.info(`Generated ${signals.length} trade signals successfully`);
        toast.success(`Generated ${signals.length} trading signals`, {
          description: `For ${symbol} using model ${modelId.substring(0, 8)}...`,
        });
      } else {
        logger.warn(`No trade signals generated for ${symbol}`);
        toast.warning("No trade signals generated", {
          description: `Try different parameters or another asset`,
        });
      }
      
      return signals;
    }
  } catch (error) {
    logger.error(`Error generating trade signals for model ${modelId}:`, error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.HIGH,
      "Signal Generation Error",
      "Failed to generate trade signals"
    );
    return [];
  }
};
