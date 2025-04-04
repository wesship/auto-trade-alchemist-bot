
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { availableAIModels } from "@/services/trading/aiStrategyService";
import { ModelComparisonData } from "@/utils/monitoring/types";

interface ComparisonHistoryProps {
  comparisonHistory: ModelComparisonData[] | undefined;
  isLoadingHistory: boolean;
}

const ComparisonHistory: React.FC<ComparisonHistoryProps> = ({
  comparisonHistory,
  isLoadingHistory,
}) => {
  if (isLoadingHistory) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading history data...
      </div>
    );
  }

  if (!comparisonHistory || comparisonHistory.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No comparison history available yet. Run some comparisons to collect data.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[500px] pr-4">
      <div className="space-y-6">
        {Array.from(new Set(comparisonHistory.map(c => c.timestamp))).map(timestamp => {
          if (!timestamp) return null;
          
          const comparisonsForTimestamp = comparisonHistory.filter(c => c.timestamp === timestamp);
          const firstComparison = comparisonsForTimestamp[0];
          const date = new Date(timestamp);
          
          return (
            <div key={timestamp} className="space-y-3">
              <div className="flex items-center">
                <div className="text-sm font-medium">
                  {date.toLocaleString()} - {firstComparison.strategyType} ({firstComparison.promptComplexity})
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {comparisonsForTimestamp
                  .sort((a, b) => b.codeQualityScore - a.codeQualityScore)
                  .map((comparison, index) => {
                    const model = availableAIModels.find(m => m.id === comparison.modelId);
                    return (
                      <div 
                        key={`${comparison.timestamp}-${comparison.modelId}`}
                        className="border rounded-md p-3 flex justify-between items-center"
                      >
                        <div className="flex items-center">
                          <div className="text-lg font-bold w-6 text-muted-foreground">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{model?.name || comparison.modelId}</div>
                            <div className="text-xs text-muted-foreground flex gap-4">
                              <span>Quality: {comparison.codeQualityScore.toFixed(1)}</span>
                              <span>Errors: {comparison.syntaxErrorCount}</span>
                            </div>
                          </div>
                        </div>
                        
                        {comparison.backtestPerformance && (
                          <div className="text-right text-xs">
                            <div className="font-medium">Backtest Performance</div>
                            <div className="text-muted-foreground">
                              Sharpe: {comparison.backtestPerformance.sharpeRatio?.toFixed(2)},
                              Win: {((comparison.backtestPerformance.winRate || 0) * 100).toFixed(1)}%
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              
              <Separator />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default ComparisonHistory;
