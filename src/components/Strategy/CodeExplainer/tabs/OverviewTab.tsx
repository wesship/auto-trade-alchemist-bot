
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { ExplanationData } from '../types';

interface OverviewTabProps {
  explanation: ExplanationData;
  displayCode: string;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ explanation, displayCode }) => {
  return (
    <TabsContent value="overview" className="space-y-4">
      <div className="bg-muted/40 p-4 rounded-md border border-border/30">
        <h3 className="text-base font-medium mb-2">Strategy Summary</h3>
        <p className="text-sm text-muted-foreground">{explanation.summary}</p>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <div className="bg-muted/20 p-3 border-b">
          <h3 className="text-sm font-medium">Pine Script Code</h3>
        </div>
        <div className="p-3 bg-muted/5 font-mono text-xs">
          <pre className="overflow-x-auto">
            <code>{displayCode}</code>
          </pre>
        </div>
      </div>
    </TabsContent>
  );
};

export default OverviewTab;
