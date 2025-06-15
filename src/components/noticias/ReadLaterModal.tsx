'use client';

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { removeFromReadLater, clearReadLater } from '@/store/slices/readLaterSlice';
import { FaTimes, FaTrash, FaRegBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReadLaterModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) => state.readLater.items);

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres vaciar tu lista de lectura?')) {
      dispatch(clearReadLater());
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col border border-gray-700 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-800 bg-gray-900/50">
              <div className="flex items-center gap-3">
                <FaRegBookmark className="text-cyan-400" size={20} />
                <h3 className="text-xl font-semibold text-white">
                  Noticias guardadas <span className="text-cyan-400">({items.length})</span>
                </h3>
              </div>
              <button
                onClick={onClose}
                aria-label="Cerrar modal"
                className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <FaRegBookmark className="text-gray-600 mb-4" size={48} />
                  <h4 className="text-lg font-medium text-gray-300 mb-2">Lista vacía</h4>
                  <p className="text-gray-500 max-w-md">
                    Guarda noticias interesantes para leerlas más tarde haciendo clic en el icono de marcador.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-800">
                  {items.map(({ title, nasaLink }, i) => (
                    <motion.li
                      key={nasaLink}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex justify-between items-center p-4">
                        <a
                          href={nasaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex-1 min-w-0"
                        >
                          <p className="text-white group-hover:text-cyan-400 transition-colors truncate">
                            {title}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-cyan-400 group-hover:underline flex items-center">
                              Ver noticia <FaExternalLinkAlt className="ml-1" size={10} />
                            </span>
                          </div>
                        </a>
                        <button
                          onClick={() => dispatch(removeFromReadLater(nasaLink))}
                          aria-label={`Quitar ${title}`}
                          className="p-2 ml-4 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-700/50 transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-gray-800 bg-gray-900/50 flex justify-end">
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-white rounded-lg flex items-center gap-2 transition-colors"
                >
                  <FaTrash size={14} />
                  Vaciar lista
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}