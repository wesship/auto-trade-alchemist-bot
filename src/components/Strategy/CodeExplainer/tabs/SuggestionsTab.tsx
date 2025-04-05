
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Sparkles } from 'lucide-react';

interface SuggestionsTabProps {
  suggestions: string[];
}

const SuggestionsTab: React.FC<SuggestionsTabProps> = ({ suggestions }) => {
  return (
    <TabsContent value="suggestions" className="space-y-4">
      <div className="bg-muted/30 rounded-md p-4">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          <Sparkles className="h-4 w-4 mr-2 text-primary" />
          AI Improvement Suggestions
        </h3>
        
        <ul className="space-y-2">
          {suggestions.map((suggestion, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-primary/10 text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                {index + 1}
              </span>
              <span className="text-sm">{suggestion}</span>
            </li>
          ))}
        </ul>
      </div>
    </TabsContent>
  );
};

export default SuggestionsTab;
