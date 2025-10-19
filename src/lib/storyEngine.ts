// src/lib/storyEngine.ts
// Motor narrativo local con plantillas, léxicos y variación por semilla + tono.

export type Tone = 'épica' | 'poética' | 'mitológica' | 'fantástica'

export type StoryContext = {
  nombre: string
  significado: string
  tags?: string[]       // ['teoforico','topónimo','virtud','naturaleza','celeste','elemento:agua',...]
  seed?: number
  avoid?: string[]      // anti-repetición por sesión
}

// ---------- utilidades ----------
function hash(s: string): number {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function rng(seed: number) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6D2B79F5) >>> 0
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(r: ()=>number, arr: T[]) {
  return arr[Math.floor(r()*arr.length)]
}

function titleCase(s: string) {
  return s.charAt(0).toUpperCase()+s.slice(1)
}

// ---------- señales onomásticas ----------
export function inferTagsFromName(nombre: string): string[] {
  const k = nombre.toLowerCase()
  const tags: string[] = []
  if (/(?:^|[^a-záéíóúüñ])mar(?:$|[^a-záéíóúüñ])/.test(k)) tags.push('naturaleza','elemento:agua')
  if (/sol/.test(k)) tags.push('celeste','elemento:fuego')
  if (/luna|estre/.test(k)) tags.push('celeste')
  if (/rosa|flor|verna|verde|bosco/.test(k)) tags.push('naturaleza')
  if (/piedad|caridad|fe|esperanza|paz|gloria|prudencia|justicia/.test(k)) tags.push('virtud')
  if (/(?:el|-el\b|\bel)/i.test(nombre)) tags.push('teoforico')
  if (/roma|paris|berna|madrid|lima|quito|cuzco|bogotá|sevilla|napoles|siena|verona|sahara|andorra|ibiza/i.test(nombre)) tags.push('topónimo')
  return Array.from(new Set(tags))
}

// ---------- léxicos por tono ----------
const bank = {
  epica: {
    verbos: ['alzarse','conquistar','resistir','guiar','proteger','vencer','templar'],
    nouns:  ['estandarte','travesía','juramento','legado','hazaña','fortaleza','claridad'],
    cierres:['y el mundo aprendió su nombre','y su paso dejó rutas encendidas','y no hubo sombra que lo venciera']
  },
  poetica: {
    verbos:['florecer','susurrar','anidar','resplandecer','derramarse','soñar','mecerse'],
    nouns: ['bruma','tallo','orilla','luz tibia','cauce','hojarasca','eco'],
    cierres:['como quien aprende a decirse','en la lengua secreta del viento','y la aurora lo pronunció sin prisa']
  },
  mitologica: {
    verbos:['invocar','sellar','descender','alzar','entretejer','nombrar','velar'],
    nouns: ['linaje','augurio','oráculo','piedra sagrada','cántico','vigilia','pacto'],
    cierres:['así lo dejaron escrito los viejos dioses','y los heraldos del cielo lo confirmaron','como dicta la memoria primera']
  },
  fantastica: {
    verbos:['despertar','trazar','doblegar','cabalgar','entreabrir','trenzar','amparar'],
    nouns: ['umbral','cometa domesticado','mapa imposible','reloj de arena vivo','biblioteca de nubes','puente de luciérnagas'],
    cierres:['mientras el horizonte cambiaba de forma','allí donde los relojes aprenden a cantar','y la imaginación tuvo casa']
  }
}

const adornos: Record<string,string[]> = {
  teoforico: [
    'Nombre teofórico: su eco conversa con lo divino.',
    'Porta raíz sagrada: remite a Dios y a promesa.',
  ],
  topónimo: [
    'Topónimo vuelto nombre: hereda camino y territorio.',
    'Suena a tierra y a latido de ciudades antiguas.',
  ],
  virtud: [
    'Virtud hecha nombre: convoca ética y destino.',
    'Nacido de una idea luminosa: guía y alivio.',
  ],
  naturaleza: [
    'Respira naturaleza: agua, bosque y estaciones.',
    'Lleva semillas de cauces y brillos verdes.',
  ],
  celeste: [
    'Línea celeste: constelaciones y mareas internas.',
    'Pertenencia estelar: la noche lo reconoce.',
  ],
  'elemento:agua': ['Matiz de agua: memoria, viaje, renovación.'],
  'elemento:fuego': ['Matiz de fuego: impulso, voluntad, aurora.'],
}

// ---------- plantillas por tono ----------
function plantillaEpica(c: StoryContext, r: ()=>number) {
  const v = bank.epica
  const a = c.tags ?? []
  const intro = `${titleCase(c.nombre)} llevó su ${pick(r,v.nouns)} como quien ${pick(r,v.verbos)} el miedo.`
  const nudo  = `Donde otros dudaron, ${c.nombre} eligió el paso firme y el cielo ancho.`
  const guiño = a.includes('teoforico') ? 'Juró sin romper el hilo que lo unía a lo sagrado.' :
               a.includes('topónimo')  ? 'Sus huellas dibujaron mapas que ya existían en la memoria.' :
               a.includes('virtud')    ? 'La idea que lo nombra fue también su norte.' :
               a.includes('naturaleza')? 'El viento le enseñó a guardar silencio y a decir la verdad.' :
                                           'Aprendió a templar fuerza con ternura.'
  const cierre = pick(r,v.cierres)
  return `${intro} ${nudo} ${guiño} —${cierre}.`
}

function plantillaPoetica(c: StoryContext, r: ()=>number) {
  const v = bank.poetica
  const a = c.tags ?? []
  const intro = `${titleCase(c.nombre)} ${pick(r,v.verbos)} en la ${pick(r,v.nouns)} del tiempo.`
  const nudo  = `De su significado brotó un rumor claro: ${c.significado.toLowerCase()}.`
  const guiño = a.includes('naturaleza')? 'Entre hojas y ríos aprendió a escucharse.' :
               a.includes('celeste')   ? 'Bajo lunas azules, su pulso encontró medida.' :
               a.includes('teoforico') ? 'Cada sílaba le devolvía una oración antigua.' :
               a.includes('virtud')    ? 'Fue semilla de una ética sencilla y profunda.' :
                                          'Y al nombrarse, se salvó.'
  const cierre = pick(r,v.cierres)
  return `${intro} ${nudo} ${guiño} —${cierre}.`
}

function plantillaMitologica(c: StoryContext, r: ()=>number) {
  const v = bank.mitologica
  const a = c.tags ?? []
  const intro = `En el alba de los relatos, ${titleCase(c.nombre)} ${pick(r,v.verbos)} el ${pick(r,v.nouns)}.`
  const nudo  = `Su nombre quiso decir: ${c.significado.toLowerCase()}; y los sacerdotes asentaron la nota.`
  const guiño = a.includes('teoforico') ? 'Era puente entre hombres y dioses, guardián de lo indecible.' :
               a.includes('topónimo')  ? 'Nació de la tierra vieja y de sus casas de piedra.' :
               a.includes('celeste')   ? 'Le obedecían las mareas secretas del cielo.' :
                                          'Su linaje fue tejido con paciencia.'
  const cierre = pick(r,v.cierres)
  return `${intro} ${nudo} ${guiño} —${cierre}.`
}

function plantillaFantastica(c: StoryContext, r: ()=>number) {
  const v = bank.fantastica
  const a = c.tags ?? []
  const intro = `En un lugar que no aparece en los mapas, ${titleCase(c.nombre)} ${pick(r,v.verbos)} un ${pick(r,v.nouns)}.`
  const nudo  = `Su significado actuó como llave: ${c.significado.toLowerCase()}.`
  const guiño = a.includes('naturaleza')? 'Los bosques le contaron rutas que nadie conocía.' :
               a.includes('celeste')   ? 'Una constelación muda le servía de brújula.' :
               a.includes('topónimo')  ? 'El rumor de una ciudad lo seguía como un compañero.' :
                                          'El tiempo, por un instante, fue obediente.'
  const cierre = pick(r,v.cierres)
  return `${intro} ${nudo} ${guiño} —${cierre}.`
}

const builders: Record<Tone,(c:StoryContext, r:()=>number)=>string> = {
  'épica': plantillaEpica,
  'poética': plantillaPoetica,
  'mitológica': plantillaMitologica,
  'fantástica': plantillaFantastica,
}

// ---------- capa pública ----------
export function buildStory(tone: Tone, ctx: StoryContext): { tipo: string; relato: string; notas: string[] } {
  const baseSeed = ctx.seed ?? Date.now()
  const r = rng(baseSeed ^ hash(ctx.nombre) ^ hash(tone))

  // combinar tags inferidas + provistas
  const inferred = inferTagsFromName(ctx.nombre)
  const allTags = Array.from(new Set([...(ctx.tags ?? []), ...inferred]))

  // generar relato
  const texto = builders[tone]({ ...ctx, tags: allTags }, r)

  // anti-repetición simple
  if (ctx.avoid && ctx.avoid.some(t => t === texto)) {
    const r2 = rng(baseSeed + 1337)
    return buildStory(tone, { ...ctx, seed: Math.floor(r2()*1e9) })
  }

  // notas (explican por qué se escogieron ciertos acentos)
  const notas: string[] = []
  for (const t of allTags) if (adornos[t]) notas.push(adornos[t][0])

  return { tipo: tone, relato: texto, notas }
}
