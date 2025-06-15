import Link from "next/link";
import { ThemeToggle } from "./ui/theme-toggle";
import { MobileMenu } from "./ui/mobile-menu";

const navLinks = [
  { name: "Inicio", path: "/" },
  { name: "Planetas", path: "/planets" },
  { name: "Asteroides", path: "/asteroids" },
  { name: "IA Interactiva", path: "/ia" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800 shadow-sm">
      <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl">🌌</span>
          <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:from-cyan-300 group-hover:to-blue-400 transition-all">
            AI-NASA
          </h1>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-px bg-cyan-400 transition-all group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
          
          <ThemeToggle />
        </div>
        
        <MobileMenu links={navLinks} />
      </nav>
    </header>
  );
}