
import React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

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
  return (
    <form onSubmit={handleSendMessage} className="flex gap-2">
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
