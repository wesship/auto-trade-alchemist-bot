
export interface PerformanceStatData {
  totalPnl: number;
  dailyPnl: number;
  weeklyPnl: number;
  winRate: number;
  totalTrades: number;
  pnlHistory: { date: string; pnl: number }[];
}

export interface PerformanceStatsProps {
  data: PerformanceStatData;
  isLoading?: boolean;
}

export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  subtitle: string;
  isMonetary?: boolean;
  isPercentage?: boolean;
}

export interface PnlHistoryChartProps {
  data: { date: string; pnl: number }[];
}
