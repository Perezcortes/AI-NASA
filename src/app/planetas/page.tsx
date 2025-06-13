"use client";

export default function PlanetasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-indigo-900 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-wide">🌌 Explorador de Planetas</h1>
        <button className="bg-indigo-700 hover:bg-indigo-600 px-4 py-2 rounded-lg">Volver al inicio</button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">🪐 Marte</h2>
          <p className="text-sm text-indigo-200 mb-4">Fecha de consulta: 2024-04-24</p>
          <p>
            Marte, conocido como el Planeta Rojo, es el cuarto planeta del sistema solar. Es objetivo principal de varias misiones en búsqueda de vida pasada.
          </p>
          <div className="mt-6 space-y-2">
            <button className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500">Ver misiones activas</button>
            <button className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-500">Información atmosférica</button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          <img src="/img/marte.jpg" alt="Marte" className="w-80 h-80 object-contain rounded-xl shadow-lg" />
        </div>
      </div>

      <div className="text-center mt-12">
        <button className="bg-green-600 text-white px-6 py-3 rounded-full text-lg hover:bg-green-500">
          🎤 Activar reconocimiento de voz
        </button>
      </div>
    </div>
  );
}