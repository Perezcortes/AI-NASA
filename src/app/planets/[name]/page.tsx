'use client';

import { useState, useEffect } from "react";
import { use } from 'react';
import { FaTemperatureHigh, FaWeight, FaMoon, FaSun, FaLanguage, FaSpinner, FaVolumeUp, FaStop } from "react-icons/fa";
import { GiOrbital } from "react-icons/gi";
import { MdExplore } from "react-icons/md";
import PlanetModel from "../../../components/PlanetModel";
import { planets } from "../../data/planets";
import VoiceAssistant from '../../../components/VoiceAssistant';

async function getVideos(planet: string) {
  const planetNames: Record<string, string> = {
    'mercurio': 'mercury',
    'venus': 'venus',
    'tierra': 'earth',
    'marte': 'mars',
    'jupiter': 'jupiter',
    'saturno': 'saturn',
    'urano': 'uranus',
    'neptuno': 'neptune'
  };

  const englishName = planetNames[planet.toLowerCase()] || planet;

  try {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${englishName}+planet&media_type=video`
    );
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();
    const items = data.collection?.items?.filter((item: any) => item.data?.[0]?.nasa_id).slice(0, 2) || [];

    const videosWithMp4 = await Promise.all(
      items.map(async (item: any) => {
        try {
          const nasa_id = item.data[0].nasa_id;
          const mp4Url = await getVideoMp4Url(nasa_id);
          return { ...item, mp4Url };
        } catch (error) {
          console.error(`Error processing video ${item.data[0].nasa_id}:`, error);
          return { ...item, mp4Url: null };
        }
      })
    );

    return videosWithMp4.filter(video => video.data[0].title && (video.mp4Url || video.data[0].nasa_id));
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

async function getVideoMp4Url(nasa_id: string): Promise<string | null> {
  try {
    const res = await fetch(`https://images-api.nasa.gov/asset/${nasa_id}`);
    const data = await res.json();
    const mp4 = data.collection.items.find((item: any) =>
      item.href.endsWith(".mp4")
    );
    return mp4 ? mp4.href : null;
  } catch {
    return null;
  }
}

async function getImages(planet: string) {
  const planetNames: Record<string, string> = {
    'mercurio': 'mercury',
    'venus': 'venus',
    'tierra': 'earth',
    'marte': 'mars',
    'jupiter': 'jupiter',
    'saturno': 'saturn',
    'urano': 'uranus',
    'neptuno': 'neptune'
  };

  const englishName = planetNames[planet.toLowerCase()] || planet;

  try {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${englishName}+planet&media_type=image`
    );
    if (!res.ok) throw new Error('Network response was not ok');

    const data = await res.json();
    return data.collection?.items
      ?.filter((item: any) => item.links?.[0]?.href && item.data?.[0]?.title)
      .slice(0, 9) || [];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

function LocalVoiceAssistant({ planetData }: { planetData: any }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setSpeechSynthesis(window.speechSynthesis);

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

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'es-ES';

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
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={speak}
        className={`p-4 rounded-full shadow-lg transition-all flex items-center gap-2 ${
          isSpeaking 
            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
            : 'bg-cyan-600 hover:bg-cyan-700 text-white'
        }`}
        aria-label={isSpeaking ? 'Detener narración' : 'Escuchar información del planeta'}
      >
        {isSpeaking ? (
          <>
            <FaStop className="text-xl" />
            <span className="hidden sm:inline">Detener</span>
          </>
        ) : (
          <>
            <FaVolumeUp className="text-xl" />
            <span className="hidden sm:inline">Escuchar</span>
          </>
        )}
      </button>
    </div>
  );
}

export default function PlanetDetail({ params }: { params: Promise<{ name?: string }> }) {
  const resolvedParams = use(params);
  const name = resolvedParams.name?.toLowerCase() || '';
  
  const [videos, setVideos] = useState<any[]>([]);
  const [images, setImages] = useState<any[]>([]);
  const [translations, setTranslations] = useState<Record<string, {title: string, description: string}>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!name) {
      setError("Nombre de planeta inválido");
      setLoading(false);
      return;
    }

    const planet = planets.find((p) => p.name.toLowerCase() === name);

    if (!planet) {
      setError("Planeta no encontrado");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [videoData, imageData] = await Promise.all([
          getVideos(planet.name),
          getImages(planet.name)
        ]);
        
        setVideos(videoData);
        setImages(imageData);
        
        if (typeof window !== 'undefined') {
          const saved = localStorage.getItem('videoTranslations');
          if (saved) setTranslations(JSON.parse(saved));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error al cargar los datos del planeta");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [name]);

  const translateVideoContent = async (videoId: string, title: string, description: string) => {
    if (translations[videoId]) {
      const newTranslations = {...translations};
      delete newTranslations[videoId];
      setTranslations(newTranslations);
      localStorage.setItem('videoTranslations', JSON.stringify(newTranslations));
      return;
    }

    setTranslations(prev => ({
      ...prev,
      [videoId]: null as any
    }));

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          explanation: description, 
          to: 'es' 
        }),
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      if (!data.translations) throw new Error('Formato de respuesta inválido');

      const newTranslations = {
        ...translations,
        [videoId]: {
          title: data.translations.title || `📌 ${title} (Traducido)`,
          description: data.translations.explanation || description
        }
      };

      setTranslations(newTranslations);
      localStorage.setItem('videoTranslations', JSON.stringify(newTranslations));
    } catch (err) {
      console.error('Error en traducción:', err);
      const newTranslations = {
        ...translations,
        [videoId]: {
          title: `📌 ${title} (Traducido)`,
          description: `[Error en traducción - Mostrando parcialmente] ${description.substring(0, 200)}...`
        }
      };
      setTranslations(newTranslations);
      localStorage.setItem('videoTranslations', JSON.stringify(newTranslations));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <FaSpinner className="animate-spin text-cyan-400 text-4xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const planet = planets.find((p) => p.name.toLowerCase() === name);

  if (!planet) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-red-500 text-xl">Planeta no encontrado</div>
      </div>
    );
  }

  const planetData = {
    name: planet.name,
    description: planet.description,
    distanceFromSun: planet.distanceFromSun,
    gravity: planet.gravity,
    avgTemperature: planet.avgTemperature,
    orbitalPeriod: planet.orbitalPeriod,
    composition: planet.composition,
    notableFeatures: planet.notableFeatures,
    discovery: planet.discovery,
    type: planet.type
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <PlanetModel planetName={planet.name} />
        </div>

        <div className="container mx-auto px-6 py-24 relative z-20">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-cyan-900/30 text-cyan-400">
              {planet.type === "Terrestre" ? "Planeta Terrestre" :
                planet.type === "Gaseoso" ? "Gigante Gaseoso" : "Gigante Helado"}
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {planet.name}
            </h1>
            <p className="text-xl text-gray-300 mb-8">{planet.description}</p>
          </div>
        </div>
      </div>

      {/* Planet Facts */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <MdExplore className="text-cyan-400" />
              <span>Datos Clave</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaSun />
                  <h3 className="font-medium">Distancia al Sol</h3>
                </div>
                <p>{planet.distanceFromSun.km} ({planet.distanceFromSun.au})</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaWeight />
                  <h3 className="font-medium">Gravedad</h3>
                </div>
                <p>{planet.gravity}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaTemperatureHigh />
                  <h3 className="font-medium">Temperatura Promedio</h3>
                </div>
                <p>{planet.avgTemperature}</p>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <GiOrbital />
                  <h3 className="font-medium">Periodo Orbital</h3>
                </div>
                <p>{planet.orbitalPeriod}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Composición</h3>
              <p className="text-gray-300">{planet.composition}</p>
            </div>

            {planet.notableFeatures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Características Notables</h3>
                <ul className="space-y-2">
                  {planet.notableFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {planet.discovery && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Descubrimiento</h3>
                <p className="text-gray-300">{planet.discovery}</p>
              </div>
            )}
          </div>

          {/* Right Column - Media */}
          <div>
            {/* Videos */}
            {videos.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Videos</h2>
                <div className="grid gap-4">
                  {videos.map((video: any, i: number) => {
                    const videoId = video.data[0].nasa_id;
                    const isTranslated = translations[videoId] && typeof translations[videoId] === 'object';
                    const isTranslating = translations[videoId] === null;
                    const title = isTranslated ? translations[videoId].title : video.data[0].title;
                    const description = isTranslated ? translations[videoId].description : video.data[0].description;

                    return (
                      <div key={i} className="bg-black rounded-xl overflow-hidden border border-gray-700/50">
                        {video.mp4Url ? (
                          <video controls className="w-full aspect-video">
                            <source src={video.mp4Url} type="video/mp4" />
                            Tu navegador no soporta el video.
                          </video>
                        ) : (
                          <a
                            href={`https://images.nasa.gov/details-${videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full aspect-video bg-gray-900 flex items-center justify-center text-cyan-400"
                          >
                            Ver video en NASA
                          </a>
                        )}
                        
                        <div className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                            <h3 className="font-medium flex-1">
                              {isTranslated && '📌 '}{title}
                            </h3>
                            <button
                              onClick={() => translateVideoContent(
                                videoId,
                                video.data[0].title,
                                video.data[0].description
                              )}
                              className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm ${isTranslated
                                ? 'bg-green-600 hover:bg-green-700'
                                : 'bg-cyan-600 hover:bg-cyan-700'
                                } transition-colors ${isTranslating ? 'opacity-80' : ''}`}
                              disabled={isTranslating}
                            >
                              {isTranslating ? (
                                <>
                                  <FaSpinner className="animate-spin" />
                                  <span>Traduciendo...</span>
                                </>
                              ) : isTranslated ? (
                                <>
                                  <FaLanguage />
                                  <span>Mostrar original</span>
                                </>
                              ) : (
                                <>
                                  <FaLanguage />
                                  <span>Traducir a español</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className={`text-sm mt-2 whitespace-pre-line ${isTranslated ? 'text-gray-300 italic' : 'text-gray-400'
                            }`}>
                            {description}
                          </p>

                          {isTranslating && (
                            <div className="mt-2 text-xs text-cyan-400 flex items-center">
                              <FaSpinner className="animate-spin mr-2" />
                              Traduciendo...
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Images */}
            {images.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Galería</h2>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img: any, i: number) => (
                    <a
                      key={i}
                      href={img.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                        <img
                          src={img.links[0].href.replace("~thumb", "~large")}
                          alt={img.data[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-white text-xs truncate w-full">
                            {img.data[0].title}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Voice Assistant */}
            <LocalVoiceAssistant planetData={planetData} />
    </div>
  );
}