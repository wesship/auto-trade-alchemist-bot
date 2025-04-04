
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { availableAIModels } from "@/services/trading/aiStrategyService";
import { CheckCircle2, XCircle, Code } from "lucide-react";
import { ModelComparisonData } from "@/utils/monitoring/types";

interface ComparisonResultsProps {
  comparisonResults: ModelComparisonData[];
  viewCode: string | null;
  setViewCode: (modelId: string | null) => void;
}

const ComparisonResults: React.FC<ComparisonResultsProps> = ({
  comparisonResults,
  viewCode,
  setViewCode,
}) => {
  if (!comparisonResults || comparisonResults.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Results</h3>
      
      {[...comparisonResults]
        .sort((a, b) => b.codeQualityScore - a.codeQualityScore)
        .map((result) => {
          const model = availableAIModels.find(m => m.id === result.modelId);
          return (
            <Card key={result.modelId} className="border border-border/60">
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-base font-medium">{model?.name || result.modelId}</h4>
                    <p className="text-sm text-muted-foreground">{model?.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setViewCode(viewCode === result.modelId ? null : result.modelId)}
                  >
                    {viewCode === result.modelId ? "Hide Code" : "View Code"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Code Quality</div>
                    <div className="flex items-center">
                      <Progress 
                        value={result.codeQualityScore * 10} 
                        className="mr-2 h-2"
                      />
                      <span className="font-medium">{result.codeQualityScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Instructions</div>
                    <div className="flex items-center">
                      <Progress 
                        value={result.adherenceToInstructionsScore * 10} 
                        className="mr-2 h-2"
                      />
                      <span className="font-medium">{result.adherenceToInstructionsScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Syntax Errors</div>
                    <div className="flex items-center">
                      {result.syntaxErrorCount === 0 ? (
                        <span className="text-green-500 flex items-center font-medium">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> None
                        </span>
                      ) : (
                        <span className="text-red-500 flex items-center font-medium">
                          <XCircle className="h-4 w-4 mr-1" /> {result.syntaxErrorCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {viewCode === result.modelId && (
                  <div className="mt-4">
                    <div className="text-sm text-muted-foreground mb-1">Generated Code</div>
                    <div className="bg-muted/50 p-3 rounded-md overflow-x-auto">
                      <pre className="text-xs font-mono">
                        {result.strategyCode}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
};

export default ComparisonResults;
