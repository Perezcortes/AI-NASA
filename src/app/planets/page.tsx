import { planets } from "../data/planets";
import Link from "next/link";
import { FaSearch, FaGlobeAmericas } from "react-icons/fa";

export default function PlanetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Explorador Planetario
            </h1>
            <p className="text-gray-400 mt-2">
              Descubre los mundos de nuestro sistema solar
            </p>
          </div>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Buscar planetas..."
              className="w-full bg-gray-800/50 border border-gray-700 rounded-full py-3 px-6 pl-12 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </header>

        {/* Grid de planetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {planets.map((planet) => (
            <Link 
              key={planet.name} 
              href={`/planets/${planet.name.toLowerCase()}`}
              className="group"
            >
              <div className="relative h-full bg-gray-800/50 hover:bg-gray-700/70 transition-all rounded-2xl overflow-hidden border border-gray-700/50 hover:border-cyan-400/30">
                {/* Efecto de planeta */}
                <div 
                  className={`absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 blur-xl group-hover:opacity-30 transition-opacity ${
                    planet.type === "Terrestrial" ? "bg-yellow-400" : 
                    planet.type === "Gas Giant" ? "bg-orange-400" : "bg-blue-400"
                  }`}
                />
                
                <div className="p-6 relative z-10 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-mono text-gray-400">
                      #{planet.order}
                    </span>
                    <span className="text-xs px-3 py-1 rounded-full bg-gray-700/50 text-cyan-300">
                      {planet.type}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {planet.name}
                  </h2>
                  
                  <div className="flex items-center text-sm text-gray-400 mb-4">
                    <FaGlobeAmericas className="mr-2" />
                    <span>{planet.distanceFromSun.au} from Sun</span>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-6 line-clamp-2">
                    {planet.description}
                  </p>
                  
                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      {planet.moons.length} moon{planet.moons.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-xs px-2 py-1 rounded bg-gray-700/50 text-gray-300">
                      Explore →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}