
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

// Sample PineScript strategies
const pineScriptExamples = {
  bollinger: `//@version=5
strategy(shorttitle="BB Strategy", title="Demo GPT - Bollinger Bands Strategy", overlay=true, commission_type=strategy.commission.percent, commission_value=0.1, slippage=0, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// Inputs
length = input.int(20, minval=1, title="Length")
maType = input.string("SMA", "Basis MA Type", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA"])
src = input(close, title="Source")
mult = input.float(2.0, minval=0.001, maxval=50, title="StdDev")
offset = input.int(0, "Offset", minval = -500, maxval = 500)

// Date Range Filter
startDate = input.time(title="Start Date", defval=timestamp("2018-01-01"), confirm=false)
endDate = input.time(title="End Date", defval=timestamp("2069-12-31"), confirm=false)
timeAllowed = time >= startDate and time <= endDate

// MA Type Selector
ma(source, length, _type) =>
    switch _type
        "SMA" => ta.sma(source, length)
        "EMA" => ta.ema(source, length)
        "SMMA (RMA)" => ta.rma(source, length)
        "WMA" => ta.wma(source, length)
        "VWMA" => ta.vwma(source, length)

// Calculations
basis = ma(src, length, maType)
dev = mult * ta.stdev(src, length)
upper = basis + dev
lower = basis - dev

// Preserve Indicator Plots
plot(basis, "Basis", color=#2962FF, offset=offset)
p1 = plot(upper, "Upper", color=#F23645, offset=offset)
p2 = plot(lower, "Lower", color=#089981, offset=offset)
fill(p1, p2, title="Background", color=color.rgb(33, 150, 243, 95))

// Strategy Logic
enterLong = ta.crossover(close, upper) and timeAllowed
exitLong = ta.crossunder(close, lower) and timeAllowed

if enterLong
    strategy.entry("Long", strategy.long)
if exitLong
    strategy.close("Long")`,
  bollingerModified: `//@version=5
strategy(shorttitle="BB Strategy", title="Demo GPT - Bollinger Bands Strategy", overlay=true, commission_type=strategy.commission.percent, commission_value=0.1, slippage=0, default_qty_type=strategy.percent_of_equity, default_qty_value=100)

// Inputs
length = input.int(20, minval=1, title="Length")
maType = input.string("SMA", "Basis MA Type", options = ["SMA", "EMA", "SMMA (RMA)", "WMA", "VWMA"])
src = input(close, title="Source")
mult = input.float(2.0, minval=0.001, maxval=50, title="StdDev")
offset = input.int(0, "Offset", minval = -500, maxval = 500)

// Date Range Filter
startDate = input.time(title="Start Date", defval=timestamp("2018-01-01"), confirm=false)
endDate = input.time(title="End Date", defval=timestamp("2069-12-31"), confirm=false)
timeAllowed = time >= startDate and time <= endDate

// MA Type Selector
ma(source, length, _type) =>
    switch _type
        "SMA" => ta.sma(source, length)
        "EMA" => ta.ema(source, length)
        "SMMA (RMA)" => ta.rma(source, length)
        "WMA" => ta.wma(source, length)
        "VWMA" => ta.vwma(source, length)

// Calculations
basis = ma(src, length, maType)
dev = mult * ta.stdev(src, length)
upper = basis + dev
lower = basis - dev

// Preserve Indicator Plots
plot(basis, "Basis", color=#2962FF, offset=offset)
p1 = plot(upper, "Upper", color=#F23645, offset=offset)
p2 = plot(lower, "Lower", color=#089981, offset=offset)
fill(p1, p2, title="Background", color=color.rgb(33, 150, 243, 95))

// Strategy Logic
enterLong = ta.crossover(close, lower) and timeAllowed // Modified: Price crosses above lower band
exitLong = ta.crossunder(close, lower) and timeAllowed // Exit when price crosses back below lower band

if enterLong
    strategy.entry("Long", strategy.long)
if exitLong
    strategy.close("Long")`
};

// Mock explanation data
const getExplanationData = (code: string) => {
  // Determine if we're dealing with the original or modified Bollinger bands strategy
  const isModifiedBollinger = code.includes("enterLong = ta.crossover(close, lower)");
  
  // In a real app, this would call an AI service
  return {
    summary: isModifiedBollinger 
      ? "This strategy uses Bollinger Bands to identify potential entries when price crosses above the lower band, indicating a potential bounce from oversold conditions. It exits when price crosses back below the lower band."
      : "This strategy uses Bollinger Bands to identify potential breakout opportunities. It enters a long position when price closes above the upper band (indicating strong momentum) and exits when price falls below the lower band.",
    keyComponents: [
      {
        name: "Indicators Used",
        description: "Bollinger Bands with customizable length and standard deviation multiplier"
      },
      {
        name: "Entry Conditions",
        description: isModifiedBollinger 
          ? "Buys when price crosses above the lower Bollinger Band, indicating a potential bounce."
          : "Buys when price crosses above the upper Bollinger Band, indicating a potential breakout."
      },
      {
        name: "Exit Conditions",
        description: "Sells when price crosses below the lower Bollinger Band."
      },
      {
        name: "Risk Management",
        description: "Uses 100% of available equity for each trade with a 0.1% commission."
      }
    ],
    lineByLine: code.split('\n').map((line, index) => {
      // Simple rule-based explanations
      const explanation = line.includes('//') 
        ? "Comment explaining the code"
        : line.includes('strategy(') 
        ? "Defines the strategy name and settings" 
        : line.includes('input.') 
        ? "User-configurable parameter for the strategy"
        : line.includes('ta.crossover') 
        ? "Checks if price has crossed above a threshold"
        : line.includes('ta.crossunder') 
        ? "Checks if price has crossed below a threshold"
        : line.includes('strategy.entry') 
        ? "Executes a buy order"
        : line.includes('strategy.close') 
        ? "Closes an existing position"
        : line.includes('plot(') 
        ? "Displays indicator on the chart"
        : line.includes('ma(') 
        ? "Custom function to calculate moving averages of different types"
        : line.includes('basis =') 
        ? "Calculates the middle band (moving average)"
        : line.includes('upper =') 
        ? "Calculates the upper band (MA + standard deviation)"
        : line.includes('lower =') 
        ? "Calculates the lower band (MA - standard deviation)"
        : line.trim() === "" 
        ? "Empty line for readability"
        : "Code statement";
      
      return {
        line,
        explanation,
        important: line.includes('enterLong') || line.includes('exitLong') || line.includes('strategy.entry') || line.includes('strategy.close')
      };
    }),
    suggestions: [
      "Consider adding a filter based on overall market trend",
      "Experiment with different standard deviation multipliers for tighter or wider bands",
      "Test adding a volume filter to reduce false signals",
      "Try adding a trailing stop-loss to lock in profits",
      "Consider adjusting position sizing based on volatility"
    ],
    aiPromptUsed: isModifiedBollinger
      ? "This is a Pine Script code. Can you modify it to make it open a long trade when price comes from below the band and closes above. By band I mean Bollinger band."
      : "You are a professional PineScript v6 developer. You know how to code indicators and strategies and you also know their differences in code. I need your help to turn a TradingView indicator into a strategy please.\n\nWhen to buy and when to sell:\n- Go long when price closes above the upper Bollinger Band.\n- Close long when price closed below the lower Bollinger Band."
  };
};

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
      setExplanation(getExplanationData(selectedExample ? pineScriptExamples[selectedExample as keyof typeof pineScriptExamples] : strategyCode));
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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Code className="mr-2 h-5 w-5 text-primary" />
              {selectedExample 
                ? (selectedExample === 'bollinger' 
                    ? 'Bollinger Bands Strategy' 
                    : 'Modified Bollinger Bands Strategy')
                : strategyName} Code Explanation
            </CardTitle>
            <CardDescription>
              AI-powered breakdown of how this strategy works
            </CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectExample('bollinger')}
              className={selectedExample === 'bollinger' ? 'bg-primary/20' : ''}
            >
              Example 1
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectExample('bollingerModified')}
              className={selectedExample === 'bollingerModified' ? 'bg-primary/20' : ''}
            >
              Example 2
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSelectExample(null)}
              className={!selectedExample ? 'bg-primary/20' : ''}
            >
              Current
            </Button>
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
        </div>
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
          
          <TabsContent value="prompt" className="space-y-4">
            <div className="bg-muted/30 rounded-md p-4">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <Brain className="h-4 w-4 mr-2 text-primary" />
                AI Prompt Used
              </h3>
              
              <div className="border border-border/30 rounded-md p-3 bg-muted/20">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap">
                  {explanation.aiPromptUsed}
                </pre>
              </div>
              
              <p className="text-xs text-muted-foreground mt-2">
                This is the prompt that was used to generate this strategy with an AI model. You can use similar prompts with our platform to create your own strategies.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CodeExplainer;
