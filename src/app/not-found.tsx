'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome, FaRandom } from 'react-icons/fa';

const NotFoundPage = () => {
  const [isFloating, setIsFloating] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [stars, setStars] = useState<Array<{
    size: string;
    top: string;
    left: string;
    opacity: number;
    delay: string;
    color: string;
    shadow: string;
  }>>([]);
  
  const [constellations, setConstellations] = useState<Array<{
    top: string;
    left: string;
    delay: string;
    blur: string;
    stars: Array<{
      size: string;
      rotation: number;
      distance: string;
    }>;
  }>>([]);

  useEffect(() => {
    setIsClient(true);
    document.title = "404 - Dimensión Desconocida";
    setIsFloating(true);

    // Generar estrellas
    setStars(Array.from({ length: 50 }, () => ({
      size: `${Math.random() * 5 + 1}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      opacity: Math.random() * 0.7 + 0.1,
      delay: `${Math.random() * 10}s`,
      color: `hsl(${Math.random() * 60 + 200}, 100%, 70%)`,
      shadow: `0 0 ${Math.random() * 20 + 5}px ${Math.random() * 5 + 2}px currentColor`
    })));

    // Generar constelaciones
    setConstellations(Array.from({ length: 15 }, () => {
      const size = Math.random() * 6 + 3;
      return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 15}s`,
        blur: `${Math.random() * 2 + 0.5}px`,
        stars: Array.from({ length: 3 + Math.floor(Math.random() * 3) }, () => ({
          size: `${size * (0.5 + Math.random() * 0.5)}px`,
          rotation: 120 + Math.random() * 60,
          distance: `${size * 2}px`,
        }))
      };
    }));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black overflow-hidden relative">
      {/* Fondo surrealista */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Galaxias */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-r from-purple-500 to-transparent blur-3xl"></div>
          <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-gradient-to-b from-blue-400 to-transparent blur-3xl"></div>
        </div>
        
        {/* Estrellas surrealistas - Solo en cliente */}
        {isClient && stars.map((star, i) => (
          <div 
            key={i}
            className="absolute rounded-full animate-pulse"
            style={{
              width: star.size,
              height: star.size,
              top: star.top,
              left: star.left,
              opacity: star.opacity,
              animationDelay: star.delay,
              backgroundColor: star.color,
              boxShadow: star.shadow
            }}
          ></div>
        ))}
      </div>
      
      {/* Navegación flotante */}
      <nav className={`relative z-50 p-6 flex justify-between items-center transition-all duration-1000 ${isFloating ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        <div className="text-white text-2xl font-bold flex items-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
            Dimensión 404
          </span>
        </div>
        <Link 
          href="/" 
          className="px-6 py-2 rounded-full border-2 border-cyan-300 text-cyan-300 hover:bg-cyan-300 hover:text-purple-900 transition-all duration-300 flex items-center group"
        >
          <FaHome className="mr-2 group-hover:scale-110 transition-transform" />
          <span>Regresar a la Realidad</span>
        </Link>
      </nav>
      
      {/* Contenido principal */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center transition-all duration-1000 delay-200 ${isFloating ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
        <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 mb-4">
          404
        </h1>
        <h2 className="text-4xl text-cyan-200 mb-8 font-light tracking-wider">
          Has cruzado un portal dimensional
        </h2>
        <p className="text-cyan-100 max-w-md mb-8 text-lg leading-relaxed">
          La realidad que buscas se ha desvanecido en el multiverso. 
          <br />¿Quizás fue absorbida por un agujero de gusano?
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link 
            href="/" 
            className="px-8 py-3 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 text-gray-900 font-bold hover:from-cyan-300 hover:to-purple-400 transition-all duration-300 shadow-lg hover:shadow-cyan-300/30 flex items-center justify-center"
          >
            <FaHome className="mr-2" />
            Reconstruir Realidad
          </Link>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full border-2 border-purple-400 text-purple-300 hover:bg-purple-900/50 transition-all duration-300 flex items-center justify-center"
          >
            <FaRandom className="mr-2" />
            Intentar Otra Dimensión
          </button>
        </div>
      </div>
      
      {/* Elementos surrealistas - Solo en cliente */}
      {isClient && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Planeta psicodélico */}
          <div className="absolute left-[10%] top-[20%] w-64 h-64 rounded-full animate-float">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 opacity-70 blur-md"></div>
              <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#00ccff_0deg,#ff00aa_180deg,#00ffcc_360deg)] opacity-60 animate-spin-slow"></div>
              <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm border border-cyan-300/50"></div>
            </div>
          </div>
          
          {/* Pirámide flotante */}
          <div className="absolute right-[15%] top-[30%] w-40 h-40 animate-float-delay">
            <div className="relative w-full h-full">
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[80px] border-r-[80px] border-b-[140px] border-l-transparent border-r-transparent border-b-cyan-400/30 border-b-opacity-30"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[60px] border-r-[60px] border-b-[100px] border-l-transparent border-r-transparent border-b-purple-500/40"></div>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-cyan-300/50"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white/80 shadow-lg shadow-cyan-300/50"></div>
            </div>
          </div>
          
          {/* Astronauta surrealista */}
          <div className="absolute right-[20%] top-[50%] w-48 h-48 animate-astronaut-float">
            <div className="relative w-full h-full">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-32 bg-white/10 backdrop-blur-sm rounded-t-full border border-cyan-300/30"></div>
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 w-28 h-28 bg-white/20 backdrop-blur-sm rounded-full border border-cyan-300/30"></div>
              <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gray-900/80 rounded-full"></div>
              <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-cyan-300 to-blue-400 rounded-full shadow-lg shadow-cyan-300/30"></div>
              <div className="absolute top-32 left-1/2 transform -translate-x-1/2 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full border border-cyan-300/30"></div>
              <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-white/10 backdrop-blur-sm rounded-full border border-cyan-300/30"></div>
            </div>
          </div>
          
          {/* Portal dimensional */}
          <div className="absolute left-[5%] bottom-[15%] w-64 h-64 animate-portal-pulse">
            <div className="relative w-full h-full">
              <div className="absolute inset-0 rounded-full border-4 border-dashed border-purple-400/30 animate-spin-slow"></div>
              <div className="absolute inset-4 rounded-full border-4 border-dashed border-cyan-300/30 animate-spin-slow-reverse"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-purple-600/20 to-cyan-500/20 backdrop-blur-sm animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 shadow-lg shadow-cyan-300/50 animate-ping-slow"></div>
            </div>
          </div>
          
          {/* Constelaciones */}
          {constellations.map((constellation, i) => (
            <div 
              key={`constellation-${i}`}
              className="absolute flex items-center justify-center animate-twinkle"
              style={{
                top: constellation.top,
                left: constellation.left,
                animationDelay: constellation.delay,
                filter: `blur(${constellation.blur})`
              }}
            >
              {constellation.stars.map((star, j) => (
                <div
                  key={`star-${i}-${j}`}
                  className="absolute rounded-full bg-white"
                  style={{
                    width: star.size,
                    height: star.size,
                    transform: `rotate(${j * star.rotation}deg) translate(${star.distance})`,
                    opacity: 0.7
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      )}
      
      {/* Animaciones CSS */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(2deg); }
          50% { transform: translateY(10px) rotate(-2deg); }
          75% { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes float-delay {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }
        @keyframes astronaut-float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(5deg); }
          50% { transform: translate(5px, 5px) rotate(-3deg); }
          75% { transform: translate(-5px, 10px) rotate(2deg); }
        }
        @keyframes portal-pulse {
          0%, 100% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ping-slow {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          70% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-float { animation: float 12s ease-in-out infinite; }
        .animate-float-delay { animation: float-delay 15s ease-in-out infinite 2s; }
        .animate-astronaut-float { animation: astronaut-float 18s ease-in-out infinite; }
        .animate-portal-pulse { animation: portal-pulse 8s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 60s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 80s linear infinite; }
        .animate-ping-slow { animation: ping-slow 5s ease-out infinite; }
        .animate-twinkle { animation: twinkle 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default NotFoundPage;