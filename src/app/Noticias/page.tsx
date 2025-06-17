'use client'

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NoticiasGrid from '@/components/noticias/NoticiasGrid';
import NoticiasHeader from '@/components/noticias/NoticiasHeader';
import ReadLaterModal from '@/components/noticias/ReadLaterModal';
import type { RootState } from '@/store';

type Noticia = {
  title: string;
  description: string;
  imageUrl: string;
  nasaLink: string;
};

export default function NoticiasPage() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const readLaterCount = useSelector((state: RootState) => state.readLater.items.length);

  useEffect(() => {
    setIsClient(true);

    const fetchNoticias = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          'https://images-api.nasa.gov/search?q=news&media_type=image&year_start=2025'
        );

        if (!res.ok) throw new Error('Error al cargar noticias');

        const data = await res.json();
        const results = data.collection.items
          .filter((item: any) => item.data?.[0]?.title && item.links?.[0]?.href)
          .slice(0, 12)
          .map((item: any) => ({
            title: item.data[0].title,
            description: item.data[0].description || 'Descripción no disponible',
            imageUrl: item.links[0].href,
            //nasaLink: `https://www.nasa.gov${item.href}` || '#', item.href puede ser una URL completa ya, o peor, algo como: /asset/GSFC_20230612_Archive/metadata.json
            nasaLink: `https://images.nasa.gov/details/${item.data[0].nasa_id}` //nasa_id y redirige al sitio oficial con este patrón garantiza que siempre apunte a una página HTML válida y visible
            ,
          }));

        setNoticias(results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNoticias();
  }, []);

  const filteredNoticias = noticias.filter(
    (noticia) =>
      noticia.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      noticia.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-white">Noticias</h1>

          {isClient && (
            <button
              onClick={() => setModalOpen(true)}
              className="bg-cyan-600 hover:bg-cyan-700 px-4 py-2 rounded text-white"
            >
              Leer más tarde ({readLaterCount})
            </button>
          )}
        </div>

        <NoticiasHeader onSearch={setSearchTerm} />

        {error && (
          <div className="bg-red-900/30 border border-red-700 rounded-lg p-6 text-center mb-8">
            <p className="text-red-300 text-lg">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 px-4 py-2 bg-red-700 hover:bg-red-600 rounded-md text-sm"
            >
              Reintentar
            </button>
          </div>
        )}

        <NoticiasGrid noticias={filteredNoticias} loading={loading} />
        <ReadLaterModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </main>
  );
}
