import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, BarChart3, ChevronDown, ChevronUp, Code, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { 
  availableAIModels,
  strategyPrompts,
  compareAIModels
} from "@/services/trading/aiStrategyService";
import { getAggregatedModelPerformance, getModelComparisons } from "@/utils/monitoring";

const AIModelComparison = () => {
  const [selectedPromptId, setSelectedPromptId] = useState<string>(strategyPrompts.medium[0].id);
  const [selectedModels, setSelectedModels] = useState<string[]>(
    availableAIModels.filter(m => m.isAvailable).map(m => m.id).slice(0, 3)
  );
  const [viewCode, setViewCode] = useState<string | null>(null);
  
  const { data: aggregatedPerformance, isLoading: isLoadingPerformance } = useQuery({
    queryKey: ["aggregatedModelPerformance"],
    queryFn: () => getAggregatedModelPerformance(availableAIModels.map(m => m.id)),
  });
  
  const { data: comparisonHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["modelComparisonHistory"],
    queryFn: () => getModelComparisons(),
  });
  
  const getPromptDetails = (promptId: string) => {
    for (const category in strategyPrompts) {
      const prompt = strategyPrompts[category as keyof typeof strategyPrompts].find(p => p.id === promptId);
      if (prompt) return prompt;
    }
    return null;
  };
  
  const promptDetails = getPromptDetails(selectedPromptId);
  
  const { 
    data: comparisonResults, 
    isLoading: isComparing,
    refetch: runComparison
  } = useQuery({
    queryKey: ["aiModelComparison", selectedPromptId, selectedModels],
    queryFn: () => compareAIModels(selectedPromptId, selectedModels),
    enabled: false,
  });
  
  const handleRunComparison = () => {
    toast.info("Running AI model comparison", {
      description: `Comparing ${selectedModels.length} models on "${promptDetails?.name}" prompt`,
    });
    runComparison();
  };
  
  const toggleModelSelection = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(id => id !== modelId));
      }
    } else {
      setSelectedModels([...selectedModels, modelId]);
    }
  };
  
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center">
          <Brain className="mr-2 h-6 w-6 text-primary" />
          AI Model Comparison
        </h1>
        <p className="text-muted-foreground">
          Compare different AI models' performance in generating trading strategies
        </p>
      </div>
      
      <Tabs defaultValue="compare" className="space-y-6">
        <TabsList className="grid grid-cols-3 max-w-md">
          <TabsTrigger value="compare">Compare</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="compare" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Model Comparison</CardTitle>
                <CardDescription>
                  Compare how different AI models perform on the same strategy generation task
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Select Strategy Prompt</label>
                  <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select strategy prompt" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="header-easy" disabled className="font-bold">
                        Easy Prompts
                      </SelectItem>
                      {strategyPrompts.easy.map(prompt => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.name}
                        </SelectItem>
                      ))}
                      
                      <SelectItem value="header-medium" disabled className="font-bold">
                        Medium Prompts
                      </SelectItem>
                      {strategyPrompts.medium.map(prompt => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.name}
                        </SelectItem>
                      ))}
                      
                      <SelectItem value="header-hard" disabled className="font-bold">
                        Hard Prompts
                      </SelectItem>
                      {strategyPrompts.hard.map(prompt => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                          {prompt.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {promptDetails && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      {promptDetails.description}
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={handleRunComparison} 
                  disabled={isComparing || selectedModels.length === 0}
                  className="w-full"
                >
                  {isComparing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Comparing Models...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Run Comparison
                    </>
                  )}
                </Button>
                
                {comparisonResults && comparisonResults.length > 0 && (
                  <div className="space-y-4 mt-4">
                    <h3 className="text-lg font-medium">Results</h3>
                    
                    {[...comparisonResults].sort((a, b) => b.codeQualityScore - a.codeQualityScore).map((result) => {
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
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Select Models</CardTitle>
                <CardDescription>
                  Choose which AI models to include in the comparison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {availableAIModels.map(model => (
                  <div key={model.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`model-${model.id}`}
                      checked={selectedModels.includes(model.id)}
                      onChange={() => toggleModelSelection(model.id)}
                      disabled={!model.isAvailable}
                      className="h-4 w-4 rounded border-gray-300 mr-2"
                    />
                    <div className="flex-1">
                      <label 
                        htmlFor={`model-${model.id}`}
                        className={`font-medium text-sm ${!model.isAvailable ? 'text-muted-foreground' : ''}`}
                      >
                        {model.name}
                      </label>
                      <p className="text-xs text-muted-foreground">{model.description}</p>
                    </div>
                  </div>
                ))}
                
                {promptDetails && (
                  <div className="mt-4 p-3 bg-muted/40 rounded-md text-sm">
                    <div className="font-medium mb-1">Prompt</div>
                    <p className="text-muted-foreground text-xs">{promptDetails.prompt}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Model Performance</CardTitle>
              <CardDescription>
                Aggregated performance metrics across all strategy generation tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPerformance ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading performance data...
                </div>
              ) : !aggregatedPerformance || aggregatedPerformance.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No performance data available yet. Run some comparisons to collect data.
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparison History</CardTitle>
              <CardDescription>
                Recent AI model comparison results
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingHistory ? (
                <div className="py-8 text-center text-muted-foreground">
                  Loading history data...
                </div>
              ) : !comparisonHistory || comparisonHistory.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground">
                  No comparison history available yet. Run some comparisons to collect data.
                </div>
              ) : (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    {Array.from(new Set(comparisonHistory.map(c => c.timestamp))).map(timestamp => {
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
                                          Win: {(comparison.backtestPerformance.winRate || 0 * 100).toFixed(1)}%
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
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelComparison;
