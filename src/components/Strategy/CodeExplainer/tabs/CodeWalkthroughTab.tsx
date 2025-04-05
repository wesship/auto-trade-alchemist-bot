
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineExplanation } from '../types';

interface CodeWalkthroughTabProps {
  lineByLine: LineExplanation[];
}

const CodeWalkthroughTab: React.FC<CodeWalkthroughTabProps> = ({ lineByLine }) => {
  return (
    <TabsContent value="code" className="space-y-4">
      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted/20 p-3 border-b">
          <h3 className="text-sm font-medium">Line-by-Line Explanation</h3>
        </div>
        <div className="divide-y">
          {lineByLine.map((item, index) => (
            <div 
              key={index} 
              className={`flex text-xs ${item.important ? 'bg-primary/5' : ''}`}
            >
              <div className="py-2 px-3 text-muted-foreground text-right w-10 bg-muted/20 select-none">
                {index + 1}
              </div>
              <div className="py-2 px-3 font-mono flex-1 overflow-x-auto">
                {item.line || " "}
              </div>
              <div className="py-2 px-3 border-l text-muted-foreground flex-1">
                {item.important && <Badge variant="outline" className="mr-2">Key</Badge>}
                {item.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    </TabsContent>
  );
};

export default CodeWalkthroughTab;
