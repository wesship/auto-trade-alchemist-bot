
import { Asset, TradeSignal, ModelConfig, TradeExecution, TradePerformance, AITradingModel } from '../types/trading';

// Mock market data
export const marketAssets: Asset[] = [
  { symbol: 'BTC', name: 'Bitcoin', price: 63245.78, change: 1243.45, changePercent: 2.1, volume: 32567000000 },
  { symbol: 'ETH', name: 'Ethereum', price: 3456.92, change: -45.67, changePercent: -1.3, volume: 15623000000 },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 187.45, change: 3.24, changePercent: 1.7, volume: 58234000 },
  { symbol: 'MSFT', name: 'Microsoft', price: 412.65, change: 5.78, changePercent: 1.4, volume: 23451000 },
  { symbol: 'GOOGL', name: 'Alphabet', price: 156.78, change: -2.34, changePercent: -1.5, volume: 19872000 },
  { symbol: 'AMZN', name: 'Amazon', price: 178.92, change: 4.56, changePercent: 2.6, volume: 21345000 },
  { symbol: 'TSLA', name: 'Tesla', price: 248.39, change: -7.82, changePercent: -3.1, volume: 36781000 },
  { symbol: 'NVDA', name: 'NVIDIA', price: 924.67, change: 15.23, changePercent: 1.7, volume: 42198000 },
];

// Mock model configurations
export const modelConfigs: ModelConfig[] = [
  {
    id: 'model-1',
    name: 'DeepTrade Transformer',
    description: 'Advanced time-series transformer model optimized for cryptocurrency price prediction',
    modelType: 'Transformer',
    features: ['price', 'volume', 'sentiment', 'on-chain-metrics'],
    timeframe: '1h',
    lookbackPeriod: 168, // 7 days in hours
    predictionHorizon: 24,
    lastTrained: '2025-04-01T15:30:00Z',
    accuracy: 0.72,
    status: 'ready'
  },
  {
    id: 'model-2',
    name: 'StockSense LSTM',
    description: 'Long Short-Term Memory network for equity market prediction',
    modelType: 'LSTM',
    features: ['price', 'volume', 'technical_indicators', 'macro_economic'],
    timeframe: '1d',
    lookbackPeriod: 60, // 60 days
    predictionHorizon: 5,
    lastTrained: '2025-03-28T09:15:00Z',
    accuracy: 0.68,
    status: 'ready'
  },
  {
    id: 'model-3',
    name: 'AlphaEdge Ensemble',
    description: 'Multi-model ensemble combining transformer, LSTM and traditional ML models',
    modelType: 'Ensemble',
    features: ['price', 'volume', 'technical_indicators', 'sentiment', 'options_data'],
    timeframe: '4h',
    lookbackPeriod: 120, // 20 days in 4-hour periods
    predictionHorizon: 6,
    status: 'training'
  },
];

// Helper to generate random dates within the last month
const getRandomDate = (daysBack: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60), 0);
  return date.toISOString();
};

// Helper to create mock trade signals
const createMockSignals = (symbol: string, count: number): TradeSignal[] => {
  const signals: TradeSignal[] = [];
  const actions: Array<'BUY' | 'SELL' | 'HOLD'> = ['BUY', 'SELL', 'HOLD'];
  
  for (let i = 0; i < count; i++) {
    const asset = marketAssets.find(a => a.symbol === symbol) || marketAssets[0];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const confidence = 0.5 + Math.random() * 0.4; // 0.5 to 0.9
    const priceVariation = asset.price * (0.98 + Math.random() * 0.04); // ±2% of current price
    
    signals.push({
      symbol,
      timestamp: getRandomDate(15),
      action,
      confidence,
      price: parseFloat(priceVariation.toFixed(2)),
      reasoning: `${action} signal based on ${confidence.toFixed(2)} confidence level from pattern analysis and market momentum.`
    });
  }
  
  return signals.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Helper to create mock trade executions
const createMockExecutions = (symbol: string, modelId: string, count: number): TradeExecution[] => {
  const executions: TradeExecution[] = [];
  const actions: Array<'BUY' | 'SELL'> = ['BUY', 'SELL'];
  
  for (let i = 0; i < count; i++) {
    const asset = marketAssets.find(a => a.symbol === symbol) || marketAssets[0];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const priceVariation = asset.price * (0.98 + Math.random() * 0.04); // ±2% of current price
    const quantity = Math.floor(10 + Math.random() * 90);
    
    executions.push({
      id: `trade-${symbol}-${Date.now()}-${i}`,
      symbol,
      timestamp: getRandomDate(30),
      action,
      price: parseFloat(priceVariation.toFixed(2)),
      quantity,
      value: parseFloat((priceVariation * quantity).toFixed(2)),
      modelId
    });
  }
  
  return executions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Create mock performance data
const createMockPerformance = (): TradePerformance => {
  const dailyPnL = [];
  const today = new Date();
  let cumulativePnL = 0;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate some realistic-looking P&L data with some trend and randomness
    const dailyChange = (Math.random() * 2 - 0.5) * 500; // -250 to 750
    cumulativePnL += dailyChange;
    
    dailyPnL.push({
      date: dateStr,
      pnl: parseFloat(dailyChange.toFixed(2))
    });
  }
  
  return {
    totalTrades: Math.floor(50 + Math.random() * 150),
    winRate: parseFloat((0.4 + Math.random() * 0.3).toFixed(2)),
    profitFactor: parseFloat((1 + Math.random() * 1.5).toFixed(2)),
    averageReturn: parseFloat((0.5 + Math.random() * 1.5).toFixed(2)),
    sharpeRatio: parseFloat((0.8 + Math.random() * 1.7).toFixed(2)),
    maxDrawdown: parseFloat((-5 - Math.random() * 15).toFixed(2)),
    dailyPnL
  };
};

// Create complete AI trading models with all data
export const aiTradingModels: AITradingModel[] = modelConfigs.map(config => {
  const symbol = config.modelType === 'Transformer' ? 'BTC' : 
                 config.modelType === 'LSTM' ? 'AAPL' : 'NVDA';
  
  return {
    config,
    performance: config.status === 'ready' ? createMockPerformance() : undefined,
    recentSignals: createMockSignals(symbol, 8),
    recentTrades: createMockExecutions(symbol, config.id, 6)
  };
});

// Mock function to simulate model training
export const trainModel = async (modelId: string): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomSuccess = Math.random() > 0.1; // 90% success rate
      if (randomSuccess) {
        resolve({ success: true, message: 'Model training completed successfully!' });
      } else {
        resolve({ success: false, message: 'Model training failed. There was an issue with the data preprocessing.' });
      }
    }, 3000 + Math.random() * 3000); // 3-6 seconds delay
  });
};

// Mock function to simulate getting trade signals
export const getTradeSignals = async (modelId: string, symbol: string): Promise<TradeSignal[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(createMockSignals(symbol, 5));
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  });
};
