
import { useState, useEffect, useCallback } from 'react';
import { toast } from "sonner";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { useSpeechSynthesis } from 'react-speech-kit';

export function useChatVoiceCommands(onSendMessage: (message: string) => Promise<void>, onClearChat: () => void) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
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

  // Track listening state
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

  // Track speaking state
  useEffect(() => {
    setIsSpeaking(speaking);
  }, [speaking]);

  // Process voice commands
  useEffect(() => {
    if (transcript) {
      // Check for voice commands (only when transcript changes)
      const lowerTranscript = transcript.toLowerCase().trim();
      
      // Process commands only if they haven't been processed yet
      if (lowerTranscript !== lastProcessedCommand) {
        if (lowerTranscript === "send" && transcript.trim()) {
          // We'll handle this in the component
          setLastProcessedCommand(lowerTranscript);
        } else if (lowerTranscript === "clear") {
          onClearChat();
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
  }, [transcript, onClearChat, resetTranscript]);

  const toggleListening = useCallback(() => {
    if (listening) {
      SpeechRecognition.stopListening();
      toast.info("Voice recording stopped");
    } else {
      resetTranscript();
      SpeechRecognition.startListening({ continuous: true });
      toast.success("Listening to your voice...");
    }
  }, [listening, resetTranscript]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => !prev);
    if (speaking) {
      cancel();
    }
    toast.info(voiceEnabled ? "Voice responses turned off" : "Voice responses enabled");
  }, [voiceEnabled, speaking, cancel]);

  const speakResponse = useCallback((text: string) => {
    if (voiceEnabled) {
      speak({ text });
    }
  }, [voiceEnabled, speak]);

  const handleKeyboardShortcuts = useCallback((e: KeyboardEvent) => {
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
      onClearChat();
    }
    // Alt+H to show help
    if (e.altKey && e.key === 'h') {
      setShowCommandsDialog(true);
    }
  }, [toggleListening, toggleVoice, onClearChat, browserSupportsSpeechRecognition]);

  // Setup keyboard shortcuts
  useEffect(() => {
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => {
      window.removeEventListener('keydown', handleKeyboardShortcuts);
    };
  }, [handleKeyboardShortcuts]);

  return {
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
  };
}
