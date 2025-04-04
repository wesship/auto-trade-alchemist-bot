
import { Asset, ModelConfig, TradeSignal, TradeExecution, AITradingModel } from '../types/trading';
import { marketAssets, aiTradingModels, trainModel as mockTrainModel, getTradeSignals as mockGetTradeSignals } from './mockData';
import { toast } from "sonner";

// Maximum number of API call retries
const MAX_RETRIES = 3;
// Tracking recent trade executions to implement rate limiting
const recentTradeExecutions: { timestamp: number; symbol: string }[] = [];
// Maximum trades per symbol per minute
const MAX_TRADES_PER_MINUTE = 5;

/**
 * Retry a function with exponential backoff
 */
const withRetry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;
    
    const delay = 1000 * Math.pow(2, MAX_RETRIES - retries); // Exponential backoff
    console.log(`Retrying after ${delay}ms, ${retries} retries left`);
    
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
  
  return recentTradesForSymbol < MAX_TRADES_PER_MINUTE;
};

/**
 * Record a trade execution for rate limiting
 */
const recordTradeExecution = (symbol: string): void => {
  recentTradeExecutions.push({
    timestamp: Date.now(),
    symbol
  });
};

export const fetchMarketData = async (): Promise<Asset[]> => {
  try {
    console.log("Fetching market data...");
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        console.log("Market data fetched successfully");
        resolve(marketAssets);
      }, 800);
    }));
  } catch (error) {
    console.error("Error fetching market data:", error);
    toast.error("Failed to fetch market data", {
      description: "Please try again later or contact support",
    });
    return [];
  }
};

export const fetchModels = async (): Promise<AITradingModel[]> => {
  try {
    console.log("Fetching AI models...");
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        console.log("AI models fetched successfully");
        resolve(aiTradingModels);
      }, 1000);
    }));
  } catch (error) {
    console.error("Error fetching models:", error);
    toast.error("Failed to fetch AI models", {
      description: "Please try again later or contact support",
    });
    return [];
  }
};

export const fetchModelById = async (modelId: string): Promise<AITradingModel | null> => {
  try {
    if (!modelId) {
      console.error("Invalid model ID provided");
      toast.error("Invalid model ID", {
        description: "Please provide a valid model ID",
      });
      return null;
    }
    
    console.log(`Fetching model with ID: ${modelId}`);
    return await withRetry(() => new Promise((resolve) => {
      setTimeout(() => {
        const model = aiTradingModels.find(m => m.config.id === modelId) || null;
        if (model) {
          console.log(`Model ${modelId} fetched successfully`);
          resolve(model);
        } else {
          console.warn(`Model ${modelId} not found`);
          toast.warning("Model not found", {
            description: "The requested model could not be found",
          });
          resolve(null);
        }
      }, 800);
    }));
  } catch (error) {
    console.error(`Error fetching model ${modelId}:`, error);
    toast.error("Failed to fetch model", {
      description: "Please try again later or contact support",
    });
    return null;
  }
};

export const trainModel = async (modelId: string): Promise<{ success: boolean; message: string }> => {
  try {
    if (!modelId) {
      return { success: false, message: "Invalid model ID provided" };
    }
    
    console.log(`Training model: ${modelId}`);
    const result = await withRetry(() => mockTrainModel(modelId));
    
    if (result.success) {
      console.log(`Model ${modelId} training initiated successfully`);
      toast.success("Model training started", {
        description: "You will be notified when training is complete",
      });
    } else {
      console.warn(`Model ${modelId} training failed: ${result.message}`);
      toast.error("Model training failed", {
        description: result.message,
      });
    }
    
    return result;
  } catch (error) {
    console.error(`Error training model ${modelId}:`, error);
    toast.error("Failed to train model", {
      description: "An unexpected error occurred",
    });
    return { success: false, message: "An unexpected error occurred" };
  }
};

export const generateTradeSignals = async (modelId: string, symbol: string): Promise<TradeSignal[]> => {
  try {
    if (!modelId || !symbol) {
      console.error("Invalid parameters for trade signal generation");
      toast.error("Invalid parameters", {
        description: "Please provide valid model ID and symbol",
      });
      return [];
    }
    
    console.log(`Generating trade signals for model ${modelId} on ${symbol}`);
    const signals = await withRetry(() => mockGetTradeSignals(modelId, symbol));
    
    if (signals.length > 0) {
      console.log(`Generated ${signals.length} trade signals successfully`);
      toast.success(`Generated ${signals.length} trading signals`, {
        description: `For ${symbol} using model ${modelId.substring(0, 8)}...`,
      });
    } else {
      console.warn(`No trade signals generated for ${symbol}`);
      toast.warning("No trade signals generated", {
        description: `Try different parameters or another asset`,
      });
    }
    
    return signals;
  } catch (error) {
    console.error(`Error generating trade signals for model ${modelId}:`, error);
    toast.error("Failed to generate trade signals", {
      description: "Please try again with different parameters",
    });
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
    // Input validation
    if (!modelId) throw new Error("Missing model ID");
    if (!symbol) throw new Error("Missing asset symbol");
    if (!action || (action !== 'BUY' && action !== 'SELL')) throw new Error("Invalid trade action");
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) throw new Error("Invalid quantity");
    
    // Check rate limit
    if (!checkRateLimit(symbol)) {
      const errorMessage = `Rate limit exceeded for ${symbol}. Maximum ${MAX_TRADES_PER_MINUTE} trades per minute.`;
      console.error(errorMessage);
      toast.error("Rate limit exceeded", {
        description: errorMessage,
      });
      throw new Error(errorMessage);
    }
    
    console.log(`Executing ${action} trade for ${quantity} ${symbol} using model ${modelId}`);
    
    return await withRetry(() => new Promise((resolve, reject) => {
      setTimeout(() => {
        const asset = marketAssets.find(a => a.symbol === symbol);
        if (!asset) {
          console.error(`Asset with symbol ${symbol} not found`);
          toast.error("Trade execution failed", {
            description: `Asset ${symbol} not found`,
          });
          reject(new Error(`Asset with symbol ${symbol} not found`));
          return;
        }
        
        // Record this execution for rate limiting
        recordTradeExecution(symbol);
        
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
        
        console.log(`Trade executed successfully:`, trade);
        toast.success(`${action} order executed`, {
          description: `${quantity} ${symbol} at $${asset.price.toFixed(2)}`,
        });
        
        resolve(trade);
      }, 1500);
    }));
  } catch (error) {
    console.error(`Error executing trade:`, error);
    toast.error("Trade execution failed", {
      description: error instanceof Error ? error.message : "An unexpected error occurred",
    });
    throw error;
  }
};
