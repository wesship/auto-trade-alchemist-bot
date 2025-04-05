
export interface PriceDataPoint {
  date: string;
  price: number;
  volume: number;
}

export interface PriceChartProps {
  defaultSymbol?: string;
}

export interface ChartControlsProps {
  symbol: string;
  setSymbol: (value: string) => void;
  timeframe: string;
  setTimeframe: (value: string) => void;
}

export interface ChartTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}
