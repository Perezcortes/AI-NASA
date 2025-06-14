'use client';

import { useState, useEffect } from "react";
import { Loader } from "../components/ui/loader";
import { ErrorMessage } from "../components/ui/error-message";
import type { ApodResponse } from "./types/nasa";
import { Carousel } from "../components/ui/carousel";

export default function HomePage() {
  const [data, setData] = useState<ApodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        // Solo imágenes (puedes cambiarlo si quieres videos también)
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          Explorando el Universo con IA y la NASA 🚀
        </h1>

        {loading && <Loader message="Cargando imágenes del cosmos..." />}

        {error && <ErrorMessage message={error} onRetry={() => location.reload()} />}

        {!loading && data.length > 0 && <Carousel images={data} />}
      </div>
    </main>
  );
}
