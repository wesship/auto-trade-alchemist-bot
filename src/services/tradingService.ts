
import { Asset, ModelConfig, TradeSignal, TradeExecution, AITradingModel } from '../types/trading';
import { marketAssets, aiTradingModels, trainModel as mockTrainModel, getTradeSignals as mockGetTradeSignals } from './mockData';
import { toast } from "sonner";

// In a real application, these would make API calls to your backend

export const fetchMarketData = async (): Promise<Asset[]> => {
  try {
    console.log("Fetching market data...");
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Market data fetched successfully");
        resolve(marketAssets);
      }, 800);
    });
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
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("AI models fetched successfully");
        resolve(aiTradingModels);
      }, 1000);
    });
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
    console.log(`Fetching model with ID: ${modelId}`);
    return new Promise((resolve) => {
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
    });
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
    console.log(`Training model: ${modelId}`);
    const result = await mockTrainModel(modelId);
    
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
    console.log(`Generating trade signals for model ${modelId} on ${symbol}`);
    const signals = await mockGetTradeSignals(modelId, symbol);
    
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
    if (!modelId || !symbol || !action || quantity <= 0) {
      throw new Error("Invalid trade parameters");
    }
    
    console.log(`Executing ${action} trade for ${quantity} ${symbol} using model ${modelId}`);
    
    return new Promise((resolve, reject) => {
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
    });
  } catch (error) {
    console.error(`Error executing trade:`, error);
    toast.error("Trade execution failed", {
      description: error instanceof Error ? error.message : "An unexpected error occurred",
    });
    throw error;
  }
};
