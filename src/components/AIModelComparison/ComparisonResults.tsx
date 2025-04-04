
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { availableAIModels } from "@/services/trading/aiStrategyService";
import { CheckCircle2, XCircle, TrendingUp, Code, ThumbsUp } from "lucide-react";
import { AIStrategyGenerationResult } from "@/services/trading/aiStrategyService";

interface ComparisonResultsProps {
  comparisonResults: AIStrategyGenerationResult[];
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

  // Function to get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 8) return "bg-green-500";
    if (score >= 6) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-4 mt-4">
      <h3 className="text-lg font-medium">Results</h3>
      
      {[...comparisonResults]
        .sort((a, b) => b.codeQualityScore - a.codeQualityScore)
        .map((result, index) => {
          const model = availableAIModels.find(m => m.id === result.modelId);
          
          // Determine if this is the best model (highest quality score)
          const isBestModel = index === 0;
          
          return (
            <Card 
              key={result.modelId} 
              className={`border ${isBestModel ? 'border-primary shadow-md' : 'border-border/60'} transition-all hover:shadow-sm`}
            >
              <CardContent className="pt-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    {isBestModel && (
                      <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full mr-2 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Top Pick
                      </div>
                    )}
                    <div>
                      <h4 className="text-base font-medium">{model?.name || result.modelId}</h4>
                      <p className="text-sm text-muted-foreground">{model?.description}</p>
                    </div>
                  </div>
                  <Button 
                    variant={viewCode === result.modelId ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewCode(viewCode === result.modelId ? null : result.modelId)}
                  >
                    <Code className="h-4 w-4 mr-1" />
                    {viewCode === result.modelId ? "Hide Code" : "View Code"}
                  </Button>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1 flex items-center">
                      <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                      Code Quality
                    </div>
                    <div className="flex items-center">
                      <Progress 
                        value={result.codeQualityScore * 10} 
                        className={`mr-2 h-2 ${getScoreColor(result.codeQualityScore)}`}
                      />
                      <span className="font-medium">{result.codeQualityScore.toFixed(1)}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Instructions</div>
                    <div className="flex items-center">
                      <Progress 
                        value={result.adherenceToInstructionsScore * 10} 
                        className={`mr-2 h-2 ${getScoreColor(result.adherenceToInstructionsScore)}`}
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
                  <div className="mt-4 animate-fade-in">
                    <div className="text-sm text-muted-foreground mb-1">Generated Code</div>
                    <div className="bg-muted/50 p-3 rounded-md overflow-x-auto border border-border/30">
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
