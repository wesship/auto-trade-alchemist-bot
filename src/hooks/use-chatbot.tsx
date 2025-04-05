
import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { fetchChatResponse } from "@/services/chatbotService";

export type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export function useChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      // We'll automatically add a welcome message when the chat is empty
      const welcomeMessage: ChatMessage = {
        role: "assistant", 
        content: "Hello! I'm your AI trading assistant. I can help you with market analysis, trading strategies, and investment decisions. What would you like to know today?"
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message to chat
    const userMessage: ChatMessage = { role: "user", content };
    setMessages((prev) => [...prev, userMessage]);
    
    setIsLoading(true);
    
    try {
      // Call API to get response
      const response = await fetchChatResponse([...messages, userMessage]);
      
      // Add assistant response to chat
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error in chat completion:", error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    clearMessages,
  };
}
