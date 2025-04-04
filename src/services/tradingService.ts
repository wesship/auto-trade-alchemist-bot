import { 
  Asset, 
  ModelConfig, 
  TradeSignal, 
  TradeExecution, 
  AITradingModel, 
  ModelRetrainingConfig, 
  CircuitBreakerConfig,
  TradeLog,
  ModelMetrics,
  ModelHealth
} from '../types/trading';
import { marketAssets, aiTradingModels, trainModel as mockTrainModel, getTradeSignals as mockGetTradeSignals } from './mockData';
import { toast } from "sonner";
import { getCircuitBreaker, CircuitState } from '@/utils/circuitBreaker';
import logger, { LogLevel } from '@/utils/logger';
import { marketDataValidator, validateTradeExecution } from '@/utils/dataValidator';
import featureFlags from '@/utils/featureFlags';
import securityUtils from '@/utils/securityUtils';
import notificationManager, { NotificationType, NotificationPriority } from '@/utils/notificationManager';
import modelMonitoring from '@/utils/modelMonitoring';

// Maximum number of API call retries
const MAX_RETRIES = 3;
// Tracking recent trade executions to implement rate limiting
const recentTradeExecutions: { timestamp: number; symbol: string }[] = [];
// Maximum trades per symbol per minute
const MAX_TRADES_PER_MINUTE = 5;

// Additional tracking for circuit breakers
const symbolCircuitBreakers: Record<string, CircuitBreakerConfig> = {};

// Trading logs for audit purposes
const tradeLogs: TradeLog[] = [];

/**
 * Retry a function with exponential backoff
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    const delay = 1000 * Math.pow(2, MAX_RETRIES - retries); // Exponential backoff
    logger.warn(`Retrying after ${delay}ms, ${retries} retries left`, { error, retries });
    
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(withRetry(fn, retries - 1));
      }, delay);
    });
  }
};

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
const recordTradeExecution = (symbol: string): void => {
  recentTradeExecutions.push({
    timestamp: Date.now(),
    symbol
  });
  
  // Also add to trade logs
  const tradeLog: TradeLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    modelId: 'system',
    action: 'BUY', // Placeholder
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
 * Initialize circuit breaker for a symbol
 */
const initCircuitBreaker = (symbol: string): void => {
  if (!symbolCircuitBreakers[symbol] && featureFlags.isEnabled('CIRCUIT_BREAKER')) {
    symbolCircuitBreakers[symbol] = {
      enabled: true,
      failureThreshold: 5,
      resetTimeout: 30000, // 30 seconds
      monitorInterval: 60000 // 1 minute
    };
    
    getCircuitBreaker(`symbol-${symbol}`, {
      failureThreshold: 5,
      resetTimeout: 30000,
      onStateChange: (oldState, newState) => {
        if (newState === CircuitState.OPEN) {
          logger.warn(`Circuit breaker triggered for ${symbol}`, { oldState, newState });
          notificationManager.send(
            NotificationType.SYSTEM_ALERT,
            NotificationPriority.HIGH,
            'Circuit Breaker Activated',
            `Trading for ${symbol} has been temporarily suspended due to errors`
          );
        } else if (newState === CircuitState.CLOSED && oldState === CircuitState.OPEN) {
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

export const fetchMarketData = async (): Promise<Asset[]> => {
  try {
    logger.info("Fetching market data...");
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker('market-data');
      return await circuitBreaker.execute(async () => {
        return await withRetry(() => new Promise((resolve) => {
          setTimeout(() => {
            logger.info("Market data fetched successfully");
            
            // Validate market data
            const validAssets = marketAssets.filter(asset => {
              const validationResults = marketDataValidator.validate(asset);
              if (validationResults.length > 0) {
                logger.warn(`Asset validation warnings for ${asset.symbol}`, { validationResults });
              }
              return marketDataValidator.isValid(asset);
            });
            
            resolve(validAssets);
          }, 800);
        }));
      });
    } else {
      return await withRetry(() => new Promise((resolve) => {
        setTimeout(() => {
          logger.info("Market data fetched successfully");
          resolve(marketAssets);
        }, 800);
      }));
    }
  } catch (error) {
    logger.error("Error fetching market data:", error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.HIGH,
      "Market Data Error",
      "Failed to fetch market data"
    );
    return [];
  }
};

export const fetchModels = async (): Promise<AITradingModel[]> => {
  try {
    logger.info("Fetching AI models...");
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        logger.info("AI models fetched successfully");
        
        // Add health metrics to models
        const modelsWithHealth = aiTradingModels.map(model => ({
          ...model,
          health: generateModelHealth(model.config.id)
        }));
        
        resolve(modelsWithHealth);
      }, 1000);
    }));
  } catch (error) {
    logger.error("Error fetching models:", error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.MEDIUM,
      "Model Fetch Error",
      "Failed to fetch AI models"
    );
    return [];
  }
};

export const fetchModelById = async (modelId: string): Promise<AITradingModel | null> => {
  try {
    if (!modelId) {
      logger.error("Invalid model ID provided");
      toast.error("Invalid model ID", {
        description: "Please provide a valid model ID",
      });
      return null;
    }
    
    // Input validation
    if (securityUtils.checkForSQLInjection(modelId) || securityUtils.checkForXSS(modelId)) {
      securityUtils.recordSecurityEvent(
        securityUtils.SecurityEventType.SUSPICIOUS_ACTIVITY,
        `Suspicious modelId provided: ${modelId}`,
        'high'
      );
      return null;
    }
    
    logger.info(`Fetching model with ID: ${modelId}`);
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        const model = aiTradingModels.find(m => m.config.id === modelId) || null;
        if (model) {
          logger.info(`Model ${modelId} fetched successfully`);
          
          // Add health metrics
          const modelWithHealth = {
            ...model,
            health: generateModelHealth(modelId)
          };
          
          resolve(modelWithHealth);
        } else {
          logger.warn(`Model ${modelId} not found`);
          notificationManager.send(
            NotificationType.MODEL_ALERT,
            NotificationPriority.LOW,
            "Model Not Found",
            `The requested model ${modelId} could not be found`
          );
          resolve(null);
        }
      }, 800);
    }));
  } catch (error) {
    logger.error(`Error fetching model ${modelId}:`, error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.MEDIUM,
      "Model Fetch Error",
      `Failed to fetch model ${modelId}`
    );
    return null;
  }
};

/**
 * Generate sample model health data
 */
const generateModelHealth = (modelId: string): ModelHealth => {
  // In a real application, this would be based on actual metrics
  return {
    accuracy: 0.75 + (Math.random() * 0.2 - 0.1), // 65-85% accuracy
    drift: Math.random() > 0.8 ? 'WARNING' : 'NORMAL',
    lastEvaluationDate: new Date().toISOString(),
    trainingStatus: Math.random() > 0.7 ? 'NEEDS_TRAINING' : 'READY',
    errorRate: Math.random() * 0.15, // 0-15% error rate
    latency: 100 + Math.random() * 200 // 100-300ms latency
  };
};

export const trainModel = async (modelId: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!modelId) {
      return { success: false, message: "Invalid model ID provided" };
    }
    
    // Security validation
    if (securityUtils.checkForSQLInjection(modelId) || securityUtils.checkForXSS(modelId)) {
      securityUtils.recordSecurityEvent(
        securityUtils.SecurityEventType.SUSPICIOUS_ACTIVITY,
        `Suspicious modelId for training: ${modelId}`,
        'high'
      );
      return { success: false, message: "Invalid model ID format" };
    }
    
    logger.info(`Training model: ${modelId}`);
    
    // Use circuit breaker if feature is enabled
    if (featureFlags.isEnabled('CIRCUIT_BREAKER')) {
      const circuitBreaker = getCircuitBreaker('model-training');
      const result = await circuitBreaker.execute(() => mockTrainModel(modelId));
      
      if (result.success) {
        logger.info(`Model ${modelId} training initiated successfully`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.MEDIUM,
          "Model Training Started",
          `Training initiated for model ${modelId}`
        );
      } else {
        logger.warn(`Model ${modelId} training failed: ${result.message}`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.HIGH,
          "Model Training Failed",
          result.message
        );
      }
      
      return result;
    } else {
      const result = await withRetry(() => mockTrainModel(modelId));
      
      if (result.success) {
        logger.info(`Model ${modelId} training initiated successfully`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.MEDIUM,
          "Model Training Started",
          `Training initiated for model ${modelId}`
        );
      } else {
        logger.warn(`Model ${modelId} training failed: ${result.message}`);
        notificationManager.send(
          NotificationType.MODEL_ALERT,
          NotificationPriority.HIGH,
          "Model Training Failed",
          result.message
        );
      }
      
      return result;
    }
  } catch (error) {
    logger.error(`Error training model ${modelId}:`, error);
    notificationManager.send(
      NotificationType.SYSTEM_ALERT,
      NotificationPriority.HIGH,
      "Model Training Error",
      "An unexpected error occurred during model training"
    );
    return { success: false, message: "An unexpected error occurred" };
  }
};

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
        const mockMetrics: ModelMetrics = {
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
        
        modelMonitoring.recordModelMetric(mockMetrics);
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
    recordTradeExecution(symbol);
    
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
          
          logger.trade(`Trade executed: ${action} ${quantity} ${symbol} at $${asset.price.toFixed(2)}`, trade);
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

/**
 * Schedule model retraining based on configuration
 */
export const scheduleModelRetraining = (config: ModelRetrainingConfig): void => {
  if (!config.enabled) {
    logger.info(`Automated retraining is disabled for model ${config.modelId}`);
    return;
  }
  
  logger.info(`Scheduling retraining for model ${config.modelId} (${config.schedule})`);
  
  // In a real application, this would set up actual scheduled jobs
  // For this demo, we'll simulate it with a setTimeout
  const now = new Date();
  let nextRun: Date;
  
  switch (config.schedule) {
    case 'daily':
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 1, 0, 0); // 1 AM tomorrow
      break;
    case 'weekly':
      nextRun = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (7 - now.getDay()), 1, 0, 0); // 1 AM next Sunday
      break;
    case 'monthly':
      nextRun = new Date(now.getFullYear(), now.getMonth() + 1, 1, 1, 0, 0); // 1 AM on the 1st of next month
      break;
    default:
      logger.warn(`Invalid schedule '${config.schedule}' for model ${config.modelId}`);
      return;
  }
  
  const delay = nextRun.getTime() - now.getTime();
  
  logger.info(`Model ${config.modelId} scheduled for retraining at ${nextRun.toISOString()}`);
  
  // This is just for demonstration - in a real app, you'd use a proper job scheduler
  setTimeout(() => {
    logger.info(`Initiating scheduled retraining for model ${config.modelId}`);
    trainModel(config.modelId)
      .then(result => {
        if (result.success) {
          logger.info(`Scheduled retraining completed for model ${config.modelId}`);
          notificationManager.send(
            NotificationType.MODEL_ALERT,
            NotificationPriority.MEDIUM,
            "Scheduled Retraining Completed",
            `Model ${config.modelId} has been successfully retrained`
          );
          
          // Schedule the next run
          setTimeout(() => {
            scheduleModelRetraining({
              ...config,
              lastTrainingDate: new Date().toISOString()
            });
          }, 5000); // Just for demo purposes, schedule the next check soon
        } else {
          logger.error(`Scheduled retraining failed for model ${config.modelId}: ${result.message}`);
          notificationManager.send(
            NotificationType.MODEL_ALERT,
            NotificationPriority.HIGH,
            "Scheduled Retraining Failed",
            `Model ${config.modelId} retraining failed: ${result.message}`
          );
        }
      })
      .catch(error => {
        logger.error(`Error during scheduled retraining for model ${config.modelId}:`, error);
      });
  }, Math.min(delay, 30000)); // Use a shorter delay for demo purposes (max 30 seconds)
};

/**
 * Configure automated retraining for a model
 */
export const configureModelRetraining = (
  modelId: string,
  schedule: 'daily' | 'weekly' | 'monthly' | 'onDemand',
  enabled: boolean = true
): void => {
  logger.info(`Configuring retraining for model ${modelId} (${schedule}, enabled=${enabled})`);
  
  const config: ModelRetrainingConfig = {
    modelId,
    schedule,
    enabled,
    trainingWindow: 90, // 90 days of data
    dataSource: 'default',
    lastTrainingDate: new Date().toISOString()
  };
  
  if (enabled && schedule !== 'onDemand') {
    scheduleModelRetraining(config);
  }
  
  notificationManager.send(
    NotificationType.MODEL_ALERT,
    NotificationPriority.LOW,
    "Retraining Configured",
    `Model ${modelId} retraining configured (${schedule}, ${enabled ? 'enabled' : 'disabled'})`
  );
};

/**
 * Get system status
 */
export const getSystemStatus = async (): Promise<any> => {
  return {
    healthy: true,
    lastCheckTime: new Date().toISOString(),
    services: {
      database: true,
      marketData: true,
      tradingEngine: true,
      authentication: true,
      notification: true
    },
    performance: {
      responseTime: 120 + Math.random() * 50,
      cpuUsage: 0.2 + Math.random() * 0.3,
      memoryUsage: 256 + Math.random() * 128,
      errorRate: 0.01 + Math.random() * 0.03
    }
  };
};

// Initialize feature flags and notification preferences on module load
featureFlags.enable('CIRCUIT_BREAKER');
featureFlags.enable('ADVANCED_LOGGING');
featureFlags.enable('TRADE_NOTIFICATIONS');

// Export additional functions
export {
  configureModelRetraining,
  scheduleModelRetraining,
  getSystemStatus
};
