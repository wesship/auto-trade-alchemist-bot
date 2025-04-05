
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyMetric } from './types';

interface PerformanceSummaryProps {
  modelName: string;
  metrics: KeyMetric[];
}

const PerformanceSummary: React.FC<PerformanceSummaryProps> = ({ modelName, metrics }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Performance Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md border p-4">
          <div className="text-base font-medium flex items-center">
            <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</span>
            Overall Performance
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {modelName} outperforms all benchmarks with a {metrics[0].model}% annual return, 
            {' '}{metrics[0].model - metrics[0].sp500}% higher than the S&P 500.
          </p>
        </div>
        
        <div className="rounded-md border p-4">
          <div className="text-base font-medium flex items-center">
            <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</span>
            Risk-Adjusted Return (Sharpe Ratio)
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {modelName} achieves a Sharpe Ratio of {metrics[1].model.toFixed(2)}, showing superior 
            risk-adjusted returns compared to all benchmark strategies.
          </p>
        </div>
        
        <div className="rounded-md border p-4">
          <div className="text-base font-medium flex items-center">
            <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</span>
            Drawdown & Win Rate
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {modelName} maintains the lowest maximum drawdown ({metrics[2].model}%) and highest win rate ({metrics[3].model}%),
            indicating better risk management and trade consistency.
          </p>
        </div>
        
        <div className="rounded-md border p-4 bg-primary/5">
          <div className="text-base font-medium">Conclusion</div>
          <p className="text-sm mt-2">
            {modelName} consistently outperforms traditional benchmarks and other machine learning models
            across all key performance metrics, demonstrating its superior market prediction capabilities.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceSummary;
