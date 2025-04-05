
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Lightbulb, BarChart } from 'lucide-react';
import StrategyCard from './StrategyCard';

interface RecommendedStrategiesProps {
  strategies: any[];
  isLoadingStrategies: boolean;
  refetchStrategies: () => void;
}

const RecommendedStrategies: React.FC<RecommendedStrategiesProps> = ({
  strategies,
  isLoadingStrategies,
  refetchStrategies
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Recommended Trading Strategies
        </CardTitle>
        <CardDescription>
          AI-generated trading strategies based on forecast data
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoadingStrategies ? (
          <div className="h-48 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : strategies && strategies.length > 0 ? (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {strategies.map((strategy, index) => (
                <StrategyCard key={index} strategy={strategy} />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-12">
            <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No strategies available</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Adjust your parameters and generate strategies
            </p>
            <Button onClick={refetchStrategies}>
              Generate Strategies
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedStrategies;
