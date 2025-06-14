import Link from "next/link";
import { SocialLinks } from "./ui/social-links";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Planetas", path: "/planetas" },
  { name: "Asteroides", path: "/asteroides" },
  { name: "IA Interactiva", path: "/ia" },
];

export function Footer() {
  return (
    <footer className="bg-black/90 border-t border-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🌌</span>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                AI-NASA
              </h2>
            </Link>
            <p className="text-gray-400 text-sm">
              Explorando el universo con inteligencia artificial y datos de la NASA.
            </p>
            <SocialLinks />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-semibold">Explorar</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-semibold">Recursos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://api.nasa.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  API de la NASA
                </Link>
              </li>
              <li>
                <Link
                  href="/documentacion"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Documentación
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} AI-NASA. Desarrollado con <span className="text-red-500">❤</span> por José Pérez
          </p>
          <p className="mt-2">
            Este proyecto no está afiliado a la NASA. Todos los datos son proporcionados por la{' '}
            <Link
              href="https://api.nasa.gov"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-cyan-400"
            >
              API pública de la NASA
            </Link>.
          </p>
        </div>
      </div>
    </footer>
  );
}