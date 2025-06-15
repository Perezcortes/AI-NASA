import NoticiaCard from './NoticiaCard';
import { motion } from 'framer-motion';

type Noticia = {
  title: string;
  description: string;
  imageUrl: string;
  nasaLink: string;
};

export default function NoticiasGrid({ noticias, loading }: { noticias: Noticia[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: idx * 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden h-96 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {noticias.map((noticia, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
        >
          <NoticiaCard {...noticia} />
        </motion.div>
      ))}
    </div>
  );
}