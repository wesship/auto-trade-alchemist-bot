
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight } from 'lucide-react';

interface StrategyProps {
  strategy: {
    name: string;
    type: string;
    direction: string;
    confidence: number;
    description: string;
    entryPrice: number;
    targetPrice: number;
    stopLoss: number;
    potentialReturn: number;
  };
}

const StrategyCard: React.FC<StrategyProps> = ({ strategy }) => {
  return (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-lg flex items-center">
          {strategy.name}
          <Badge 
            className="ml-2" 
            variant={
              strategy.type === 'aggressive' ? 'destructive' : 
              strategy.type === 'conservative' ? 'outline' :
              'secondary'
            }
          >
            {strategy.type}
          </Badge>
        </h3>
        <div className="flex items-center">
          <Badge 
            variant={strategy.direction === 'BUY' ? 'success' : 'destructive'} 
            className="mr-2"
          >
            {strategy.direction}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {strategy.confidence}% confidence
          </span>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        {strategy.description}
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
        <div className="text-xs">
          <span className="text-muted-foreground block">Entry Price</span>
          <span className="font-medium">${strategy.entryPrice.toLocaleString()}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground block">Target Price</span>
          <span className="font-medium">${strategy.targetPrice.toLocaleString()}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground block">Stop Loss</span>
          <span className="font-medium">${strategy.stopLoss.toLocaleString()}</span>
        </div>
        <div className="text-xs">
          <span className="text-muted-foreground block">Potential Return</span>
          <span className={`font-medium ${
            strategy.potentialReturn > 0 
              ? 'text-tradingGreen-500' 
              : 'text-tradingRed-500'
          }`}>
            {strategy.potentialReturn > 0 ? '+' : ''}{strategy.potentialReturn}%
          </span>
        </div>
      </div>
      
      <div className="flex items-center mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-8 mr-2"
        >
          Apply Strategy
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs h-8"
        >
          View Details
          <ChevronRight className="ml-1 h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default StrategyCard;
