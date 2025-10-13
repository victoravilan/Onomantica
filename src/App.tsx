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

  // Antirrepetición por (nombre|tono)
  const seenRef = useRef<Map<string, Set<string>>>(new Map())

  // —— PROVEEDOR ——
  // Opción A (segura): arranca en LOCAL.
  const providerRef = useRef<StoryProvider>(
    new LocalStoryProvider()
  )

  // Opción B (si ya tienes endpoint en marcha), cambia aquí:
  // const providerRef = useRef<StoryProvider>(
  //   new RemoteStoryProvider('/api/story')               // Vercel
  //   // new RemoteStoryProvider('/.netlify/functions/story') // Netlify
  // )

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await loadDataset()
        setRaw(data)
      }catch(e:any){
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

  /**
   * Genera historia con posibilidad de forzar tono/semilla/tags (overrides).
   * Evita lag al cambiar de tono (usa el nuevo de inmediato).
   */
  async function makeStory(
    nombre: string,
    significado: string,
    overrides?: { tone?: Tone; seed?: number; tags?: string[] }
  ) {
    const usedTone: Tone = overrides?.tone ?? tone
    const usedSeed: number = overrides?.seed ?? seed
    const usedTags: string[] = overrides?.tags ?? tags

    const key = `${normalize(nombre)}|${usedTone}`
    const avoid = getAvoid(key)
    let provider = providerRef.current

    try {
      const out = await provider.generate({ nombre, significado, tone: usedTone, seed: usedSeed, tags: usedTags, avoid })
      registerSeenKey(key, out.relato)
      setStory({ tipo: out.tipo, relato: out.relato })
    } catch (err) {
      console.warn('Proveedor remoto falló, usando Local:', err)
      provider = new LocalStoryProvider()
      providerRef.current = provider
      const out = await provider.generate({ nombre, significado, tone: usedTone, seed: usedSeed, tags: usedTags, avoid })
      registerSeenKey(key, out.relato)
      setStory({ tipo: out.tipo, relato: out.relato })
    }
  }

  /** Regenera con nueva semilla y el tono actual */
  function regenerateCurrent() {
    const newSeed = (Date.now() | 0) ^ Math.floor(Math.random() * 1e9)
    setSeed(newSeed)
    if (hit) {
      void makeStory(hit.nombre, hit.significado, { seed: newSeed })
    } else if (fallback) {
      void makeStory(q.trim(), fallback.significado, { seed: newSeed })
    }
  }

  /** Cambio de tono — regenera inmediatamente con el **nuevo** tono */
  function handleToneChange(t: Tone) {
    setTone(t)
    if (hit) {
      void makeStory(hit.nombre, hit.significado, { tone: t })
    } else if (fallback) {
      void makeStory(q.trim(), fallback.significado, { tone: t })
    }
  }

  async function submit(){
    const name = q.trim()
    if (!name) return

    const key = normalize(name)
    const newSeed = (Date.now() | 0)
    setSeed(newSeed)
    setExtras([])

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

        await makeStory(comp.nombre, compEnrich.mergedMeaning ?? comp.significado, { seed: newSeed })
        return
      }
    }

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

      await makeStory(enriched.nombre, enriched.significado, { seed: newSeed })
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

      await makeStory(name, invEnr.mergedMeaning ?? synth.significado, { seed: newSeed })
    }
  }

  const a = q ? analyzeName(q) : null

  return (
    <div className="min-h-screen text-slate-100 antialiased relative overflow-x-hidden bg-[radial-gradient(1500px_700px_at_60%_-10%,rgba(157,115,255,.15),transparent_60%),radial-gradient(1200px_600px_at_-10%_20%,rgba(32,199,255,.07),transparent_55%),#070a12]">
      {/* halos decorativos */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-28 -left-28 h-80 w-80 rounded-full bg-gradient-to-tr from-indigo-500/25 via-fuchsia-400/20 to-cyan-300/20 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-gradient-to-tr from-cyan-400/20 via-indigo-400/20 to-fuchsia-400/20 blur-3xl" />
      </div>

      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-slate-950/55 border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-300/80 via-yellow-200/70 to-white/70 text-slate-900 shadow-[0_0_40px_rgba(249,200,109,.25)]">✒️</span>
            <h1 className="font-display text-xl md:text-2xl bg-clip-text text-transparent bg-[linear-gradient(90deg,#F9D47A_0%,#F5C06A_30%,#E9B55F_60%,#F9D47A_100%)] drop-shadow-[0_1px_0_rgba(0,0,0,.15)]">
              Onomántica
            </h1>
          </div>
          <div className="text-[13px] md:text-sm text-slate-300/80">
            <span className="mr-2">PWA</span>•<span className="mx-2">Offline</span>•<span className="ml-2">Historias de nombres</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-col items-center gap-6">
          <div className="w-full">
            <SearchBar value={q} onChange={setQ} onSubmit={submit}/>
          </div>

          {!error && raw && (
            <div className="text-sm text-slate-400/80">
              Dataset cargado: <span className="text-slate-200">{raw.length}</span> nombres
            </div>
          )}
          {error && <div className="text-rose-400 text-sm">{error}</div>}

          {(hit || fallback) && (
            <div className="w-full max-w-2xl">
              <ToneSelector
                value={tone}
                onChange={handleToneChange}
                onRegenerate={regenerateCurrent}
              />
            </div>
          )}

          {!hit && !fallback ? <EmptyState/> : null}

          {hit && (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <div className="glass-panel">
                <MeaningCard
                  titulo={`${hit.nombre} — ${hit.origen} • ${hit.genero}`}
                  lines={[
                    `Significado: ${hit.significado}`,
                    `Tipo de historia: ${story?.tipo ?? hit.historia.tipo}`
                  ]}
                />
              </div>

              <div className="md:col-span-2">
                <ExtrasBadges extras={extras} />
              </div>

              {a && (
                <div className="glass-panel">
                  <MeaningCard
                    titulo="Desglose onomástico (eco de raíces)"
                    lines={[
                      `Normalizado: ${a.limpio}`,
                      a.matches.length
                        ? `Coincidencias: ${a.matches.map(m=>`${m.raiz} (${m.glosa})`).join(', ')}`
                        : 'Sin coincidencias claras: nombre plenamente original'
                    ]}
                  />
                </div>
              )}

              {story && (
                <div className="md:col-span-2 glass-panel">
                  <StoryCard tipo={story.tipo} texto={story.relato}/>
                </div>
              )}
            </div>
          )}

          {fallback && (
            <div className="grid md:grid-cols-2 gap-4 w-full">
              <div className="glass-panel">
                <MeaningCard
                  titulo={`${q.trim()} — ${fallback.origen}`}
                  lines={[
                    `Significado estimado: ${fallback.significado}`,
                    'Nombre de creación libre con lectura onomántica'
                  ]}
                />
              </div>

              <div className="md:col-span-2">
                <ExtrasBadges extras={extras} />
              </div>

              {story && (
                <div className="md:col-span-2 glass-panel">
                  <StoryCard tipo={story.tipo} texto={story.relato}/>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 pb-10 text-slate-400/85 text-sm">
        <p className="leading-relaxed">
          <strong className="text-slate-200/90">Onomántica:</strong> análisis por raíces y categorías
          (virtud, celeste, naturaleza, elementos, teofórico, topónimo). Relatos con tono seleccionable y
          regenerables sin repetición.
        </p>
      </footer>
    </div>
  )
}
