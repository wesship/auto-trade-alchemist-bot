
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

interface StrategyParametersProps {
  strategyParams: Record<string, string>;
  show: boolean;
}

const StrategyParameters: React.FC<StrategyParametersProps> = ({ strategyParams, show }) => {
  if (!show) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Strategy Parameters</CardTitle>
        <CardDescription>Current backtest configuration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(strategyParams).map(([key, value]) => (
            <div key={key} className="space-y-1">
              <p className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
              <p className="text-sm">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyParameters;
