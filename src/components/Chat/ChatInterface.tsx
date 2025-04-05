
import React, { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { useChatbot } from "@/hooks/use-chatbot";
import { useChatVoiceCommands } from "@/hooks/use-chat-voice-commands";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatInterface = () => {
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, setIsSpeaking, sendMessage, clearMessages } = useChatbot();
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  
  // Custom hook for voice commands
  const {
    isListening,
    isSpeaking,
    voiceEnabled,
    recordingPulse,
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    toggleListening,
    toggleVoice,
    speakResponse,
    cancel,
    showCommandsDialog,
    setShowCommandsDialog,
    lastProcessedCommand,
  } = useChatVoiceCommands(
    async (message: string) => await handleSendMessage(new Event('submit') as any),
    handleClearChat
  );

  // Process voice command to send message
  useEffect(() => {
    if (lastProcessedCommand === "send" && userInput.trim()) {
      handleSendMessage(new Event('submit') as any);
    }
  }, [lastProcessedCommand, userInput]);

  // Auto-scroll when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, showTypingIndicator]);

  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const message = userInput.trim();
    setUserInput("");
    resetTranscript();
    
    try {
      setShowTypingIndicator(true);
      const response = await sendMessage(message);
      
      // Read the response aloud if voice is enabled
      if (response) {
        speakResponse(response);
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setShowTypingIndicator(false);
    }
  }

  function handleClearChat() {
    clearMessages();
    resetTranscript();
    cancel();
    toast.success("Conversation cleared");
  }

  return (
    <div className="flex flex-col h-[60vh]">
      <ChatHeader 
        messages={messages}
        handleClearChat={handleClearChat}
        voiceEnabled={voiceEnabled}
        toggleVoice={toggleVoice}
        isListening={isListening}
        toggleListening={toggleListening}
        recordingPulse={recordingPulse}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        showCommandsDialog={showCommandsDialog}
        setShowCommandsDialog={setShowCommandsDialog}
      />
      
      <MessageList 
        messages={messages}
        isSpeaking={isSpeaking}
        isLoading={isLoading}
        isListening={isListening}
        transcript={transcript}
        toggleListening={toggleListening}
        browserSupportsSpeechRecognition={browserSupportsSpeechRecognition}
        messagesEndRef={messagesEndRef}
        showTypingIndicator={showTypingIndicator}
      />
      
      <MessageInput 
        userInput={userInput}
        setUserInput={setUserInput}
        handleSendMessage={handleSendMessage}
        isLoading={isLoading}
        isListening={isListening}
      />
    </div>
  );
};

export default ChatInterface;
