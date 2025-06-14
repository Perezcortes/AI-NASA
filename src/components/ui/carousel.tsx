'use client';

import { useState, useEffect, useRef } from "react";
import { FaChevronLeft, FaChevronRight, FaLanguage, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import type { ApodResponse } from "../../app/types/nasa";
import { useSpeechCommands } from '../../hooks/useSpeechCommands';

const synth = typeof window !== "undefined" ? window.speechSynthesis : null;

export const Carousel = ({ images }: { images: ApodResponse[] }) => {
    const [index, setIndex] = useState(0);
    const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
    const [translatedExplanation, setTranslatedExplanation] = useState<string | null>(null);
    const [translating, setTranslating] = useState(false);
    const [direction, setDirection] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [speaking, setSpeaking] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const current = images[index];

    const navigate = (dir: number) => {
        stopSpeaking();
        setDirection(dir);
        setImageLoaded(false);
        setTranslatedTitle(null);
        setTranslatedExplanation(null);
        setError(null);
        setIndex((i) => (i + dir + images.length) % images.length);
    };

    const translateContent = async () => {
        if (translatedExplanation) {
            setTranslatedTitle(null);
            setTranslatedExplanation(null);
            return;
        }

        setTranslating(true);
        setError(null);

        try {
            const res = await fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: current.title,
                    explanation: current.explanation,
                    to: 'es'
                }),
            });

            const data = await res.json();

            if (data.error) {
                throw new Error(data.error);
            }

            if (!data.translations) {
                throw new Error('Formato de respuesta inválido');
            }

            setTranslatedTitle(data.translations.title || `📌 ${current.title} (Traducido)`);
            setTranslatedExplanation(data.translations.explanation);
        } catch (err) {
            console.error('Error en traducción:', err);
            setError(err instanceof Error ? err.message : 'Error al traducir');
            setTranslatedTitle(`📌 ${current.title} (Traducido)`);
            setTranslatedExplanation(`[Traducción simulada] ${current.explanation.substring(0, 150)}...`);
        } finally {
            setTranslating(false);
        }
    };

    const speakContent = () => {
        if (!synth) return;

        const utterance = new SpeechSynthesisUtterance();
        utteranceRef.current = utterance;

        utterance.text = `${translatedTitle || current.title}. ${translatedExplanation || current.explanation}`;
        utterance.lang = translatedExplanation ? "es-ES" : "en-US";
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);

        synth.cancel();
        synth.speak(utterance);
    };

    const stopSpeaking = () => {
        synth?.cancel();
        setSpeaking(false);
    };

    useSpeechCommands({
        'léelo': speakContent,
        'detén lectura': stopSpeaking,
    });


    useEffect(() => {
        const timer = setTimeout(() => setImageLoaded(true), 300);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className="space-y-8">
            {/* Contenedor de imagen */}
            <div className="relative h-[70vh] max-h-[800px] rounded-2xl overflow-hidden bg-gray-800/50">
                <AnimatePresence custom={direction}>
                    <motion.div
                        key={index}
                        custom={direction}
                        initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
                        transition={{ duration: 0.5 }}
                        className="absolute inset-0"
                    >
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-800/30">
                                <FaSpinner className="animate-spin text-cyan-400 text-4xl" />
                            </div>
                        )}
                        <img
                            src={current.url}
                            alt={current.title}
                            className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(true)}
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Controles de navegación */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-4 rounded-full text-white shadow-lg transition-all group"
                    aria-label="Imagen anterior"
                >
                    <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={() => navigate(1)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 p-4 rounded-full text-white shadow-lg transition-all group"
                    aria-label="Siguiente imagen"
                >
                    <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Indicador de imagen */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-1 rounded-full text-sm text-white">
                    {index + 1} / {images.length}
                </div>
            </div>

            {/* Panel de contenido */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/40 backdrop-blur-sm p-6 rounded-xl border border-gray-700/50"
            >
                <div className="flex justify-between items-start mb-4 flex-wrap gap-2">
                    <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        {translatedTitle || current.title}
                    </h2>
                    <span className="text-sm text-gray-400 min-w-max">
                        {current.date}
                    </span>
                </div>

                <motion.p
                    className="text-gray-300 leading-relaxed whitespace-pre-line mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {translatedExplanation || current.explanation}
                </motion.p>

                {error && (
                    <div className="mb-4 p-3 bg-red-900/30 rounded-lg text-red-300 text-sm">
                        Error en traducción: {error}
                    </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={translateContent}
                            disabled={translating}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${translatedExplanation
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-cyan-600 hover:bg-cyan-700'
                                } ${translating ? 'opacity-80' : ''}`}
                            aria-label={translatedExplanation ? 'Mostrar texto original' : 'Traducir a español'}
                        >
                            {translating ? <FaSpinner className="animate-spin" /> : <FaLanguage />}
                            {translating ? 'Traduciendo...' : translatedExplanation ? 'Mostrar original' : 'Traducir a español'}
                        </button>

                        {!speaking ? (
                            <button
                                onClick={speakContent}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-all"
                            >
                                🎧 Leer información
                            </button>
                        ) : (
                            <button
                                onClick={stopSpeaking}
                                className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 transition-all"
                            >
                                🔇 Detener lectura
                            </button>
                        )}
                    </div>

                    {current.copyright && (
                        <div className="text-sm text-gray-400">
                            <span className="text-gray-500">Créditos: </span>
                            <span className="text-cyan-300">{current.copyright}</span>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
