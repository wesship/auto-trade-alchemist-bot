
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Cpu, Sparkles, Info } from "lucide-react";
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl">Select Models</CardTitle>
        </div>
        <CardDescription>
          Choose which AI models to include in the comparison
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="bg-muted/30 rounded-md p-3">
          <div className="text-xs text-muted-foreground mb-2 flex justify-between items-center">
            <span className="font-medium">Available Models</span>
            <Badge variant="outline" className="text-xs font-normal">
              {selectedModels.length} selected
            </Badge>
          </div>
          
          <RadioGroup 
            className="space-y-3" 
            value={selectedModels.join(',')}
            onValueChange={() => {}}
          >
            {availableAIModels.map(model => (
              <div 
                key={model.id} 
                className={`relative flex items-start p-3 rounded-lg border transition-all ${
                  selectedModels.includes(model.id) 
                    ? 'border-primary bg-primary/5' 
                    : 'border-transparent hover:bg-muted/50'
                } ${!model.isAvailable ? 'opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  id={`model-${model.id}`}
                  checked={selectedModels.includes(model.id)}
                  onChange={() => toggleModelSelection(model.id)}
                  disabled={!model.isAvailable}
                  className="peer sr-only"
                />
                <div className="flex w-full justify-between">
                  <div className="flex-1 space-y-1">
                    <Label 
                      htmlFor={`model-${model.id}`}
                      className="text-sm font-medium flex items-center cursor-pointer"
                    >
                      {model.name}
                      {model.isNew && (
                        <Badge className="ml-2 bg-primary/20 text-primary text-[10px] py-0 px-1.5">NEW</Badge>
                      )}
                    </Label>
                    <p className="text-xs text-muted-foreground">{model.description}</p>
                  </div>
                  
                  <div className="flex h-5 items-center">
                    <RadioGroupItem 
                      value={model.id} 
                      id={`model-radio-${model.id}`}
                      className={`${selectedModels.includes(model.id) ? 'border-primary' : 'border-muted-foreground/30'}`}
                      aria-label={`Select ${model.name}`}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleModelSelection(model.id);
                      }}
                      disabled={!model.isAvailable}
                    />
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        {promptDetails && (
          <div className="space-y-2 animate-fade-in">
            <div className="flex items-center text-sm font-medium">
              <Info className="h-4 w-4 mr-1.5 text-muted-foreground" />
              <span>Current Prompt</span>
            </div>
            <div className="p-3 bg-muted/40 rounded-md text-sm border border-border/30 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-primary/50"></div>
              <div className="text-xs text-muted-foreground whitespace-pre-wrap">
                {promptDetails.prompt}
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              {promptDetails.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ModelSelector;
