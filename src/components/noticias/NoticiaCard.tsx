'use client';

import { useState, useRef, useEffect } from 'react';
import { FaLanguage, FaSpinner, FaVolumeUp, FaVolumeMute, FaExternalLinkAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/store';
import { addToReadLater, removeFromReadLater } from '@/store/slices/readLaterSlice';

const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;

type Noticia = {
  title: string;
  description: string;
  imageUrl: string;
  nasaLink: string;
};

export default function NoticiaCard({ title, description, imageUrl, nasaLink }: Noticia) {
  const dispatch = useDispatch<AppDispatch>();
  const readLaterItems = useSelector((state: RootState) => state.readLater.items);

  const isInReadLater = readLaterItems.some(item => item.nasaLink === nasaLink);

  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [translating, setTranslating] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [imageError, setImageError] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (synth && speaking) {
        synth.cancel();
      }
    };
  }, [speaking]);

  const speakContent = () => {
    if (!synth) return;

    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance();
    utteranceRef.current = utterance;

    utterance.text = `${translatedTitle || title}. ${translatedDesc || description.substring(0, 200)}`;
    utterance.lang = translatedDesc ? "es-ES" : "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    synth.cancel();
    synth.speak(utterance);
  };

  const translateContent = async () => {
    if (translatedDesc) {
      setTranslatedTitle(null);
      setTranslatedDesc(null);
      return;
    }

    setTranslating(true);

    try {
      const res = await fetch('/api/translate/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          explanation: description.substring(0, 500),
          to: 'es',
        }),
      });

      const data = await res.json();

      if (!data.translations) {
        throw new Error('Traducción fallida');
      }

      setTranslatedTitle(`${data.translations.title}`);
      setTranslatedDesc(data.translations.explanation);
    } catch (err) {
      console.error("Error translating:", err);
      setTranslatedTitle(`📌 ${title}`);
      setTranslatedDesc(`[Error de traducción] ${description.substring(0, 150)}...`);
    } finally {
      setTranslating(false);
    }
  };

  const toggleReadLater = () => {
    if (isInReadLater) {
      dispatch(removeFromReadLater(nasaLink));
    } else {
      dispatch(addToReadLater({ title, description, imageUrl, nasaLink }));
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg hover:shadow-cyan-500/30 h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageError ? '/no-image.png' : imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent" />
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {translatedTitle || title}
        </h2>

        <p className="text-sm text-gray-400 mb-4 line-clamp-3 flex-grow">
          {translatedDesc || description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          <button
            onClick={translateContent}
            disabled={translating}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${translatedDesc
              ? 'bg-green-600/90 hover:bg-green-600'
              : 'bg-cyan-600/90 hover:bg-cyan-600'
              } transition-colors`}
          >
            {translating ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaLanguage />
            )}
            {translating ? 'Traduciendo...' : translatedDesc ? 'Original' : 'Traducir'}
          </button>

          <button
            onClick={speakContent}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${speaking
              ? 'bg-red-600/90 hover:bg-red-600'
              : 'bg-purple-600/90 hover:bg-purple-600'
              } transition-colors`}
          >
            {speaking ? (
              <FaVolumeMute />
            ) : (
              <FaVolumeUp />
            )}
            {speaking ? 'Detener' : 'Escuchar'}
          </button>

          {/* Botón "leer más tarde" */}
          <button
            onClick={toggleReadLater}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${isInReadLater
              ? 'bg-red-600/90 hover:bg-red-600'
              : 'bg-gray-600/90 hover:bg-gray-700'
              } transition-colors`}
            aria-label={isInReadLater ? 'Quitar de leer más tarde' : 'Agregar a leer más tarde'}
          >
            {isInReadLater ? <FaHeart /> : <FaRegHeart />}
            {isInReadLater ? 'Guardado' : 'Leer más tarde'}
          </button>

          <a
            href={nasaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-1 px-3 py-2 rounded-lg text-sm bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <FaExternalLinkAlt size={12} /> Ver más
          </a>
        </div>
      </div>
    </motion.div>
  );
}
