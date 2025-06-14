'use client';

import { useState, useEffect } from 'react';
import { FaRobot, FaStop, FaPlay, FaVolumeUp } from 'react-icons/fa';

export default function VoiceAssistant({ planetData }: { planetData: any }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Verificar compatibilidad del navegador
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setSpeechSynthesis(window.speechSynthesis);

    // Limpiar al desmontar el componente
    return () => {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const generateSpeechText = () => {
    let speechText = `Información sobre ${planetData.name}. `;
    speechText += `${planetData.description} `;
    
    speechText += `Datos clave: `;
    speechText += `Distancia al Sol: ${planetData.distanceFromSun.km} (${planetData.distanceFromSun.au}). `;
    speechText += `Gravedad: ${planetData.gravity}. `;
    speechText += `Temperatura promedio: ${planetData.avgTemperature}. `;
    speechText += `Periodo orbital: ${planetData.orbitalPeriod}. `;
    
    speechText += `Composición: ${planetData.composition}. `;
    
    if (planetData.notableFeatures.length > 0) {
      speechText += `Características notables: `;
      planetData.notableFeatures.forEach((feature: string) => {
        speechText += `${feature}. `;
      });
    }
    
    if (planetData.discovery) {
      speechText += `Descubrimiento: ${planetData.discovery}. `;
    }

    return speechText;
  };

  const speak = () => {
    if (!speechSynthesis || !isSupported) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = generateSpeechText();
    const utterance = new SpeechSynthesisUtterance(speechText);

    // Configuración de voz
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'es-ES';

    // Seleccionar voz en español si está disponible
    const voices = speechSynthesis.getVoices();
    const spanishVoice = voices.find(voice => voice.lang.includes('es'));
    if (spanishVoice) {
      utterance.voice = spanishVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  if (!isSupported) {
    return (
      <div className="text-sm text-gray-400 mt-4">
        Tu navegador no soporta la síntesis de voz.
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={speak}
        className={`p-4 rounded-full shadow-lg transition-all ${isSpeaking 
          ? 'bg-red-500 hover:bg-red-600 text-white' 
          : 'bg-cyan-600 hover:bg-cyan-700 text-white'}`}
        aria-label={isSpeaking ? 'Detener narración' : 'Escuchar información del planeta'}
      >
        {isSpeaking ? (
          <div className="flex items-center gap-2">
            <FaStop className="text-xl" />
            <span>Detener</span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <FaVolumeUp className="text-xl" />
            <span>Escuchar</span>
          </div>
        )}
      </button>
    </div>
  );
}