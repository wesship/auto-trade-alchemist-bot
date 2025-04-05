
// Re-export the trading types from the existing file
export type { 
  Asset, 
  TradeSignal, 
  TradeExecution, 
  ModelConfig,
  TradePerformance,
  ModelRetrainingConfig,
  FailoverConfig,
  CircuitBreakerConfig,
  NotificationConfig,
  ModelDriftStatus,
  ModelHealth,
  TradeLog,
  ModelMetrics,
  SystemStatus,
  AITradingModel
} from '../services/types/trading';
