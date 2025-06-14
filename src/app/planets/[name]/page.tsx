import { planets } from "../../data/planets";
import { FaTemperatureHigh, FaWeight, FaMoon, FaSun } from "react-icons/fa";
import { GiOrbital } from "react-icons/gi";
import { MdExplore } from "react-icons/md";
import PlanetModel from "../../../components/PlanetModel";

async function getVideos(planet: string) {
  try {
    const searchRes = await fetch(
      `https://images-api.nasa.gov/search?q=${planet}+planet&media_type=video`
    );
    const searchData = await searchRes.json();
    return searchData.collection?.items?.slice(0, 2) || [];
  } catch (error) {
    console.error("Error fetching videos:", error);
    return [];
  }
}

async function getImages(planet: string) {
  try {
    const res = await fetch(
      `https://images-api.nasa.gov/search?q=${planet}+planet&media_type=image`
    );
    const data = await res.json();
    return data.collection?.items?.slice(0, 9) || [];
  } catch (error) {
    console.error("Error fetching images:", error);
    return [];
  }
}

export default async function PlanetDetail({ params }: { params: { name: string } }) {
  const planet = planets.find(p => p.name.toLowerCase() === params.name.toLowerCase());
  if (!planet) return <div className="p-10 text-red-500">Planet not found</div>;

  const [videos, images] = await Promise.all([
    getVideos(planet.name),
    getImages(planet.name)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-transparent z-10" />
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <PlanetModel planetName={planet.name} />
        </div>
        
        <div className="container mx-auto px-6 py-24 relative z-20">
          <div className="max-w-3xl">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-medium rounded-full bg-cyan-900/30 text-cyan-400">
              {planet.type} Planet
            </span>
            <h1 className="text-5xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              {planet.name}
            </h1>
            <p className="text-xl text-gray-300 mb-8">{planet.description}</p>
          </div>
        </div>
      </div>

      {/* Planet Facts */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column */}
          <div>
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <MdExplore className="text-cyan-400" />
              <span>Key Facts</span>
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaSun />
                  <h3 className="font-medium">Distance from Sun</h3>
                </div>
                <p>{planet.distanceFromSun.km} ({planet.distanceFromSun.au})</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaWeight />
                  <h3 className="font-medium">Gravity</h3>
                </div>
                <p>{planet.gravity}</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <FaTemperatureHigh />
                  <h3 className="font-medium">Avg. Temperature</h3>
                </div>
                <p>{planet.avgTemperature}</p>
              </div>
              
              <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                <div className="flex items-center gap-2 text-cyan-400 mb-2">
                  <GiOrbital />
                  <h3 className="font-medium">Orbital Period</h3>
                </div>
                <p>{planet.orbitalPeriod}</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-3">Composition</h3>
              <p className="text-gray-300">{planet.composition}</p>
            </div>

            {planet.notableFeatures.length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-3">Notable Features</h3>
                <ul className="space-y-2">
                  {planet.notableFeatures.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-cyan-400 mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column - Media */}
          <div>
            {/* Videos */}
            {videos.length > 0 && (
              <div className="mb-12">
                <h2 className="text-3xl font-bold mb-6">Videos</h2>
                <div className="grid gap-4">
                  {videos.map((video: any, i: number) => (
                    <div key={i} className="bg-black rounded-xl overflow-hidden">
                      <video
                        src={video.links[0].href}
                        controls
                        className="w-full"
                        poster={video.data[0]?.thumbnail_url}
                      />
                      <div className="p-4">
                        <h3 className="font-medium">{video.data[0].title}</h3>
                        <p className="text-sm text-gray-400 mt-1">
                          {video.data[0].description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {images.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Gallery</h2>
                <div className="grid grid-cols-3 gap-2">
                  {images.map((img: any, i: number) => (
                    <a
                      key={i}
                      href={img.links[0].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden relative">
                        <img
                          src={img.links[0].href.replace('~thumb', '~large')}
                          alt={img.data[0].title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                          <p className="text-white text-xs truncate w-full">
                            {img.data[0].title}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}