
import React from "react";
import { 
  Bot, HelpCircle, Command, Volume2, VolumeX, 
  Mic, MicOff, Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface ChatHeaderProps {
  messages: any[];
  handleClearChat: () => void;
  voiceEnabled: boolean;
  toggleVoice: () => void;
  isListening: boolean;
  toggleListening: () => void;
  recordingPulse: boolean;
  browserSupportsSpeechRecognition: boolean;
  showCommandsDialog: boolean;
  setShowCommandsDialog: (show: boolean) => void;
}

// Voice commands for help dialog
const voiceCommands = [
  { command: "send", action: "Sends the current message" },
  { command: "clear", action: "Clears the conversation" },
  { command: "mute", action: "Toggles voice response on/off" },
  { command: "stop listening", action: "Stops voice recognition" },
  { command: "help", action: "Shows voice commands help" },
];

const ChatHeader: React.FC<ChatHeaderProps> = ({
  messages,
  handleClearChat,
  voiceEnabled,
  toggleVoice,
  isListening,
  toggleListening,
  recordingPulse,
  browserSupportsSpeechRecognition,
  showCommandsDialog,
  setShowCommandsDialog,
}) => {
  return (
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
  );
};

export default ChatHeader;
