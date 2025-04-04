
import { Asset, ModelConfig, TradeSignal, TradeExecution, AITradingModel } from '../types/trading';
import { marketAssets, aiTradingModels, trainModel as mockTrainModel, getTradeSignals as mockGetTradeSignals } from './mockData';

// In a real application, these would make API calls to your backend

export const fetchMarketData = async (): Promise<Asset[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(marketAssets);
    }, 800);
  });
};

export const fetchModels = async (): Promise<AITradingModel[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(aiTradingModels);
    }, 1000);
  });
};

export const fetchModelById = async (modelId: string): Promise<AITradingModel | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const model = aiTradingModels.find(m => m.config.id === modelId) || null;
      resolve(model);
    }, 800);
  });
};

export const trainModel = async (modelId: string): Promise<{ success: boolean; message: string }> => {
  return mockTrainModel(modelId);
};

export const generateTradeSignals = async (modelId: string, symbol: string): Promise<TradeSignal[]> => {
  return mockGetTradeSignals(modelId, symbol);
};

export const executeTradeAction = async (
  modelId: string, 
  symbol: string, 
  action: 'BUY' | 'SELL', 
  quantity: number
): Promise<TradeExecution> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const asset = marketAssets.find(a => a.symbol === symbol);
      if (!asset) throw new Error(`Asset with symbol ${symbol} not found`);
      
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
      
      resolve(trade);
    }, 1500);
  });
};
