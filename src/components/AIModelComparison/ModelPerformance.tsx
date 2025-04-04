
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { availableAIModels } from "@/services/trading/aiStrategyService";
import { AggregatedModelPerformance } from "@/utils/monitoring/types";

interface ModelPerformanceProps {
  aggregatedPerformance: AggregatedModelPerformance[] | undefined;
  isLoadingPerformance: boolean;
}

const ModelPerformance: React.FC<ModelPerformanceProps> = ({
  aggregatedPerformance,
  isLoadingPerformance,
}) => {
  if (isLoadingPerformance) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        Loading performance data...
      </div>
    );
  }

  if (!aggregatedPerformance || aggregatedPerformance.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No performance data available yet. Run some comparisons to collect data.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {[...aggregatedPerformance]
        .sort((a, b) => b.avgCodeQualityScore - a.avgCodeQualityScore)
        .map(perf => {
          const model = availableAIModels.find(m => m.id === perf.modelId);
          return (
            <div key={perf.modelId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-base font-medium">{model?.name || perf.modelId}</h3>
                  <p className="text-sm text-muted-foreground">{model?.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Overall Rating</div>
                  <div className="text-2xl font-bold">{perf.avgCodeQualityScore.toFixed(1)}</div>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Code Quality</div>
                  <Progress value={perf.avgCodeQualityScore * 10} className="h-2 mb-1" />
                  <div className="text-xs font-medium">{perf.avgCodeQualityScore.toFixed(1)}/10</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Instructions</div>
                  <Progress value={perf.avgAdherenceScore * 10} className="h-2 mb-1" />
                  <div className="text-xs font-medium">{perf.avgAdherenceScore.toFixed(1)}/10</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Syntax Errors</div>
                  <div className="text-sm font-medium">
                    {perf.totalSyntaxErrors === 0 ? (
                      <span className="text-green-500">None</span>
                    ) : (
                      <span className="text-red-500">{perf.totalSyntaxErrors} errors</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <div className="text-xs text-muted-foreground mb-2">Performance by Complexity</div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs mb-1">Easy ({perf.performanceByComplexity.easy.count})</div>
                    <Progress 
                      value={perf.performanceByComplexity.easy.avgScore * 10} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Medium ({perf.performanceByComplexity.medium.count})</div>
                    <Progress 
                      value={perf.performanceByComplexity.medium.avgScore * 10} 
                      className="h-2"
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">Hard ({perf.performanceByComplexity.hard.count})</div>
                    <Progress 
                      value={perf.performanceByComplexity.hard.avgScore * 10} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default ModelPerformance;
