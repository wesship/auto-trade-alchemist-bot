
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Target } from 'lucide-react';

interface StrategyOptimizerProps {
  confidenceThreshold: number;
  setConfidenceThreshold: (value: number) => void;
  strategyType: string;
  setStrategyType: (value: string) => void;
  refetchStrategies: () => void;
}

const StrategyOptimizer: React.FC<StrategyOptimizerProps> = ({
  confidenceThreshold,
  setConfidenceThreshold,
  strategyType,
  setStrategyType,
  refetchStrategies
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <Brain className="mr-2 h-5 w-5 text-primary" />
          Strategy Optimizer
        </CardTitle>
        <CardDescription>
          Adjust parameters to optimize trading strategies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium">Confidence Threshold</label>
              <span className="text-sm text-muted-foreground">{confidenceThreshold}%</span>
            </div>
            <Slider
              value={[confidenceThreshold]} 
              min={30} 
              max={95} 
              step={5}
              onValueChange={(value) => setConfidenceThreshold(value[0])}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Strategy Type</label>
            <Select value={strategyType} onValueChange={setStrategyType}>
              <SelectTrigger>
                <SelectValue placeholder="Select strategy type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="conservative">Conservative</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="aggressive">Aggressive</SelectItem>
                <SelectItem value="momentum">Momentum-Based</SelectItem>
                <SelectItem value="contrarian">Contrarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            className="w-full" 
            onClick={refetchStrategies}
          >
            <Target className="mr-2 h-4 w-4" />
            Optimize Strategy
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyOptimizer;
