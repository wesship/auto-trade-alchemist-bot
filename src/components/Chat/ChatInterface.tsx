
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/hooks/use-chatbot";

const ChatInterface = () => {
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage, clearMessages } = useChatbot();
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const message = userInput.trim();
    setUserInput("");
    
    try {
      setShowTypingIndicator(true);
      await sendMessage(message);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setShowTypingIndicator(false);
    }
  };

  const handleClearChat = () => {
    clearMessages();
    toast.success("Conversation cleared");
  };

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTypingIndicator]);

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 text-primary">
          <Bot className="w-4 h-4" />
          <span className="text-sm font-medium">AI Assistant</span>
        </div>
        {messages.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClearChat}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear chat
          </Button>
        )}
      </div>
      <ScrollArea className="flex-1 p-4 border rounded-md bg-card mb-4">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Bot className="w-12 h-12 mb-4 text-primary" />
              <h3 className="text-lg font-medium">AI Trading Assistant</h3>
              <p className="text-muted-foreground max-w-md mt-2">
                Ask me anything about trading, market analysis, or how to use AI for your investment strategies.
              </p>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={cn(
                  "flex gap-3 p-4 rounded-lg",
                  msg.role === "user"
                    ? "bg-accent ml-12"
                    : "bg-primary/10 mr-12"
                )}
              >
                <div className="flex-shrink-0 mt-1">
                  {msg.role === "user" ? (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                      <Bot className="w-4 h-4 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="font-medium mb-1">
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))
          )}
          {showTypingIndicator && (
            <div className="flex gap-3 p-4 rounded-lg bg-primary/10 mr-12 animate-pulse">
              <div className="flex-shrink-0 mt-1">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              </div>
              <div className="flex-1">
                <div className="font-medium mb-1">AI Assistant</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }}></div>
                  <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: "600ms" }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Textarea
          placeholder="Ask about trading strategies, market analysis, or AI predictions..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <Button type="submit" size="icon" disabled={isLoading || !userInput.trim()}>
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
    </div>
  );
};

export default ChatInterface;
