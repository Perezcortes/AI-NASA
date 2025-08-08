'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { Loader } from '../components/ui/loader';
import { ErrorMessage } from '../components/ui/error-message';
import { Carousel } from '../components/ui/carousel';
import { FaSearch, FaMicrophone, FaRobot, FaRocket, FaMeteor, FaNewspaper } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import type { ApodResponse } from './types/nasa';
import Link from "next/link";
import { useAssemblyTranscription } from '../hooks/useAssemblyTranscription';

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
    href: "/noticias"
  }
];

const KEYWORDS = {
  planets: ['mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno'],
};

const PLANETAS = ['mercurio', 'venus', 'tierra', 'marte', 'jupiter', 'saturno', 'urano', 'neptuno'];

// Schema.org structured data for better SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Explorando el Universo - NASA AI Explorer",
  "description": "Descubre los secretos del cosmos con inteligencia artificial y datos de la NASA. Explora planetas, asteroides y las últimas noticias espaciales.",
  "url": "https://ai-nasa.vercel.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ai-nasa.vercel.app/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NASA AI Explorer",
    "logo": {
      "@type": "ImageObject",
      "url": "https://ai-nasa.vercel.app/logo.png"
    }
  },
  "sameAs": [
    "https://www.nasa.gov"
  ]
};

export default function HomePage() {
  const router = useRouter();
  const [data, setData] = useState<ApodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stars, setStars] = useState<
    { width: number; height: number; top: number; left: number; opacity: number; delay: number }[]
  >([]);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
    action?: () => void;
  } | null>(null);
  
  const searchRef = useRef<HTMLInputElement>(null);

  const API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';

  const { transcript, startRecording, stopRecording, isRecording, status, error } = useAssemblyTranscription();

  function handleSearch(query: string) {
    const texto = query.toLowerCase();
    const contienePalabraPlaneta = texto.includes('planeta');
    const planetaDetectado = KEYWORDS.planets.find((p) => texto.includes(p));
    const contieneAsteroides = texto.includes('asteroide');

    let destino: string | null = null;

    if (contienePalabraPlaneta && planetaDetectado) {
      destino = `/planets/${planetaDetectado}`;
    } else if (contienePalabraPlaneta) {
      destino = `/planets`;
    } else if (planetaDetectado) {
      destino = `/planets/${planetaDetectado}`;
    } else if (contieneAsteroides) {
      destino = `/asteroids`;
    }

    if (destino) {
      router.push(destino);
    } else {
      setModalContent({
        title: "Búsqueda no encontrada",
        message: 'No se encontró información sobre tu búsqueda. Intenta con términos como "planeta marte" o "asteroides".',
        action: () => setShowModal(false)
      });
      setShowModal(true);
      setSearchQuery('');
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  useEffect(() => {
    if (transcript) {
      setSearchQuery(transcript);
      searchRef.current?.focus();
      handleSearch(transcript);
    }
  }, [transcript, router]);

  // Detectar y redirigir cuando se detecta una transcripción
  useEffect(() => {
    if (transcript) {
      const texto = transcript.toLowerCase();

      setSearchQuery(transcript);
      searchRef.current?.focus();

      const contieneAsteroides = texto.includes('asteroide');
      const contienePalabraPlaneta = texto.includes('planeta');
      const planetaDetectado = PLANETAS.find((p) => texto.includes(p));

      if (contienePalabraPlaneta && planetaDetectado) {
        router.push(`/planets/${planetaDetectado}`);
      } else if (contienePalabraPlaneta) {
        router.push(`/planets`);
      } else if (planetaDetectado) {
        router.push(`/planets/${planetaDetectado}`);
      } else if (contieneAsteroides) {
        router.push(`/asteroids`);
      }
    }
  }, [transcript, router]);

  useEffect(() => {
    const fetchApodImages = async () => {
      try {
        setLoading(true);
        setFetchError(null);

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
        setFetchError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchApodImages();
  }, []);

  useEffect(() => {
    const generateStars = () => {
      return [...Array(100)].map(() => ({
        width: Math.random() * 3 + 1,
        height: Math.random() * 3 + 1,
        top: Math.random() * 100,
        left: Math.random() * 100,
        opacity: Math.random() * 0.7 + 0.1,
        delay: Math.random() * 10,
      }));
    };
    setStars(generateStars());
  }, []);

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>Explorando el Universo - NASA AI Explorer | Planetas, Asteroides y Noticias Espaciales</title>
        <meta name="title" content="Explorando el Universo - NASA AI Explorer | Planetas, Asteroides y Noticias Espaciales" />
        <meta name="description" content="Descubre los secretos del cosmos con inteligencia artificial y datos oficiales de la NASA. Explora planetas del sistema solar, monitorea asteroides cercanos y mantente al día con las últimas noticias espaciales." />
        <meta name="keywords" content="NASA, espacio, planetas, sistema solar, asteroides, astronomía, cosmos, universo, inteligencia artificial, exploración espacial, ciencia, marte, jupiter, saturno, tierra, venus, mercurio, urano, neptuno" />
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="language" content="Spanish" />
        <meta name="author" content="NASA AI Explorer" />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ai-nasa.vercel.app/" />
        <meta property="og:title" content="Explorando el Universo - NASA AI Explorer" />
        <meta property="og:description" content="Descubre los secretos del cosmos con inteligencia artificial y datos oficiales de la NASA. Explora planetas, asteroides y noticias espaciales." />
        <meta property="og:image" content="https://ai-nasa.vercel.app/og-image.jpg" />
        <meta property="og:image:alt" content="Exploración espacial con inteligencia artificial" />
        <meta property="og:site_name" content="NASA AI Explorer" />
        <meta property="og:locale" content="es_ES" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://ai-nasa.vercel.app/" />
        <meta property="twitter:title" content="Explorando el Universo - NASA AI Explorer" />
        <meta property="twitter:description" content="Descubre los secretos del cosmos con inteligencia artificial y datos oficiales de la NASA." />
        <meta property="twitter:image" content="https://ai-nasa.vercel.app/og-image.jpg" />
        <meta property="twitter:creator" content="@nasaexplorer" />
        
        {/* Favicon */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://ai-nasa.vercel.app/" />
        
        {/* Alternate languages */}
        <link rel="alternate" hrefLang="es" href="https://ai-nasa.vercel.app/" />
        <link rel="alternate" hrefLang="en" href="https://ai-nasa.vercel.app/en/" />
        
        {/* Preconnect for performance */}
        <link rel="preconnect" href="https://api.nasa.gov" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Schema.org structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        
        {/* Additional SEO tags */}
        <meta name="theme-color" content="#0891b2" />
        <meta name="msapplication-TileColor" content="#0891b2" />
        <meta name="application-name" content="NASA AI Explorer" />
        <meta name="apple-mobile-web-app-title" content="NASA Explorer" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//api.nasa.gov" />
        <link rel="dns-prefetch" href="//apod.nasa.gov" />
      </Head>

      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">

        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-twinkle"
              style={{
                width: `${star.width}px`,
                height: `${star.height}px`,
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
                animationDelay: `${star.delay}s`,
              }}
            />
          ))}
        </div>

        <main className="relative z-10">
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
                Descubre los secretos del cosmos con inteligencia artificial y los datos más recientes de la NASA. 
                Explora planetas del sistema solar, monitorea asteroides cercanos a la Tierra y mantente actualizado 
                con las últimas noticias de exploración espacial.
              </p>
            </motion.div>

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
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar planetas, asteroides o noticias espaciales..."
                  aria-label="Buscar información espacial"
                  className="w-full py-4 px-6 pr-16 rounded-full bg-gray-800 border border-gray-700 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30 text-white text-lg transition-all"
                />

                <div className="absolute right-2 flex space-x-2">
                  <button
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                    onMouseLeave={() => isRecording && stopRecording()}
                    onTouchStart={startRecording}
                    onTouchEnd={stopRecording}
                    className={`p-3 rounded-full transition-colors ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    title="Búsqueda por voz"
                    aria-label="Activar búsqueda por voz"
                    aria-pressed={isRecording}
                  >
                    <FaMicrophone className="text-white" />
                  </button>
                  <button
                    onClick={() => handleSearch(searchQuery)}
                    className="p-3 rounded-full bg-cyan-600 hover:bg-cyan-500 transition-colors"
                    title="Buscar"
                    aria-label="Ejecutar búsqueda"
                  >
                    <FaSearch className="text-white" />
                  </button>
                </div>
              </div>
              <AnimatePresence>
                {(status === 'listening' || status === 'processing' || status === 'done' || status === 'error') && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg p-4 shadow-lg"
                    role="status"
                    aria-live="polite"
                  >
                    <div className="flex items-center space-x-2 text-cyan-400">
                      {status === 'listening' && (
                        <>
                          <FaMicrophone className="animate-pulse" />
                          <span>Escuchando...</span>
                        </>
                      )}
                      {status === 'processing' && (
                        <>
                          <FaRocket className="animate-spin" />
                          <span>Procesando audio...</span>
                        </>
                      )}
                      {status === 'done' && (
                        <>
                          <FaSearch />
                          <span>Texto detectado: "{transcript}"</span>
                        </>
                      )}
                      {status === 'error' && (
                        <>
                          <FaSearch />
                          <span className="text-red-400">Error: {error}</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* Sección de características */}
          <section className="py-16 px-4 bg-gradient-to-b from-gray-800/50 to-gray-900/0" aria-labelledby="features-title">
            <div className="container mx-auto">
              <h2 id="features-title" className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Explora el Cosmos con NASA AI
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {FEATURES.map((feature, index) => (
                  <motion.article
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-cyan-400/30 transition-all"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="mb-4" aria-hidden="true">{feature.icon}</div>
                      <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-300 mb-4">{feature.description}</p>
                      <Link href={feature.href} aria-label={`Explorar ${feature.title}`}>
                        <button className="mt-4 px-4 py-2 text-sm rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all">
                          Explorar
                        </button>
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </div>
            </div>
          </section>

          {/* Sección de imágenes destacadas */}
          <section className="py-16 px-4" aria-labelledby="images-title">
            <div className="container mx-auto max-w-6xl">
              <h2 id="images-title" className="text-3xl md:text-4xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Imágenes Astronómicas del Día
              </h2>

              {loading && <Loader message="Cargando imágenes del cosmos..." />}
              {fetchError && <ErrorMessage message={fetchError} onRetry={() => location.reload()} />}

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
          <section className="py-16 px-4 bg-gradient-to-b from-gray-900/0 to-gray-800/50" aria-labelledby="ai-assistant-title">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 id="ai-assistant-title" className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Asistente de IA Espacial
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Pregunta a nuestro asistente inteligente sobre planetas, asteroides, misiones espaciales 
                y cualquier tema relacionado con la astronomía y exploración del cosmos
              </p>

              <div className="flex flex-wrap justify-center gap-4 mb-12" role="group" aria-label="Ejemplos de búsqueda">
                <button 
                  className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition-all"
                  onClick={() => handleSearch('planeta marte')}
                  aria-label="Buscar información sobre el planeta Marte"
                >
                  <FaRobot className="mr-2" />
                  <span>Planeta Marte</span>
                </button>
                <button 
                  className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 transition-all"
                  onClick={() => handleSearch('asteroides')}
                  aria-label="Buscar información sobre asteroides peligrosos"
                >
                  <FaRobot className="mr-2" />
                  <span>Asteroides peligrosos</span>
                </button>
                <button 
                  className="flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 transition-all"
                  onClick={() => router.push('/noticias')}
                  aria-label="Ver últimos descubrimientos espaciales"
                >
                  <FaRobot className="mr-2" />
                  <span>Últimos descubrimientos</span>
                </button>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 max-w-2xl mx-auto">
                <div className="flex items-center space-x-4">
                  <div className="bg-cyan-500/20 p-3 rounded-full">
                    <FaRobot className="text-cyan-400 text-2xl" aria-hidden="true" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-white">Asistente AI-NASA</h3>
                    <p className="text-gray-300">Presiona el botón de micrófono y pregúntame sobre el espacio</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Modal para mensajes */}
          <AnimatePresence>
            {showModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
                onClick={() => setShowModal(false)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 id="modal-title" className="text-2xl font-bold text-cyan-400 mb-4">{modalContent?.title}</h3>
                  <p className="text-gray-300 mb-6">{modalContent?.message}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all"
                      aria-label="Cerrar modal"
                    >
                      Entendido
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </>
  );
}
