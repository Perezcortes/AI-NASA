'use client';

import { useState } from "react";
import type { ApodResponse } from "../../app/types/nasa";

export const Carousel = ({ images }: { images: ApodResponse[] }) => {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  const current = images[index];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative group">
        <img
          src={current.url}
          alt={current.title}
          className="w-full h-auto max-h-[80vh] object-contain rounded-xl shadow-2xl transition-all group-hover:shadow-cyan-500/50"
          loading="lazy"
        />
        <div className="absolute inset-0 flex justify-between items-center px-4">
          <button
            onClick={prev}
            className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="bg-black/50 hover:bg-black/70 p-2 rounded-full text-white"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-cyan-100">{current.title}</h2>
          <span className="text-sm text-gray-400">{current.date}</span>
        </div>

        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {current.explanation}
        </p>

        {current.copyright && (
          <p className="text-sm text-gray-500">
            Créditos: {current.copyright}
          </p>
        )}
      </div>
    </div>
  );
};
