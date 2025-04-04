
export interface Asset {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface TradeSignal {
  symbol: string;
  timestamp: string;
  action: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  price: number;
  reasoning: string;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  modelType: 'LLM' | 'RNN' | 'LSTM' | 'Transformer' | 'Ensemble';
  features: string[];
  timeframe: '1m' | '5m' | '15m' | '1h' | '4h' | '1d';
  lookbackPeriod: number;
  predictionHorizon: number;
  lastTrained?: string;
  accuracy?: number;
  status: 'ready' | 'training' | 'idle';
}

export interface TradeExecution {
  id: string;
  symbol: string;
  timestamp: string;
  action: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  value: number;
  modelId: string;
}

export interface TradePerformance {
  totalTrades: number;
  winRate: number; 
  profitFactor: number;
  averageReturn: number;
  sharpeRatio: number;
  maxDrawdown: number;
  dailyPnL: {
    date: string;
    pnl: number;
  }[];
}

export interface AITradingModel {
  config: ModelConfig;
  performance?: TradePerformance;
  recentSignals: TradeSignal[];
  recentTrades: TradeExecution[];
}
