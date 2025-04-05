
import React from 'react';
import { Button } from '@/components/ui/button';
import { Zap } from 'lucide-react';

interface ForecastHeaderProps {
  refetchStrategies: () => void;
}

const ForecastHeader: React.FC<ForecastHeaderProps> = ({ refetchStrategies }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
      <div>
        <h1 className="text-3xl font-bold mb-2">Market Forecasting</h1>
        <p className="text-muted-foreground">
          Generate predictions, analyze trends, and optimize trading strategies
        </p>
      </div>
      
      <Button className="mt-4 lg:mt-0" onClick={refetchStrategies}>
        <Zap className="mr-2 h-4 w-4" />
        Generate New Strategies
      </Button>
    </div>
  );
};

export default ForecastHeader;
