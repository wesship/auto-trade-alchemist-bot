
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Calendar, TrendingUp } from "lucide-react";
import { availableAIModels } from "@/services/trading/aiStrategyService";
import ModelBenchmarking from "@/components/Models/ModelBenchmarking";

const ModelBenchmark = () => {
  const [selectedModel, setSelectedModel] = useState<string>(availableAIModels[0].id);
  const [timeRange, setTimeRange] = useState<string>("1y");

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const selectedModelDetails = availableAIModels.find(model => model.id === selectedModel);
  
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" />
            Model Benchmarking
          </h1>
          <p className="text-muted-foreground">
            Compare AI model performance against traditional strategies and indices
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
              <SelectItem value="3y">3 Years</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {availableAIModels.map(model => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedModelDetails && (
        <ModelBenchmarking 
          modelId={selectedModel}
          modelName={selectedModelDetails.name}
        />
      )}
      
      <Card>
        <CardHeader>
          <CardTitle>About Model Benchmarking</CardTitle>
          <CardDescription>
            Understanding how AI models compare to traditional strategies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Model benchmarking compares our AI trading models against traditional investment strategies and indices to evaluate their performance.
            This helps quantify the added value of our AI-powered approach versus conventional methods.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Benchmark Comparison</h3>
              <p className="text-sm text-muted-foreground">
                We compare against multiple benchmarks including market indices (S&P 500), simple strategies (Buy & Hold),
                and traditional machine learning models (Random Forest).
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Key Metrics</h3>
              <p className="text-sm text-muted-foreground">
                Performance is measured across return metrics (annual returns), risk-adjusted metrics (Sharpe ratio),
                and risk metrics (maximum drawdown, win rate).
              </p>
            </div>
            
            <div className="border rounded-md p-4">
              <h3 className="text-base font-medium mb-2">Testing Methodology</h3>
              <p className="text-sm text-muted-foreground">
                All models are tested using identical datasets, timeframes, and market conditions
                to ensure fair comparison across multiple asset classes.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModelBenchmark;
