import { useRef, useCallback } from "react";

type Commands = {
  [command: string]: () => void;
};

export const useSpeechCommands = (commands: Commands) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);

  const initRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Web Speech API no disponible");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "es-ES";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("")
        .toLowerCase();

      Object.entries(commands).forEach(([command, callback]) => {
        if (transcript.includes(command.toLowerCase())) {
          callback();
        }
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error("Error de reconocimiento de voz:", event);
      if (event.error === "not-allowed") {
        recognition.stop();
      }
    };

    recognition.onend = () => {
      if (isListeningRef.current) {
        recognition.start(); // solo si seguimos escuchando
      }
    };

    recognitionRef.current = recognition;
  }, [commands]);

  const startListening = () => {
    if (!recognitionRef.current) initRecognition();
    isListeningRef.current = true;
    recognitionRef.current?.start();
  };

  const stopListening = () => {
    isListeningRef.current = false;
    recognitionRef.current?.stop();
  };

  return { startListening, stopListening };
};
