
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Bot, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/hooks/use-chatbot";

const ChatInterface = () => {
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, sendMessage } = useChatbot();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const message = userInput.trim();
    setUserInput("");
    
    try {
      await sendMessage(message);
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    }
  };

  // Auto-scroll to the bottom of the chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-[60vh]">
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
