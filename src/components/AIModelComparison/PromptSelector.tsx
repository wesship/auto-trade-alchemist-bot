
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { strategyPrompts } from "@/services/trading/aiStrategyService";

interface PromptSelectorProps {
  selectedPromptId: string;
  setSelectedPromptId: (id: string) => void;
  promptDetails: {
    name: string;
    description: string;
  } | null;
}

const PromptSelector: React.FC<PromptSelectorProps> = ({
  selectedPromptId,
  setSelectedPromptId,
  promptDetails
}) => {
  return (
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
  );
};

export default PromptSelector;
