'use client';

import { useState, useEffect, useRef } from 'react';
import { Loader } from '../components/ui/loader';
import { ErrorMessage } from '../components/ui/error-message';
import { Carousel } from '../components/ui/carousel';
import { FaSearch, FaMicrophone, FaRobot, FaRocket, FaMeteor, FaNewspaper } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApodResponse } from './types/nasa';
import Link from "next/link";

const FEATURES = [
  {
    icon: <FaRocket className="text-4xl text-cyan-400" />,
    title: "Exploración Planetaria",
    description: "Descubre información detallada sobre todos los planetas de nuestro sistema solar",
    href: "/planets"
  },
  {
    icon: <FaMeteor className="text-4xl text-purple-400" />,
    title: "Asteroides Cercanos",
    description: "Monitorea los asteroides que se acercan a la Tierra en tiempo real",
    href: "/asteroids"
  },
  {
    icon: <FaNewspaper className="text-4xl text-yellow-400" />,
    title: "Últimas Noticias",
    description: "Mantente al día con los descubrimientos más recientes de la NASA",
    href: "/news"
  }
];

export default function HomePage() {
  const [data, setData] = useState<ApodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const API_KEY = process.env.NASA_API_KEY || 'DEMO_KEY';

  useEffect(() => {
    const fetchApodImages = async () => {
      try {
        setLoading(true);
        setError(null);

        const cached = localStorage.getItem('apod_images');
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=7`);
        if (!res.ok) throw new Error('Error al obtener datos de la NASA');
        const result = await res.json();

        const onlyImages = result.filter((item: ApodResponse) => item.media_type === 'image');
        setData(onlyImages);
        localStorage.setItem('apod_images', JSON.stringify(onlyImages));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchApodImages();
  }, []);

  const handleVoiceSearch = () => {
    // Esto será implementado luego
    setIsListening(true);
    setTimeout(() => {
      setSearchQuery('Lluvia de estrellas en la Tierra');
      setIsListening(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
      {/* Efecto de estrellas en el fondo */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.1,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              Explorando el Universo
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10">
              Descubre los secretos del cosmos con inteligencia artificial y los datos más recientes de la NASA
            </p>
          </motion.div>

          {/* Barra de búsqueda */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative flex items-center">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar en el cosmos..."
                className="w-full py-4 px-6 pr-16 rounded-full bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 text-white text-lg transition-all"
              />
              <div className="absolute right-2 flex space-x-2">
                <button
                  onClick={handleVoiceSearch}
                  className={`p-3 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'} transition-colors`}
                  title="Búsqueda por voz"
                >
                  <FaMicrophone className="text-white" />
                </button>
                <button className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors" title="Buscar">
                  <FaSearch className="text-white" />
                </button>
              </div>
            </div>
            <AnimatePresence>
              {isListening && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg p-4 shadow-lg"
                >
                  <div className="flex items-center space-x-2 text-cyan-400">
                    <FaMicrophone className="animate-pulse" />
                    <span>Escuchando...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

        {/* Sección de características */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-800/50 to-gray-900/0">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Explora el Cosmos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {FEATURES.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                    <Link href={feature.href}>
                      <button className="mt-4 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all">
                        Explorar
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Sección de imágenes destacadas */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Imágenes del Día
            </h2>

            {loading && <Loader message="Cargando imágenes del cosmos..." />}
            {error && <ErrorMessage message={error} onRetry={() => location.reload()} />}

            {!loading && data.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Carousel images={data} />
              </motion.div>
            )}
          </div>
        </section>

        {/* Sección de asistente IA */}
        <section className="py-16 px-4 bg-gradient-to-b from-gray-900/0 to-gray-800/50">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Asistente de IA Espacial
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Pregúntale a nuestro asistente inteligente sobre cualquier tema relacionado con el espacio
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <button className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all">
                <FaRobot className="mr-2" />
                <span>Planeta Marte</span>
              </button>
              <button className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all">
                <FaRobot className="mr-2" />
                <span>Asteroides peligrosos</span>
              </button>
              <button className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 transition-all">
                <FaRobot className="mr-2" />
                <span>Últimos descubrimientos</span>
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto">
              <div className="flex items-center space-x-4">
                <div className="bg-cyan-500/20 p-3 rounded-full">
                  <FaRobot className="text-cyan-400 text-2xl" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-white">Asistente AI-NASA</h3>
                  <p className="text-gray-300">Presiona el botón de micrófono y pregúntame sobre el espacio</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}