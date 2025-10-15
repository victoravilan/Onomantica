import React, { useState, useEffect, useMemo } from 'react';
import { Search, LoaderCircle, WandSparkles, BookText, Users, Feather, Sword, Gem } from 'lucide-react';
import type { NameData } from './types';
import { loadDataset } from './lib/store';
import { normalize } from './lib/diacritics';
import { storyFromKnown, storyFromConstructed, meaningFromRoots } from './lib/generator';

// --- Componentes de Tarjetas ---
const NameCard = ({ item }: { item: NameData | null }) => {
    if (!item) return null;

    // Divide el significado en párrafos basados en el doble salto de línea
    const paragraphs = item.significado.split('\n\n');
    const [p1, p2, p3, p4, p5] = paragraphs;

    const Section = ({ title, children, icon: Icon }: { title: string, children: React.ReactNode, icon: React.ElementType }) => (
        <div className="mt-6">
            <h4 className="flex items-center gap-2 font-serif text-lg text-amber-300/80 mb-2">
                <Icon className="h-4 w-4" />
                {title}
            </h4>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed">{children}</p>
        </div>
    );

    return (
        <div className="bg-slate-800/50 rounded-lg p-6 sm:p-8 border border-slate-700/50 transition-all hover:border-slate-600 hover:bg-slate-800">
            <h3 className="font-serif text-3xl sm:text-4xl text-amber-300">{item.nombre}</h3>
            <p className="text-sm text-slate-400 mb-4">{item.origen} / {item.genero}</p>

            <div className="border-t border-slate-700/50">
                {p1 && <Section title="Origen y Significado" icon={BookText}>{p1}</Section>}
                {p2 && <Section title="Legado y Personajes" icon={Users}>{p2}</Section>}
                {p3 && <Section title="Relato Poético" icon={Feather}>{p3}</Section>}
                {p4 && <Section title="Narrativa Épica" icon={Sword}>{p4}</Section>}
                {p5 && <Section title="Numerología" icon={Gem}>{p5}</Section>}
            </div>
        </div>
    );
};

const FallbackCard = ({ name, data, story }: { name: string, data: { origen: string, significado: string }, story: { tipo: string, relato: string } }) => (
    <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700/50 transition-all hover:border-slate-600 hover:bg-slate-800">
        <div className="flex justify-between items-start">
            <h3 className="font-serif text-2xl text-amber-300">{name}</h3>
            <span className="flex items-center gap-2 text-xs text-purple-300 bg-purple-900/50 px-2 py-1 rounded-full">
                <WandSparkles className="h-3 w-3" />
                Generado
            </span>
        </div>
        <p className="text-sm text-slate-400 mb-4">{data.origen}</p>
        <p className="mb-4 text-slate-300">{data.significado}</p>
        <div className="border-t border-slate-700 pt-4">
            <p className="text-sm font-semibold text-amber-400/80 mb-2 capitalize">{story.tipo.replace(/a$/, 'a')}</p>
            <p className="text-slate-400 text-sm whitespace-pre-wrap">{story.relato}</p>
        </div>
    </div>
);

function App() {
    const [raw, setRaw] = useState<NameData[] | null>(null);
    const [q, setQ] = useState('');
    const [hit, setHit] = useState<NameData | null>(null);
    const [fallback, setFallback] = useState<{ origen: string, significado: string, rasgos: string[] } | null>(null);
    const [story, setStory] = useState<{ tipo: string, relato: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        loadDataset().then(data => {
            setRaw(data);
            setLoading(false);
        });
    }, []);

    const byName = useMemo(() => {
        if (!raw) return new Map<string, NameData>();
        const m = new Map<string, NameData>();
        for (const r of raw) m.set(normalize(r.nombre), r);
        return m;
    }, [raw]);

    const handleSearch = (query: string) => {
        const name = query.trim();
        setSearched(true);
        if (!name) {
            setHit(null);
            setFallback(null);
            setStory(null);
            return;
        }

        const key = normalize(name);
        const known = byName.get(key);

        if (known) {
            setHit(known);
            setFallback(null);
            setStory({ tipo: known.historia.tipo, relato: storyFromKnown(known) });
        } else {
            const synth = meaningFromRoots(name);
            setHit(null);
            setFallback(synth);
            const s = storyFromConstructed(name);
            setStory(s);
        }
    };

    return (
        <main className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
            <div className="w-full max-w-3xl mx-auto text-center mt-12 mb-12">
                <img src="/img/logo-onomantica.png" alt="Logo de Onomántica" className="w-24 h-24 mx-auto mb-4" />
                <h1 className="font-serif text-5xl sm:text-6xl font-bold text-amber-300/90 tracking-wider">
                    Onomántica
                </h1>
                <p className="text-slate-400 mt-3">Descubre la historia y el alma detrás de cada nombre.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSearch(q); }} className="relative w-full max-w-md mb-12">
                <input
                    type="text"
                    placeholder="Busca un nombre..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/70 border border-slate-700 rounded-full focus:ring-2 focus:ring-amber-400/50 focus:outline-none transition-colors"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
            </form>

            {loading && (
                <div className="flex items-center gap-2 text-slate-500">
                    <LoaderCircle className="animate-spin h-5 w-5" />
                    <span>Cargando conocimiento...</span>
                </div>
            )}

            {!loading && searched && !hit && !fallback && q && (
                <p className="text-slate-500">No se encontraron resultados para "{q}".</p>
            )}

            <div className="w-full max-w-3xl mx-auto grid gap-6">
                {hit && story && <NameCard item={hit} />}
                {fallback && story && <FallbackCard name={q} data={fallback} story={story} />}
            </div>
        </main>
    );
}

export default App;