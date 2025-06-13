"use client";

export default function NoticiasPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">📰 Noticias del Espacio</h1>
        <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700">Volver</button>
      </header>

      <section className="space-y-6">
        <article className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">📡 Señal detectada desde exoplaneta</h2>
          <p className="text-sm text-gray-400">13 de junio de 2025</p>
          <p>
            La NASA informó sobre una señal de origen desconocido proveniente de un exoplaneta ubicado a 400 años luz. Se están realizando análisis para determinar su origen.
          </p>
        </article>

        <article className="bg-gray-800 p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">🌍 Asteroide pasará cerca de la Tierra</h2>
          <p className="text-sm text-gray-400">11 de junio de 2025</p>
          <p>
            Un asteroide de gran tamaño se aproximará a la Tierra a una distancia segura, según los cálculos del centro de estudios planetarios.
          </p>
        </article>
      </section>

      <div className="text-center mt-10">
        <button className="bg-blue-600 px-6 py-3 rounded-full hover:bg-blue-500 text-lg">
          🎤 Leer noticias en voz alta
        </button>
      </div>
    </div>
  );
}