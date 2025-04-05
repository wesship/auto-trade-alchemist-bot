
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User, Mic } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/hooks/use-chatbot";

interface MessageListProps {
  messages: ChatMessage[];
  isSpeaking: boolean;
  isLoading: boolean;
  isListening: boolean;
  transcript: string;
  toggleListening: () => void;
  browserSupportsSpeechRecognition: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  showTypingIndicator: boolean;
}

const EmptyState: React.FC<{
  toggleListening: () => void;
  browserSupportsSpeechRecognition: boolean;
}> = ({ toggleListening, browserSupportsSpeechRecognition }) => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <Bot className="w-12 h-12 mb-4 text-primary" />
    <h3 className="text-lg font-medium">AI Trading Assistant</h3>
    <p className="text-muted-foreground max-w-md mt-2">
      Ask me anything about trading, market analysis, or how to use AI for your investment strategies.
    </p>
    {browserSupportsSpeechRecognition && (
      <div className="mt-4 space-y-2">
        <Button 
          onClick={toggleListening} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <Mic className="w-4 h-4" />
          Try using voice commands
        </Button>
        <p className="text-xs text-muted-foreground">
          Say "help" to see available commands or press Alt+H
        </p>
      </div>
    )}
  </div>
);

const TypingIndicator: React.FC = () => (
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
);

const ListeningIndicator: React.FC<{ transcript: string }> = ({ transcript }) => (
  <div className="flex gap-3 p-4 rounded-lg bg-accent ml-12">
    <div className="flex-shrink-0 mt-1">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
        <Mic className="w-4 h-4 text-primary-foreground animate-pulse" />
      </div>
    </div>
    <div className="flex-1">
      <div className="font-medium mb-1 flex items-center gap-2">
        Listening...
        <div className="flex space-x-1">
          <div className="w-1 h-6 bg-primary/60 rounded animate-[sound_0.5s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0ms" }}></div>
          <div className="w-1 h-10 bg-primary/80 rounded animate-[sound_0.5s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0.33s" }}></div>
          <div className="w-1 h-8 bg-primary/70 rounded animate-[sound_0.5s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0.66s" }}></div>
          <div className="w-1 h-4 bg-primary/50 rounded animate-[sound_0.5s_ease-in-out_infinite_alternate]" style={{ animationDelay: "0.99s" }}></div>
        </div>
      </div>
      <div className="whitespace-pre-wrap">{transcript}</div>
    </div>
  </div>
);

const MessageList: React.FC<MessageListProps> = ({
  messages,
  isSpeaking,
  isLoading,
  isListening,
  transcript,
  toggleListening,
  browserSupportsSpeechRecognition,
  messagesEndRef,
  showTypingIndicator,
}) => {
  return (
    <ScrollArea className="flex-1 p-4 border rounded-md bg-card mb-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <EmptyState 
            toggleListening={toggleListening} 
            browserSupportsSpeechRecognition={browserSupportsSpeechRecognition} 
          />
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "flex gap-3 p-4 rounded-lg transition-all duration-300",
                msg.role === "user"
                  ? "bg-accent ml-12"
                  : "bg-primary/10 mr-12",
                // Add animation for new messages
                index === messages.length - 1 && "animate-fade-in"
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
                <div className="font-medium mb-1 flex items-center gap-2">
                  {msg.role === "user" ? "You" : "AI Assistant"}
                  {msg.role === "assistant" && isSpeaking && (
                    <Badge variant="outline" className="text-xs animate-pulse">
                      Speaking
                    </Badge>
                  )}
                </div>
                <div className="whitespace-pre-wrap">
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        {showTypingIndicator && <TypingIndicator />}
        {isListening && !isLoading && <ListeningIndicator transcript={transcript} />}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
