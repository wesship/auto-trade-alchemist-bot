
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, Send, Bot, User, Trash2, Mic, MicOff, 
  Volume2, VolumeX, HelpCircle, Command
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useChatbot } from "@/hooks/use-chatbot";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

const ChatInterface = () => {
  const [userInput, setUserInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages, isLoading, isSpeaking, setIsSpeaking, sendMessage, clearMessages } = useChatbot();
  const [showTypingIndicator, setShowTypingIndicator] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recordingPulse, setRecordingPulse] = useState(false);
  const [showCommandsDialog, setShowCommandsDialog] = useState(false);
  const [lastProcessedCommand, setLastProcessedCommand] = useState("");
  
  const { speak, cancel, speaking } = useSpeechSynthesis();
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition
  } = useSpeechRecognition();

  // Define voice commands
  const voiceCommands = [
    { command: "send", action: "Sends the current message" },
    { command: "clear", action: "Clears the conversation" },
    { command: "mute", action: "Toggles voice response on/off" },
    { command: "stop listening", action: "Stops voice recognition" },
    { command: "help", action: "Shows voice commands help" },
  ];

  useEffect(() => {
    if (transcript) {
      setUserInput(transcript);
      
      // Check for voice commands (only when transcript changes)
      const lowerTranscript = transcript.toLowerCase().trim();
      
      // Process commands only if they haven't been processed yet
      if (lowerTranscript !== lastProcessedCommand) {
        if (lowerTranscript === "send" && userInput.trim()) {
          handleSendMessage(new Event('submit') as any);
          setLastProcessedCommand(lowerTranscript);
          resetTranscript();
        } else if (lowerTranscript === "clear") {
          handleClearChat();
          setLastProcessedCommand(lowerTranscript);
          resetTranscript();
          toast.success("Chat cleared by voice command");
        } else if (lowerTranscript === "mute" || lowerTranscript === "unmute") {
          toggleVoice();
          setLastProcessedCommand(lowerTranscript);
          resetTranscript();
        } else if (lowerTranscript === "stop listening") {
          SpeechRecognition.stopListening();
          setLastProcessedCommand(lowerTranscript);
          resetTranscript();
          toast.info("Voice recognition stopped by command");
        } else if (lowerTranscript === "help") {
          setShowCommandsDialog(true);
          setLastProcessedCommand(lowerTranscript);
          resetTranscript();
        }
      }
    }
  }, [transcript]);

  useEffect(() => {
    setIsListening(listening);
    // Create pulsing effect when recording
    if (listening) {
      setRecordingPulse(true);
    } else {
      setTimeout(() => setRecordingPulse(false), 300);
      // Reset last processed command when listening stops
      setLastProcessedCommand("");
    }
  }, [listening]);

  useEffect(() => {
    setIsSpeaking(speaking);
  }, [speaking, setIsSpeaking]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    const message = userInput.trim();
    setUserInput("");
    resetTranscript();
    
    try {
      setShowTypingIndicator(true);
      const response = await sendMessage(message);
      
      // Read the response aloud if voice is enabled
      if (voiceEnabled && response) {
        speak({ text: response });
      }
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
      console.error("Error sending message:", error);
    } finally {
      setShowTypingIndicator(false);
    }
  };

  const handleClearChat = () => {
    clearMessages();
    resetTranscript();
    cancel();
    toast.success("Conversation cleared");
  };

  const toggleListening = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      toast.info("Voice recording stopped");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      toast.success("Listening to your voice...");
    }
  };

  const toggleVoice = () => {
    setVoiceEnabled(!voiceEnabled);
    if (speaking) {
      cancel();
    }
    toast.info(voiceEnabled ? "Voice responses turned off" : "Voice responses enabled");
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt+M to toggle mic
      if (e.altKey && e.key === 'm' && browserSupportsSpeechRecognition) {
        toggleListening();
      }
      // Alt+V to toggle voice responses
      if (e.altKey && e.key === 'v') {
        toggleVoice();
      }
      // Alt+C to clear chat
      if (e.altKey && e.key === 'c') {
        handleClearChat();
      }
      // Alt+H to show help
      if (e.altKey && e.key === 'h') {
        setShowCommandsDialog(true);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [listening, voiceEnabled]);

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
        <div className="flex gap-2">
          <Dialog open={showCommandsDialog} onOpenChange={setShowCommandsDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                title="Help & Commands"
                className="text-muted-foreground hover:text-primary"
              >
                <HelpCircle className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Command className="w-4 h-4" /> Voice Commands & Shortcuts
                </DialogTitle>
                <DialogDescription>
                  Use these commands to control the chat interface with your voice or keyboard.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Voice Commands</h4>
                  <ul className="space-y-2">
                    {voiceCommands.map((cmd, i) => (
                      <li key={i} className="flex justify-between items-center">
                        <Badge variant="outline" className="font-mono">
                          {cmd.command}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{cmd.action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Keyboard Shortcuts</h4>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center">
                      <Badge variant="outline" className="font-mono">Alt+M</Badge>
                      <span className="text-sm text-muted-foreground">Toggle microphone</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <Badge variant="outline" className="font-mono">Alt+V</Badge>
                      <span className="text-sm text-muted-foreground">Toggle voice responses</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <Badge variant="outline" className="font-mono">Alt+C</Badge>
                      <span className="text-sm text-muted-foreground">Clear conversation</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <Badge variant="outline" className="font-mono">Alt+H</Badge>
                      <span className="text-sm text-muted-foreground">Show this help dialog</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <Badge variant="outline" className="font-mono">Enter</Badge>
                      <span className="text-sm text-muted-foreground">Send message</span>
                    </li>
                    <li className="flex justify-between items-center">
                      <Badge variant="outline" className="font-mono">Shift+Enter</Badge>
                      <span className="text-sm text-muted-foreground">New line in message</span>
                    </li>
                  </ul>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleVoice}
            title={voiceEnabled ? "Mute voice (Alt+V)" : "Enable voice (Alt+V)"}
            className={cn(
              "text-muted-foreground transition-colors",
              voiceEnabled && "text-primary hover:text-primary/80"
            )}
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          {browserSupportsSpeechRecognition && (
            <Button
              variant={recordingPulse ? "default" : "ghost"}
              size="icon"
              onClick={toggleListening}
              title={isListening ? "Stop listening (Alt+M)" : "Start listening (Alt+M)"}
              className={cn(
                "transition-colors relative",
                isListening 
                  ? "bg-primary text-primary-foreground" 
                  : "text-muted-foreground hover:text-primary"
              )}
            >
              {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              {/* Sound wave animation when listening */}
              {isListening && (
                <span className="absolute inset-0 rounded-md">
                  <span className="absolute inset-0 animate-ping rounded-md bg-primary/30"></span>
                  <span className="absolute inset-[-4px] animate-ping delay-150 rounded-md bg-primary/20"></span>
                  <span className="absolute inset-[-8px] animate-ping delay-300 rounded-md bg-primary/10"></span>
                </span>
              )}
            </Button>
          )}
          {messages.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleClearChat}
              title="Clear chat (Alt+C)"
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear chat
            </Button>
          )}
        </div>
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
          {isListening && !isLoading && (
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
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="flex gap-2">
        <Textarea
          placeholder={isListening ? "Speak now or type your message... (say 'send' to submit)" : "Ask about trading strategies, market analysis, or AI predictions..."}
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
    </div>
  );
};

export default ChatInterface;
