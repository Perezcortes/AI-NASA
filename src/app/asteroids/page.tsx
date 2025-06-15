'use client';

import { useState, useEffect } from 'react';
import { FaSearch, FaRocket, FaExclamationTriangle, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function AsteroidsPage() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [asteroids, setAsteroids] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const API_KEY = 'DEMO_KEY'; // Cambia esto por tu clave de la NASA

  useEffect(() => {
    const fetchAsteroids = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.nasa.gov/neo/rest/v1/feed?start_date=${date}&end_date=${date}&api_key=${API_KEY}`
        );
        if (!res.ok) throw new Error('Error al obtener datos de asteroides');
        const data = await res.json();
        const nearEarthObjects = data.near_earth_objects[date] || [];
        setAsteroids(nearEarthObjects);
      } catch (err: any) {
        setError(err.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchAsteroids();
  }, [date]);

  const filteredAsteroids = asteroids.filter(asteroid =>
    asteroid.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMostDangerousAsteroid = () => {
    const dangerousAsteroids = asteroids.filter(a => a.is_potentially_hazardous_asteroid);
    if (dangerousAsteroids.length === 0) return null;
    
    return dangerousAsteroids.sort((a, b) => {
      const sizeA = a.estimated_diameter.meters.estimated_diameter_max;
      const sizeB = b.estimated_diameter.meters.estimated_diameter_max;
      const speedA = parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour);
      const speedB = parseFloat(b.close_approach_data[0].relative_velocity.kilometers_per_hour);
      return (sizeB + speedB) - (sizeA + speedA);
    })[0];
  };

  const speakAsteroidInfo = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const mostDangerous = getMostDangerousAsteroid();
    
    if (!mostDangerous) {
      const msg = new SpeechSynthesisUtterance("No se encontraron asteroides potencialmente peligrosos en esta fecha.");
      window.speechSynthesis.speak(msg);
      return;
    }

    const asteroid = mostDangerous;
    const size = asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1);
    const speed = parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2);
    const distance = parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString();
    const date = new Date(asteroid.close_approach_data[0].close_approach_date).toLocaleDateString();

    const text = `
      Asteroide potencialmente peligroso: ${asteroid.name.replace(/[()]/g, '')}.
      Tamaño estimado: ${size} metros.
      Velocidad de aproximación: ${speed} kilómetros por hora.
      Distancia mínima: ${distance} kilómetros.
      Fecha de máximo acercamiento: ${date}.
    `;

    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'es-ES';
    msg.rate = 0.9;
    
    msg.onend = () => setIsSpeaking(false);
    
    setIsSpeaking(true);
    window.speechSynthesis.speak(msg);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Rastreador de Asteroides
            </h1>
            <p className="text-gray-400 mt-2">
              Monitorea objetos cercanos a la Tierra
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Buscar asteroides..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="relative flex items-center bg-gray-800/50 border border-gray-700 rounded-full px-4">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <input
                type="date"
                value={date}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="bg-transparent py-3 text-white focus:outline-none"
              />
            </div>
          </div>
        </header>

        {/* Estado de carga y errores */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full"
            />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center mb-8">
            <FaExclamationTriangle className="mx-auto text-red-400 text-3xl mb-3" />
            <p className="text-red-300 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        {/* Estadísticas */}
        {!loading && !error && asteroids.length > 0 && (
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 mb-8 grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3">
              <p className="text-gray-400 text-sm">Total Asteroides</p>
              <p className="text-2xl font-bold text-white">{asteroids.length}</p>
            </div>
            <div className="text-center p-3">
              <p className="text-gray-400 text-sm">Potencialmente Peligrosos</p>
              <p className="text-2xl font-bold text-red-400">
                {asteroids.filter(a => a.is_potentially_hazardous_asteroid).length}
              </p>
            </div>
            <div className="text-center p-3">
              <p className="text-gray-400 text-sm">Velocidad Promedio</p>
              <p className="text-2xl font-bold text-cyan-300">
                {(
                  asteroids.reduce((sum, a) => sum + parseFloat(a.close_approach_data[0].relative_velocity.kilometers_per_hour), 0
                ) / asteroids.length).toFixed(2)} km/h
              </p>
            </div>
            <div className="text-center p-3">
              <p className="text-gray-400 text-sm">Tamaño Promedio</p>
              <p className="text-2xl font-bold text-yellow-300">
                {(
                  asteroids.reduce((sum, a) => {
                    const min = a.estimated_diameter.meters.estimated_diameter_min;
                    const max = a.estimated_diameter.meters.estimated_diameter_max;
                    return sum + (min + max) / 2;
                  }, 0) / asteroids.length
                ).toFixed(1)} m
              </p>
            </div>
            <div className="text-center p-3 flex flex-col items-center justify-center">
              <button
                onClick={speakAsteroidInfo}
                disabled={asteroids.filter(a => a.is_potentially_hazardous_asteroid).length === 0}
                className={`flex items-center justify-center px-4 py-2 rounded-md text-sm ${
                  isSpeaking 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : asteroids.filter(a => a.is_potentially_hazardous_asteroid).length > 0
                      ? 'bg-cyan-700 hover:bg-cyan-600 text-white'
                      : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                } transition-colors`}
              >
                {isSpeaking ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Detener
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Informe de voz
                  </>
                )}
              </button>
              <p className="text-xs text-gray-400 mt-2">Asteroide más peligroso</p>
            </div>
          </div>
        )}

        {/* Grid de asteroides */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAsteroids.map((asteroid) => (
            <motion.div
              key={asteroid.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`relative group bg-gray-800/50 hover:bg-gray-700/70 transition-all rounded-xl overflow-hidden border ${
                asteroid.is_potentially_hazardous_asteroid
                  ? 'border-red-700/50 hover:border-red-400/30'
                  : 'border-gray-700/50 hover:border-cyan-400/30'
              }`}
            >
              {/* Efecto de fondo */}
              <div 
                className={`absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity ${
                  asteroid.is_potentially_hazardous_asteroid ? 'bg-red-400' : 'bg-cyan-400'
                }`}
              />
              
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-mono text-gray-400">
                    #{asteroid.neo_reference_id.slice(-6)}
                  </span>
                  {asteroid.is_potentially_hazardous_asteroid && (
                    <span className="flex items-center text-xs px-3 py-1 rounded-full bg-red-900/50 text-red-300">
                      <FaExclamationTriangle className="mr-1" /> Peligroso
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {asteroid.name.replace(/[()]/g, '')}
                </h2>
                
                <div className="flex items-center text-sm text-gray-400 mb-4">
                  <FaRocket className="mr-2" />
                  <span>
                    {parseFloat(asteroid.close_approach_data[0].relative_velocity.kilometers_per_hour).toFixed(2)} km/h
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Tamaño estimado</p>
                    <p className="text-gray-300">
                      {asteroid.estimated_diameter.meters.estimated_diameter_min.toFixed(1)}m -{' '}
                      {asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(1)}m
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Fecha de acercamiento</p>
                    <p className="text-gray-300">
                      {new Date(asteroid.close_approach_data[0].close_approach_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-gray-500">
                    Distancia: {parseFloat(asteroid.close_approach_data[0].miss_distance.kilometers).toLocaleString()} km
                  </span>
                  <a
                    href={asteroid.nasa_jpl_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1 rounded bg-gray-700/50 hover:bg-cyan-500/20 text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    Detalles <FaRocket className="ml-1" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mensaje cuando no hay resultados */}
        {!loading && !error && filteredAsteroids.length === 0 && asteroids.length > 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron asteroides que coincidan con tu búsqueda</p>
          </div>
        )}

        {!loading && !error && asteroids.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No se encontraron asteroides para esta fecha</p>
          </div>
        )}
      </div>
    </div>
  );
}