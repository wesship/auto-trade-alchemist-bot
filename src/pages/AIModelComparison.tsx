
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain } from "lucide-react";
import { toast } from "sonner";
import { 
  strategyPrompts,
  availableAIModels,
  compareAIModels,
  AIStrategyGenerationResult
} from "@/services/trading/aiStrategyService";
import { getAggregatedModelPerformance, getModelComparisons } from "@/utils/monitoring";
import ComparisonForm from "@/components/AIModelComparison/ComparisonForm";
import ModelSelector from "@/components/AIModelComparison/ModelSelector";
import ModelPerformance from "@/components/AIModelComparison/ModelPerformance";
import ComparisonHistory from "@/components/AIModelComparison/ComparisonHistory";

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
            <ComparisonForm
              selectedPromptId={selectedPromptId}
              setSelectedPromptId={setSelectedPromptId}
              handleRunComparison={handleRunComparison}
              isComparing={isComparing}
              comparisonResults={comparisonResults}
              viewCode={viewCode}
              setViewCode={setViewCode}
            />
            
            <ModelSelector
              selectedModels={selectedModels}
              toggleModelSelection={toggleModelSelection}
              promptDetails={promptDetails}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-6">
          <ModelPerformance
            aggregatedPerformance={aggregatedPerformance}
            isLoadingPerformance={isLoadingPerformance}
          />
        </TabsContent>
        
        <TabsContent value="history" className="space-y-6">
          <ComparisonHistory
            comparisonHistory={comparisonHistory}
            isLoadingHistory={isLoadingHistory}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIModelComparison;
