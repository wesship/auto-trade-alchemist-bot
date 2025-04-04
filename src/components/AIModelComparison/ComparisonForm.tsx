
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3 } from "lucide-react";
import { strategyPrompts } from "@/services/trading/aiStrategyService";
import PromptSelector from "./PromptSelector";
import ComparisonResults from "./ComparisonResults";
import { ModelComparisonData } from "@/utils/monitoring/types";

interface ComparisonFormProps {
  selectedPromptId: string;
  setSelectedPromptId: (id: string) => void;
  handleRunComparison: () => void;
  isComparing: boolean;
  comparisonResults: ModelComparisonData[] | undefined;
  viewCode: string | null;
  setViewCode: (modelId: string | null) => void;
}

const ComparisonForm: React.FC<ComparisonFormProps> = ({
  selectedPromptId,
  setSelectedPromptId,
  handleRunComparison,
  isComparing,
  comparisonResults,
  viewCode,
  setViewCode
}) => {
  const getPromptDetails = (promptId: string) => {
    for (const category in strategyPrompts) {
      const prompt = strategyPrompts[category as keyof typeof strategyPrompts].find(p => p.id === promptId);
      if (prompt) return prompt;
    }
    return null;
  };
  
  const promptDetails = getPromptDetails(selectedPromptId);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Model Comparison</CardTitle>
        <CardDescription>
          Compare how different AI models perform on the same strategy generation task
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <PromptSelector 
          selectedPromptId={selectedPromptId}
          setSelectedPromptId={setSelectedPromptId}
          promptDetails={promptDetails}
        />
        
        <Button 
          onClick={handleRunComparison} 
          disabled={isComparing}
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
        
        {comparisonResults && (
          <ComparisonResults 
            comparisonResults={comparisonResults} 
            viewCode={viewCode}
            setViewCode={setViewCode}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ComparisonForm;
