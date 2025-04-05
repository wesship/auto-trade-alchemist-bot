
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Terminal, BarChart3, Sparkles, Brain } from "lucide-react";
import pineScriptExamples from './pineScriptExamples';
import { getExplanationData } from './explanationService';
import CodeHeader from './CodeHeader';
import { OverviewTab, CodeWalkthroughTab, ComponentsTab, SuggestionsTab, PromptTab } from './tabs';
import { CodeExplainerProps } from './types';

const CodeExplainer: React.FC<CodeExplainerProps> = ({
  strategyCode,
  strategyName
}) => {
  const [explanation, setExplanation] = useState(getExplanationData(strategyCode));
  const [isExplaining, setIsExplaining] = useState(false);
  const [selectedExample, setSelectedExample] = useState<string | null>(null);
  
  const handleExplain = () => {
    setIsExplaining(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setExplanation(getExplanationData(selectedExample 
        ? pineScriptExamples[selectedExample as keyof typeof pineScriptExamples] 
        : strategyCode));
      setIsExplaining(false);
    }, 1500);
  };
  
  const handleSelectExample = (example: string | null) => {
    setSelectedExample(example);
    if (example) {
      const exampleCode = pineScriptExamples[example as keyof typeof pineScriptExamples];
      setExplanation(getExplanationData(exampleCode));
    } else {
      setExplanation(getExplanationData(strategyCode));
    }
  };
  
  const displayCode = selectedExample 
    ? pineScriptExamples[selectedExample as keyof typeof pineScriptExamples] 
    : strategyCode;
  
  return (
    <Card className="pb-1">
      <CardHeader>
        <CodeHeader 
          strategyName={strategyName}
          selectedExample={selectedExample}
          isExplaining={isExplaining}
          onSelectExample={handleSelectExample}
          onExplain={handleExplain}
        />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="overview">
              <Info className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Terminal className="h-4 w-4 mr-2" />
              Code Walkthrough
            </TabsTrigger>
            <TabsTrigger value="components">
              <BarChart3 className="h-4 w-4 mr-2" />
              Components
            </TabsTrigger>
            <TabsTrigger value="suggestions">
              <Sparkles className="h-4 w-4 mr-2" />
              Suggestions
            </TabsTrigger>
            <TabsTrigger value="prompt">
              <Brain className="h-4 w-4 mr-2" />
              AI Prompt
            </TabsTrigger>
          </TabsList>
          
          <OverviewTab explanation={explanation} displayCode={displayCode} />
          <CodeWalkthroughTab lineByLine={explanation.lineByLine} />
          <ComponentsTab keyComponents={explanation.keyComponents} />
          <SuggestionsTab suggestions={explanation.suggestions} />
          <PromptTab aiPromptUsed={explanation.aiPromptUsed} />
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeExplainer;
