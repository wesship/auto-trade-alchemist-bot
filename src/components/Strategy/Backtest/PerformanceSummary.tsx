
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency, formatPercent } from '../utils';

interface PerformanceSummaryProps {
  performance: {
    netProfit: number;
    winRate: number;
    profitFactor: number;
    maxDrawdown: number;
  };
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ performance }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Performance Summary</CardTitle>
        <CardDescription>Overall backtest performance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <p className="text-sm font-medium">Net Profit</p>
            <p className="text-xl font-bold text-green-500">
              {formatCurrency(performance.netProfit)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Win Rate</p>
            <p className="text-xl font-bold">
              {(performance.winRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Profit Factor</p>
            <p className="text-xl font-bold">{performance.profitFactor.toFixed(2)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Max Drawdown</p>
            <p className="text-xl font-bold text-red-500">
              {performance.maxDrawdown.toFixed(2)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSummary;
