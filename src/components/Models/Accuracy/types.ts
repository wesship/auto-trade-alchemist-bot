
export interface ModelAccuracyProps {
  modelId: string;
  modelName: string;
}

export interface MetricOverTime {
  month: string;
  accuracy: number;
  precision: number;
  recall: number;
}

export interface AccuracyByCategory {
  name: string;
  value: number;
}

export interface AccuracySummaryCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend: string;
}
