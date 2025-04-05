
import React from "react";
import ChatInterface from "@/components/Chat/ChatInterface";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useChatbot } from "@/hooks/use-chatbot";
import { Mic, Volume2 } from "lucide-react";

const Chatbot = () => {
  const { sendMessage } = useChatbot();
  
  const suggestedPrompts = [
    "Analyze the current market trends for cryptocurrencies",
    "Recommend a trading strategy for volatile markets",
    "What are the pros and cons of momentum trading?",
    "Explain how AI can improve trading decisions"
  ];

  const handlePromptClick = (prompt: string) => {
    sendMessage(prompt);
  };

  return (
    <div className="container p-4 mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground">
          Interact with our AI assistant to answer your trading questions
        </p>
      </div>
      
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Chat with Trading AI</CardTitle>
            <CardDescription>
              Ask questions about markets, strategies, or get trading recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChatInterface />
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Prompts</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {suggestedPrompts.map((prompt, index) => (
                  <li 
                    key={index}
                    className="p-2 border rounded-md hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => handlePromptClick(prompt)}
                  >
                    "{prompt}"
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Voice Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Speech-to-Text</p>
                    <p className="text-sm text-muted-foreground">Speak to the assistant and have your words converted to text</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <div>
                    <p className="font-medium">Text-to-Speech</p>
                    <p className="text-sm text-muted-foreground">Listen to the assistant's responses read aloud</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>AI Assistant Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">API Provider:</span>
                  <span className="font-medium">OpenAI</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model:</span>
                  <span className="font-medium">GPT-4o-mini</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Context Length:</span>
                  <span className="font-medium">16K tokens</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Market Data:</span>
                  <span className="font-medium">Up to date</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Voice Features:</span>
                  <span className="font-medium">Enabled</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
