'use client';

import { FaSearch, FaNewspaper } from 'react-icons/fa';
import { useState } from 'react';

export default function NoticiasHeader({
  onSearch,
}: {
  onSearch: (query: string) => void;
}) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Noticias de la NASA
          </h1>
          <p className="text-gray-400 mt-2">
            Descubre las últimas imágenes y noticias del espacio
          </p>
        </div>

        <div className="relative w-full md:w-96">
          <input
            type="text"
            placeholder="Buscar noticias..."
            value={query}
            onChange={handleChange}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="mt-6 flex items-center text-sm text-cyan-400">
        <FaNewspaper className="mr-2" />
        <span>Actualizado diariamente desde la API de la NASA</span>
      </div>
    </div>
  );
}
