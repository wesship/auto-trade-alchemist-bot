
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { availableAIModels } from "@/services/trading/aiStrategyService";
import ModelAccuracyDashboard from "@/components/Models/ModelAccuracyDashboard";

const ModelAccuracy = () => {
  const [selectedModel, setSelectedModel] = useState<string>(availableAIModels[0].id);
  const [timeRange, setTimeRange] = useState<string>("3m");

  const handleModelChange = (value: string) => {
    setSelectedModel(value);
  };

  const selectedModelDetails = availableAIModels.find(model => model.id === selectedModel);
  
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <BarChart3 className="mr-2 h-6 w-6 text-primary" />
            Model Accuracy Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track how accurately each AI model predicts market movements
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[120px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 Month</SelectItem>
              <SelectItem value="3m">3 Months</SelectItem>
              <SelectItem value="6m">6 Months</SelectItem>
              <SelectItem value="1y">1 Year</SelectItem>
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
        <ModelAccuracyDashboard 
          modelId={selectedModel}
          modelName={selectedModelDetails.name}
        />
      )}
    </div>
  );
};

export default ModelAccuracy;
