import React, { useEffect, useMemo, useState } from 'react'
import SearchBar from './components/SearchBar'
import MeaningCard from './components/MeaningCard'
import StoryCard from './components/StoryCard'
import EmptyState from './components/EmptyState'
import type { NombreItem } from './types'
import { loadDataset } from './lib/store'
import { normalize } from './lib/diacritics'
import { analyzeName } from './lib/onomastics'
import { storyFromKnown, storyFromConstructed, meaningFromRoots } from './lib/generator'

export default function App(){
  const [raw, setRaw] = useState<NombreItem[]|null>(null)
  const [q, setQ] = useState('')
  const [hit, setHit] = useState<NombreItem|null>(null)
  const [fallback, setFallback] = useState<{origen:string, significado:string, rasgos:string[]}|null>(null)
  const [story, setStory] = useState<{tipo:string,relato:string}|null>(null)

  useEffect(()=>{ loadDataset().then(setRaw) },[])

  const byName = useMemo(()=>{
    if(!raw) return new Map<string,NombreItem>()
    const m = new Map<string,NombreItem>()
    for (const r of raw) m.set(normalize(r.nombre), r)
    return m
  },[raw])

  async function submit(){
    const name = q.trim()
    if (!name) return
    const key = normalize(name)
    const known = byName.get(key)
    if (known){
      setHit(known)
      setFallback(null)
      setStory({ tipo: known.historia.tipo, relato: storyFromKnown(known) })
    } else {
      // ONOMÁNTICA: analizar raíces y generar significado+historia
      const synth = meaningFromRoots(name)
      setHit(null)
      setFallback(synth)
      const s = storyFromConstructed(name)
      setStory(s)
    }
  }

  const a = q ? analyzeName(q) : null

  return (
    <div className="min-h-full bg-slate-950 text-slate-100">
      <header className="sticky top-0 backdrop-blur bg-slate-950/70 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="font-bold text-lg">🔮 Onomántica</h1>
          <div className="text-sm text-slate-400">PWA • Offline • Historias de nombres</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex flex-col items-center gap-6">
          <SearchBar value={q} onChange={setQ} onSubmit={submit}/>
          {!hit && !fallback ? <EmptyState/> : null}

          {hit && (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <MeaningCard
                titulo={`${hit.nombre} — ${hit.origen} • ${hit.genero}`}
                lines={[
                  `Significado: ${hit.significado}`,
                  `Tipo de historia: ${hit.historia.tipo}`
                ]}
              />
              {a && (
                <MeaningCard
                  titulo="Desglose onomástico (eco de raíces)"
                  lines={[
                    `Normalizado: ${a.limpio}`,
                    a.matches.length
                      ? `Coincidencias: ${a.matches.map(m=>`${m.raiz} (${m.glosa})`).join(', ')}`
                      : 'Sin coincidencias claras: nombre plenamente original'
                  ]}
                />
              )}
              {story && <div className="md:col-span-2"><StoryCard tipo={story.tipo} texto={story.relato}/></div>}
            </div>
          )}

          {fallback && (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <MeaningCard
                titulo={`${q.trim()} — ${fallback.origen}`}
                lines={[
                  `Significado estimado: ${fallback.significado}`,
                  fallback.rasgos.length ? `Rasgos evocados: ${fallback.rasgos.join(', ')}` : 'Nombre de creación libre'
                ]}
              />
              {story && <StoryCard tipo={story.tipo} texto={story.relato}/>}
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-slate-400 text-sm">
        <p><strong>Modo Onomántica:</strong> si el nombre no está en la base, se analiza por raíces onomásticas (vocales, grupos y ventanas 2–4) para crear significado e historia coherentes.</p>
      </footer>
    </div>
  )
}
