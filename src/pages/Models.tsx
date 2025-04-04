
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { fetchModels, trainModel } from "@/services/tradingService";
import { toast } from "sonner";
import ModelCard from "@/components/Models/ModelCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Loader2, Brain, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const Models = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentModelTraining, setCurrentModelTraining] = useState<string | null>(null);
  const [modelTypeFilter, setModelTypeFilter] = useState<string>("all");

  const { data: models, isLoading, error, refetch } = useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
  });

  const handleTrainModel = async (modelId: string) => {
    setCurrentModelTraining(modelId);
    toast.info("Model training started. This may take a few minutes...");
    
    try {
      const result = await trainModel(modelId);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(`Training failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setCurrentModelTraining(null);
      refetch();
    }
  };

  const handleViewModel = (modelId: string) => {
    navigate(`/models/${modelId}`);
  };

  const filteredModels = models?.filter(model => {
    const matchesSearch = 
      model.config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.config.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = 
      modelTypeFilter === "all" || 
      model.config.modelType.toLowerCase() === modelTypeFilter.toLowerCase();
    
    return matchesSearch && matchesType;
  });

  if (isLoading) {
    return (
      <div className="container max-w-7xl mx-auto p-6 flex flex-col items-center justify-center h-[400px]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading models...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container max-w-7xl mx-auto p-6 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-destructive mb-2">Error loading models</h2>
        <p className="text-muted-foreground mb-4">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">AI Trading Models</h1>
          <p className="text-muted-foreground">
            Manage, train and deploy your AI trading models
          </p>
        </div>
        
        <Button className="mt-4 lg:mt-0" onClick={() => toast.info("Create model functionality coming soon!")}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Model
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <Tabs defaultValue="all" value={modelTypeFilter} onValueChange={setModelTypeFilter}>
          <TabsList>
            <TabsTrigger value="all" className="flex items-center">
              <Brain className="h-4 w-4 mr-1" />
              All Models
            </TabsTrigger>
            <TabsTrigger value="lstm">LSTM</TabsTrigger>
            <TabsTrigger value="transformer">Transformer</TabsTrigger>
            <TabsTrigger value="ensemble">Ensemble</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {filteredModels && filteredModels.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredModels.map((model) => (
            <ModelCard
              key={model.config.id}
              model={model.config}
              onTrain={handleTrainModel}
              onView={handleViewModel}
              isTraining={currentModelTraining === model.config.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-muted/30 border border-border rounded-lg p-12 text-center">
          <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No models found</h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery
              ? `No models match your search criteria "${searchQuery}"`
              : "You don't have any AI trading models yet"}
          </p>
          <Button onClick={() => toast.info("Create model functionality coming soon!")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Your First Model
          </Button>
        </div>
      )}
    </div>
  );
};

export default Models;
