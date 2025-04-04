
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModelConfig } from "@/types/trading";
import { Brain, BarChart3, Play, PauseCircle, Calendar, Activity } from "lucide-react";

interface ModelCardProps {
  model: ModelConfig;
  onTrain: (modelId: string) => void;
  onView: (modelId: string) => void;
  isTraining: boolean;
}

const ModelCard = ({ model, onTrain, onView, isTraining }: ModelCardProps) => {
  // Helper function to format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
  };

  // Calculate the badge colors based on model status
  const getBadgeVariant = () => {
    if (model.status === "training") return "default";
    if (model.status === "ready") return "outline";
    return "secondary";
  };

  return (
    <Card className="overflow-hidden border-border">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="flex items-center">
              <Brain className="mr-2 h-5 w-5 text-primary" />
              {model.name}
            </CardTitle>
            <CardDescription className="mt-1">
              {model.description}
            </CardDescription>
          </div>
          <Badge variant={getBadgeVariant()} className="capitalize">
            {model.status === "training" ? (
              <span className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-primary mr-1.5 animate-pulse-glow"></span>
                Training
              </span>
            ) : model.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex items-center">
            <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Type:</span>
            <span className="ml-1 font-medium">{model.modelType}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Last trained:</span>
            <span className="ml-1 font-medium">{formatDate(model.lastTrained)}</span>
          </div>
          
          <div className="flex items-center">
            <BarChart3 className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-muted-foreground">Timeframe:</span>
            <span className="ml-1 font-medium">{model.timeframe}</span>
          </div>
          
          {model.accuracy !== undefined && (
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="ml-1 font-medium">{(model.accuracy * 100).toFixed(1)}%</span>
            </div>
          )}
        </div>
        
        <div>
          <h4 className="text-xs uppercase text-muted-foreground font-semibold mb-1.5">Features</h4>
          <div className="flex flex-wrap gap-1.5">
            {model.features.map((feature) => (
              <Badge key={feature} variant="secondary" className="capitalize text-xs py-0 px-2">
                {feature.replace(/_/g, ' ')}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-card py-3">
        <Button variant="outline" onClick={() => onView(model.id)}>
          View Results
        </Button>
        <Button 
          onClick={() => onTrain(model.id)} 
          disabled={model.status === "training" || isTraining}
          className="flex items-center"
        >
          {model.status === "training" ? (
            <>
              <PauseCircle className="mr-1.5 h-4 w-4" />
              Training...
            </>
          ) : (
            <>
              <Play className="mr-1.5 h-4 w-4" />
              Train Model
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ModelCard;
