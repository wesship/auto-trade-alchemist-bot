
import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { fetchModels } from "@/services/tradingService";

interface MessageInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
  isListening: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  userInput,
  setUserInput,
  handleSendMessage,
  isLoading,
  isListening
}) => {
  const [hasNewPredictions, setHasNewPredictions] = useState(false);
  
  // Query for models to check for new predictions
  const { data: models } = useQuery({
    queryKey: ["models"],
    queryFn: fetchModels,
    refetchInterval: 60000, // Refetch every minute
  });

  // Check for new predictions in the last hour
  useEffect(() => {
    if (!models) return;
    
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);
    
    const recentPredictions = models.some(model => 
      model.recentSignals.some(signal => 
        new Date(signal.timestamp) > oneHourAgo
      )
    );
    
    setHasNewPredictions(recentPredictions);
  }, [models]);

  return (
    <form onSubmit={handleSendMessage} className="flex gap-2 relative">
      <Textarea
        placeholder={isListening 
          ? "Speak now or type your message... (say 'send' to submit)" 
          : "Ask about trading strategies, market analysis, or AI predictions..."
        }
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        className={cn(
          "resize-none",
          isListening && "border-primary"
        )}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
          }
        }}
      />
      
      {hasNewPredictions && (
        <div className="absolute right-16 top-1/2 -translate-y-1/2">
          <Button 
            type="button" 
            size="icon" 
            variant="ghost" 
            className="relative"
            onClick={() => {
              setUserInput("Tell me about the latest AI predictions");
              setHasNewPredictions(false);
            }}
          >
            <Bell className="w-4 h-4" />
            <Badge variant="success" className="absolute -top-1 -right-1 w-2 h-2 p-0"></Badge>
          </Button>
        </div>
      )}
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={isLoading || !userInput.trim()}
        className={cn(
          "transition-all",
          userInput.trim() && !isLoading ? "bg-primary" : "bg-muted"
        )}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
      </Button>
    </form>
  );
};

export default MessageInput;
