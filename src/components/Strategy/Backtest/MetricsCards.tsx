
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from './utils';

interface MetricsCardsProps {
  performance: {
    netProfit: number;
    profitFactor: number;
    sharpRatio: number;
    maxDrawdown: number;
    winRate: number;
  };
}

const MetricsCards: React.FC<MetricsCardsProps> = ({ performance }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Profitability</CardTitle>
          <CardDescription>Return metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Net Profit</span>
              <span className="font-medium">{formatCurrency(performance.netProfit)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Profit Factor</span>
              <span className="font-medium">{performance.profitFactor.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sharp Ratio</span>
              <span className="font-medium">{performance.sharpRatio.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Risk</CardTitle>
          <CardDescription>Risk metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Drawdown</span>
              <span className="font-medium text-red-500">{performance.maxDrawdown.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Recovery Factor</span>
              <span className="font-medium">1.84</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Risk/Reward</span>
              <span className="font-medium">2.34</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Trade Quality</CardTitle>
          <CardDescription>Trade statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Win Rate</span>
              <span className="font-medium">{(performance.winRate * 100).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Win</span>
              <span className="font-medium">$247.63</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Average Loss</span>
              <span className="font-medium">-$105.83</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsCards;
