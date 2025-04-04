
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { availableAIModels } from "@/services/trading/aiStrategyService";

interface ModelSelectorProps {
  selectedModels: string[];
  toggleModelSelection: (modelId: string) => void;
  promptDetails: {
    prompt: string;
    description: string;
  } | null;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModels,
  toggleModelSelection,
  promptDetails,
}) => {
  return (
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
  );
};

export default ModelSelector;
