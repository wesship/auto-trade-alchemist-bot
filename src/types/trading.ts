
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

export interface ModelRetrainingConfig {
  modelId: string;
  schedule: 'daily' | 'weekly' | 'monthly' | 'onDemand';
  enabled: boolean;
  lastTrainingDate?: string;
  nextTrainingDate?: string;
  trainingWindow: number; // in days
  dataSource: string;
  params?: Record<string, any>;
}

export interface FailoverConfig {
  enabled: boolean;
  backupModelId?: string;
  maxLatency: number; // Maximum acceptable latency in ms
  maxErrorRate: number; // Maximum acceptable error rate (0-1)
  retryStrategy: 'immediate' | 'backoff' | 'custom';
}

export interface CircuitBreakerConfig {
  enabled: boolean;
  failureThreshold: number;
  resetTimeout: number; // in ms
  monitorInterval: number; // in ms
}

export interface NotificationConfig {
  enabled: boolean;
  channels: ('email' | 'sms' | 'app')[];
  tradeNotifications: boolean;
  systemAlerts: boolean;
  modelAlerts: boolean;
  marketAlerts: boolean;
}

export enum ModelDriftStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL'
}

export interface ModelHealth {
  accuracy: number;
  drift: ModelDriftStatus;
  lastEvaluationDate: string;
  trainingStatus: 'READY' | 'TRAINING' | 'NEEDS_TRAINING';
  errorRate: number;
  latency: number; // in ms
}

export interface TradeLog {
  id: string;
  modelId: string;
  action: 'BUY' | 'SELL';
  symbol: string;
  timestamp: string;
  quantity: number;
  price: number;
  executed: boolean;
  error?: string;
}

export interface ModelMetrics {
  modelId: string;
  accuracy: number;
  precision: number; 
  recall: number;
  f1Score: number;
  profitLoss: number;
  successRate: number; // Successful trades / total trades
  tradeCount: number;
  timestamp: string;
}

export interface SystemStatus {
  healthy: boolean;
  lastCheckTime: string;
  services: {
    database: boolean;
    marketData: boolean;
    tradingEngine: boolean;
    authentication: boolean;
    notification: boolean;
  };
  performance: {
    responseTime: number; // in ms
    cpuUsage: number; // 0-1
    memoryUsage: number; // in MB
    errorRate: number; // 0-1
  };
}

export interface AITradingModel {
  config: ModelConfig;
  performance?: TradePerformance;
  recentSignals: TradeSignal[];
  recentTrades: TradeExecution[];
  health?: ModelHealth;
  retrainingConfig?: ModelRetrainingConfig;
  failoverConfig?: FailoverConfig;
  metrics?: ModelMetrics[];
}
