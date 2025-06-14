/// <reference path="../app/types/speech.d.ts" />

import { useEffect } from "react";

type CommandCallback = () => void;

type Commands = {
  [command: string]: CommandCallback;
};

export const useSpeechCommands = (commands: Commands) => {
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

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
    };

    recognition.onend = () => {
      recognition.start(); // reinicia reconocimiento al finalizar para mantenerlo activo
    };

    recognition.start();

    return () => {
      recognition.stop();
      recognition.abort();
    };
  }, [commands]);
};
