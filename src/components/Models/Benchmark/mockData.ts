
import { MetricDataPoint, KeyMetric } from './types';

// Mock data for model vs benchmarks
export const mockTimeseriesData: MetricDataPoint[] = [
  { month: 'Jan', model: 2.3, sp500: 1.8, buyhold: 1.5, randomForest: 1.9 },
  { month: 'Feb', model: 1.7, sp500: 0.9, buyhold: 0.7, randomForest: 1.2 },
  { month: 'Mar', model: 3.4, sp500: 2.1, buyhold: 1.8, randomForest: 2.6 },
  { month: 'Apr', model: -0.8, sp500: -1.2, buyhold: -1.5, randomForest: -1.1 },
  { month: 'May', model: 2.1, sp500: 1.5, buyhold: 1.2, randomForest: 1.6 },
  { month: 'Jun', model: 4.3, sp500: 2.4, buyhold: 2.0, randomForest: 3.1 },
  { month: 'Jul', model: 3.2, sp500: 2.2, buyhold: 1.8, randomForest: 2.4 },
  { month: 'Aug', model: 1.9, sp500: 1.3, buyhold: 1.1, randomForest: 1.4 },
  { month: 'Sep', model: 4.8, sp500: 2.7, buyhold: 2.2, randomForest: 3.5 },
  { month: 'Oct', model: 5.2, sp500: 3.1, buyhold: 2.5, randomForest: 3.8 },
  { month: 'Nov', model: 3.7, sp500: 2.3, buyhold: 1.9, randomForest: 2.8 },
  { month: 'Dec', model: 4.9, sp500: 2.9, buyhold: 2.4, randomForest: 3.6 },
];

export const mockKeyMetrics: KeyMetric[] = [
  { name: 'Annual Return', model: 36.7, sp500: 22.2, buyhold: 18.4, randomForest: 26.9 },
  { name: 'Sharpe Ratio', model: 1.95, sp500: 1.45, buyhold: 1.22, randomForest: 1.58 },
  { name: 'Max Drawdown', model: -8.2, sp500: -12.6, buyhold: -14.8, randomForest: -10.3 },
  { name: 'Win Rate', model: 67.5, sp500: 58.3, buyhold: 54.2, randomForest: 61.7 },
];
