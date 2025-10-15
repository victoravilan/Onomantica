import React, { useState, useEffect } from 'react';
import { Search, LoaderCircle } from 'lucide-react';

// --- Tipos (Asegúrate de que coincidan con tu archivo types.ts) ---
interface NameData {
  nombre: string;
  genero: string;
  origen: string;
  significado: string;
  historia: {
    tipo: string;
    relato: string;
  };
}

// --- Componente de Tarjeta de Nombre (Ejemplo) ---
const NameCard = ({ item }: { item: NameData }) => (
  <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 transition-all hover:border-slate-600 hover:bg-slate-800">
    <h3 className="font-serif text-2xl text-amber-300">{item.nombre}</h3>
    <p className="text-sm text-slate-400 mb-4">{item.origen} / {item.genero}</p>
    <p className="mb-4 text-slate-300">{item.significado}</p>
    <div className="border-t border-slate-700 pt-4">
      <p className="text-sm font-semibold text-amber-400/80 mb-2">{item.historia.tipo}</p>
      <p className="text-slate-400 text-sm">{item.historia.relato}</p>
    </div>
  </div>
);

function App() {
  const [names, setNames] = useState<NameData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simula la carga de datos
    setTimeout(() => {
      // Aquí iría tu lógica para cargar el JSON
      // fetch('/data/nombres_completos.json').then(res => res.json()).then(data => {
      //   setNames(data);
      //   setLoading(false);
      // });
      setLoading(false); // Quita esto cuando implementes el fetch real
    }, 1500);
  }, []);

  const filteredNames = searchTerm
    ? names.filter(n => n.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto text-center mt-12 mb-12">
        <h1 className="font-serif text-5xl sm:text-6xl font-bold text-amber-300/90 tracking-wider">
          Onomántica
        </h1>
        <p className="text-slate-400 mt-3">Descubre la historia y el alma detrás de cada nombre.</p>
      </div>

      {/* Aquí iría tu componente SearchBar, o puedes usar este */}
      <div className="relative w-full max-w-md mb-12">
        <input
          type="text"
          placeholder="Busca un nombre..."
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-slate-800/70 border border-slate-700 rounded-full focus:ring-2 focus:ring-amber-400/50 focus:outline-none transition-colors"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-slate-500">
          <LoaderCircle className="animate-spin h-5 w-5" />
          <span>Cargando conocimiento...</span>
        </div>
      )}

      {!loading && searchTerm && filteredNames.length === 0 && (
        <p className="text-slate-500">No se encontraron nombres para "{searchTerm}".</p>
      )}

      <div className="w-full max-w-3xl mx-auto grid gap-6">
        {filteredNames.map(item => (
          <NameCard key={item.nombre} item={item} />
        ))}
      </div>
    </main>
  );
}

export default App;