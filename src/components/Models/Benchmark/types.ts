
export interface ModelBenchmarkingProps {
  modelId: string;
  modelName: string;
}

export interface MetricDataPoint {
  month: string;
  model: number;
  sp500: number;
  buyhold: number;
  randomForest: number;
}

export interface KeyMetric {
  name: string;
  model: number;
  sp500: number;
  buyhold: number;
  randomForest: number;
}
