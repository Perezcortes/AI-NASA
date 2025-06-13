"use client";

export default function AsteroidesPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">☄️ Asteroides Cercanos</h1>
        <button className="bg-gray-800 px-4 py-2 rounded-lg hover:bg-gray-700">Inicio</button>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Asteroide 2024 QX1</h2>
          <p>📏 Diámetro estimado: 150 metros</p>
          <p>📍 Distancia mínima: 0.002 UA</p>
          <p>📆 Fecha de paso: 2025-06-20</p>
        </div>
        <div className="bg-gray-900 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Asteroide 2025 AD3</h2>
          <p>📏 Diámetro estimado: 200 metros</p>
          <p>📍 Distancia mínima: 0.005 UA</p>
          <p>📆 Fecha de paso: 2025-06-25</p>
        </div>
      </main>

      <div className="text-center mt-10">
        <button className="bg-red-600 px-6 py-3 rounded-full hover:bg-red-500 text-lg">
          🎤 Ver asteroides con voz
        </button>
      </div>
    </div>
  );
}