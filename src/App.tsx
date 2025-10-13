import React, { useEffect, useMemo, useRef, useState } from 'react'
import SearchBar from './components/SearchBar'
import MeaningCard from './components/MeaningCard'
import StoryCard from './components/StoryCard'
import EmptyState from './components/EmptyState'
import ExtrasBadges from './components/ExtrasBadges'

import type { NombreItem } from './types'
import type { RuleNote } from './data/rules'

import { loadDataset } from './lib/store'
import { normalize } from './lib/diacritics'
import { analyzeName } from './lib/onomastics'
import { meaningFromRoots } from './lib/generator'

import { enrichName } from './lib/enrich'
import { analyzeCompound } from './lib/compound'

// Motor de relatos y proveedor (con fallback remoto→local)
import { type Tone } from './lib/stories'
import {
  LocalStoryProvider,
  RemoteStoryProvider,
  type StoryProvider
} from './lib/storyProvider'
import ToneSelector from './components/ToneSelector'

export default function App(){
  const [raw, setRaw] = useState<NombreItem[]|null>(null)
  const [q, setQ] = useState('')
  const [hit, setHit] = useState<NombreItem|null>(null)
  const [fallback, setFallback] = useState<{origen:string, significado:string, rasgos:string[]}|null>(null)
  const [story, setStory] = useState<{tipo:string,relato:string}|null>(null)
  const [error, setError] = useState<string|null>(null)

  const [tone, setTone] = useState<Tone>('épica')
  const [seed, setSeed] = useState<number>(0)
  const [tags, setTags] = useState<string[]>([])
  const [extras, setExtras] = useState<RuleNote[]>([])

  // antirrepetición por (nombre|tono)
  const seenRef = useRef<Map<string, Set<string>>>(new Map())

  // Proveedor: por defecto Local (puedes cambiar a Remote cuando subas a Vercel)
  const providerRef = useRef<StoryProvider>(
    new LocalStoryProvider()
    // new RemoteStoryProvider('/api/story') // ← cuando tengas endpoint activo
  )

  useEffect(()=>{
    ;(async ()=>{
      try {
        const data = await loadDataset()
        setRaw(data)
      } catch (e:any) {
        console.error(e)
        setError('No se pudo cargar /data/nombres_completos.json')
      }
    })()
  },[])

  const byName = useMemo(()=>{
    if(!raw) return new Map<string,NombreItem>()
    const m = new Map<string,NombreItem>()
    for (const r of raw) m.set(normalize(r.nombre), r)
    return m
  },[raw])

  function buildTagsFromName(nombre: string, enrichedMeaning?: string) {
    const k = normalize(nombre)
    const ts: string[] = []
    if (/\bsol\b/.test(k)) ts.push('celeste','elemento:fuego')
    if (/\bluna\b/.test(k)) ts.push('celeste','naturaleza')
    if (/\bmar\b/.test(k)) ts.push('naturaleza','elemento:agua')
    if (/estre/.test(k))   ts.push('celeste')
    if (/rosa|flor/.test(k)) ts.push('naturaleza')
    if (/piedad|caridad|fe|esperanza|paz|gloria|justicia|prudencia/.test(k)) ts.push('virtud')
    if (enrichedMeaning && /Elohim|teofór/i.test(enrichedMeaning)) ts.push('teoforico')
    return Array.from(new Set(ts))
  }

  function registerSeenKey(key: string, text: string) {
    if (!seenRef.current.has(key)) seenRef.current.set(key, new Set())
    seenRef.current.get(key)!.add(text)
  }
  function getAvoid(key: string): string[] {
    return Array.from(seenRef.current.get(key) ?? [])
  }

  async function makeStory(nombre: string, significado: string) {
    const key = `${normalize(nombre)}|${tone}`
    const avoid = getAvoid(key)
    let provider = providerRef.current
    try {
      const out = await provider.generate({ nombre, significado, tone, seed, tags, avoid })
      registerSeenKey(key, out.relato)
      setStory({ tipo: out.tipo, relato: out.relato })
    } catch (err) {
      console.warn('Proveedor remoto falló, usando Local:', err)
      provider = new LocalStoryProvider()
      providerRef.current = provider
      const out = await provider.generate({ nombre, significado, tone, seed, tags, avoid })
      registerSeenKey(key, out.relato)
      setStory({ tipo: out.tipo, relato: out.relato })
    }
  }

  // 🔧 Arreglo clave: si cambias el tono y ya hay resultado en pantalla, regenera con el nuevo tono
  useEffect(()=>{
    if (hit) {
      void makeStory(hit.nombre, hit.significado)
    } else if (fallback) {
      void makeStory(q.trim(), fallback.significado)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tone])

  function regenerateCurrent() {
    setSeed(Date.now() | 0)
    if (hit) {
      void makeStory(hit.nombre, hit.significado)
    } else if (fallback) {
      void makeStory(q.trim(), fallback.significado)
    }
  }

  async function submit(){
    const name = q.trim()
    if (!name) return
    const key = normalize(name)
    setSeed(Date.now() | 0)
    setExtras([])

    // 0) Compuesto si no hay hit directo
    let known = byName.get(key)
    if (!known) {
      const comp = analyzeCompound(name, byName)
      if (comp){
        const compEnrich = enrichName(comp.nombre, { significado: comp.significado, origen: comp.origen })
        setExtras(compEnrich.extras)

        const ttags = buildTagsFromName(comp.nombre, compEnrich.mergedMeaning ?? comp.significado)
        setTags(ttags)

        setHit({
          nombre: comp.nombre,
          genero: 'U',
          origen: compEnrich.mergedOrigin ?? comp.origen,
          significado: compEnrich.mergedMeaning ?? comp.significado,
          historia: { tipo: tone, relato: '' }
        })
        setFallback({ origen: comp.origen, significado: comp.significado, rasgos: [] })

        await makeStory(comp.nombre, compEnrich.mergedMeaning ?? comp.significado)
        return
      }
    }

    // 1) Búsqueda normal
    known = byName.get(key)
    if (!known && raw) {
      const found = raw.find(r => normalize(r.nombre) === key)
      if (found) known = found
    }

    if (known){
      const enr = enrichName(known.nombre, { significado: known.significado, origen: known.origen })
      setExtras(enr.extras)

      const enriched: NombreItem = {
        ...known,
        origen: enr.mergedOrigin ?? known.origen,
        significado: enr.mergedMeaning ?? known.significado,
      }

      const ttags = buildTagsFromName(enriched.nombre, enriched.significado)
      setTags(ttags)

      setHit(enriched)
      setFallback(null)
      await makeStory(enriched.nombre, enriched.significado)
    } else {
      const synth = meaningFromRoots(name)
      const invEnr = enrichName(name, { significado: synth.significado, origen: synth.origen })
      setExtras(invEnr.extras)

      const ttags = buildTagsFromName(name, invEnr.mergedMeaning ?? synth.significado)
      setTags(ttags)

      setHit(null)
      setFallback({
        ...synth,
        significado: invEnr.mergedMeaning ?? synth.significado,
        origen: invEnr.mergedOrigin ?? synth.origen
      })
      await makeStory(name, invEnr.mergedMeaning ?? synth.significado)
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
          <SearchBar value={q} onChange={setQ} onSubmit={submit} />

          {!error && raw && (
            <div className="text-sm text-slate-500">
              Dataset cargado: {raw.length} nombres
            </div>
          )}
          {error && <div className="text-rose-400 text-sm">{error}</div>}

          {(hit || fallback) && (
            <div className="w-full max-w-2xl">
              <ToneSelector
                value={tone}
                onChange={(t)=> setTone(t)}
                onRegenerate={regenerateCurrent}
              />
            </div>
          )}

          {!hit && !fallback ? <EmptyState/> : null}

          {hit && (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <MeaningCard
                titulo={`${hit.nombre} — ${hit.origen} • ${hit.genero}`}
                lines={[
                  `Significado: ${hit.significado}`,
                  `Tipo de historia: ${story?.tipo ?? hit.historia.tipo}`
                ]}
              />
              <div className="md:col-span-2">
                <ExtrasBadges extras={extras} />
              </div>

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
                  'Nombre de creación libre con lectura onomántica'
                ]}
              />
              <div className="md:col-span-2">
                <ExtrasBadges extras={extras} />
              </div>

              {story && <StoryCard tipo={story.tipo} texto={story.relato}/>}
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 text-slate-400 text-sm">
        <p><strong>Onomántica:</strong> análisis por raíces y categorías (virtud, celeste, naturaleza, elementos, teofórico, topónimo). Relatos con tono seleccionable y regenerables sin repetición.</p>
      </footer>
    </div>
  )
}
