
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Brain } from 'lucide-react';

interface PromptTabProps {
  aiPromptUsed: string;
}

const PromptTab: React.FC<PromptTabProps> = ({ aiPromptUsed }) => {
  return (
    <TabsContent value="prompt" className="space-y-4">
      <div className="bg-muted/30 rounded-md p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Brain className="h-4 w-4 mr-2 text-primary" />
          AI Prompt Used
        </h3>
        
        <div className="border border-border/30 rounded-md p-3 bg-muted/20">
          <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
            {aiPromptUsed}
          </pre>
        </div>
        
        <p className="text-xs text-muted-foreground mt-2">
          This is the prompt that was used to generate this strategy with an AI model. You can use similar prompts with our platform to create your own strategies.
        </p>
      </div>
    </TabsContent>
  );
};

export default PromptTab;
