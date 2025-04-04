
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Brain, Info, Code, Terminal, BarChart3, Sparkles } from "lucide-react";

interface CodeExplainerProps {
  strategyCode: string;
  strategyName: string;
}

// Mock explanation data
const getExplanationData = (code: string) => {
  // In a real app, this would call an AI service
  return {
    summary: "This strategy uses exponential moving averages (EMAs) to identify trend direction changes. It generates buy signals when a faster EMA crosses above a slower EMA (Golden Cross) and sell signals when the opposite occurs (Death Cross).",
    keyComponents: [
      {
        name: "Indicators Used",
        description: "Two exponential moving averages (EMAs) with customizable lengths."
      },
      {
        name: "Entry Conditions",
        description: "Buys when the fast EMA crosses above the slow EMA (Golden Cross)."
      },
      {
        name: "Exit Conditions",
        description: "Sells when the fast EMA crosses below the slow EMA (Death Cross)."
      },
      {
        name: "Risk Management",
        description: "No explicit stop-loss or take-profit levels defined, relies on the crossover signals only."
      }
    ],
    lineByLine: code.split('\n').map((line, index) => {
      // Simple rule-based explanations
      const explanation = line.includes('//') 
        ? "Comment explaining the code"
        : line.includes('strategy(') 
        ? "Defines the strategy name and settings" 
        : line.includes('ema(') 
        ? "Calculates the exponential moving average"
        : line.includes('crossover') 
        ? "Checks if one value has crossed above another"
        : line.includes('crossunder') 
        ? "Checks if one value has crossed below another"
        : line.includes('strategy.entry') 
        ? "Executes a buy order"
        : line.includes('strategy.close') 
        ? "Closes an existing position"
        : line.includes('plot(') 
        ? "Displays indicator on the chart"
        : line.trim() === "" 
        ? "Empty line for readability"
        : "Code statement";
      
      return {
        line,
        explanation,
        important: line.includes('crossover') || line.includes('strategy.entry') || line.includes('strategy.close')
      };
    }),
    suggestions: [
      "Consider adding a stop-loss to manage downside risk",
      "Try adding a volume filter to reduce false signals",
      "Test different EMA periods to optimize performance",
      "Add a volatility filter to avoid choppy markets"
    ]
  };
};

const CodeExplainer: React.FC<CodeExplainerProps> = ({
  strategyCode,
  strategyName
}) => {
  const [explanation, setExplanation] = useState(getExplanationData(strategyCode));
  const [isExplaining, setIsExplaining] = useState(false);
  
  const handleExplain = () => {
    setIsExplaining(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setExplanation(getExplanationData(strategyCode));
      setIsExplaining(false);
    }, 1500);
  };
  
  return (
    <Card className="pb-1">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5 text-primary" />
              {strategyName} Code Explanation
            </CardTitle>
            <CardDescription>
              AI-powered breakdown of how this strategy works
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExplain}
            disabled={isExplaining}
          >
            {isExplaining ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Re-analyze
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-4 mb-4">
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
          </TabsList>
          
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
                  <code>{strategyCode}</code>
                </pre>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="code" className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-muted/20 p-3 border-b">
                <h3 className="text-sm font-medium">Line-by-Line Explanation</h3>
              </div>
              <div className="divide-y">
                {explanation.lineByLine.map((item, index) => (
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
          
          <TabsContent value="components" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {explanation.keyComponents.map((component, index) => (
                <div key={index} className="border rounded-md p-4">
                  <h3 className="text-sm font-medium mb-1">{component.name}</h3>
                  <p className="text-sm text-muted-foreground">{component.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="suggestions" className="space-y-4">
            <div className="bg-muted/30 rounded-md p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-primary" />
                AI Improvement Suggestions
              </h3>
              
              <ul className="space-y-2">
                {explanation.suggestions.map((suggestion, index) => (
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
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeExplainer;
