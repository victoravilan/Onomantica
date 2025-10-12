// src/lib/stories.ts
// Generación de micro-relatos con alta variación, condicionados por tono/tags/nombre,
// y con control para evitar repeticiones en la misma sesión.

export type Tone = 'mitológica' | 'poética' | 'épica' | 'fantástica'

export type StoryOpts = {
  tone?: Tone
  seed?: number
  tags?: string[]              // p.ej. ['celeste','naturaleza','elemento:agua','virtud','teoforico','toponimo','raiz:luc']
  avoid?: string[]             // relatos que NO debemos repetir (antirrepetición por sesión)
  nameHint?: string            // para personalizar ritmos por nombre (opcional)
}

type Slice = string | ((ctx: Ctx) => string)
type Pattern = (ctx: Ctx) => string

type Bank = { lines: Slice[] }
type Banks = Record<'celeste'|'naturaleza'|'elemento'|'virtud'|'teoforico'|'toponimo'|'raiz'|'neutro', Bank>

type Ctx = {
  nombre: string
  significado: string
  tone: Tone
  tags: string[]
  rnd: () => number
  pick: <T>(arr: T[]) => T
  pickN: <T>(arr: T[], n: number, distinct?: boolean) => T[]
}

// —————————————————————————————————————————————
// Bancos temáticos más amplios (≥ 8 por cada uno para variación real)
// —————————————————————————————————————————————
const BANKS: Banks = {
  celeste: {
    lines: [
      'bajo un cielo que aprende a nombrar sus propios vientos',
      'siguiendo astros que orientan sin pedir nada a cambio',
      'cuando la noche se abre como un mapa de brasas',
      'escuchando el pulso discreto de constelaciones antiguas',
      'contando estaciones por el brillo que cambia de sitio',
      'dejando que una estrella menor marque el compás',
      'entre dos eclipses que enseñan a mirar',
      'donde el horizonte parece hablar primero',
    ]
  },
  naturaleza: {
    lines: [
      'con el rumor vegetal que crece sin prisa',
      'entre corolas que saben de belleza y de espinas',
      'con la paciencia de las estaciones que vuelven',
      'en el humus donde brota lo que parecía perdido',
      'con brisa de valle que arregla lo torcido',
      'cuando la semilla aprende el alfabeto de la tierra',
      'en la sombra de un árbol que recuerda lluvias',
      'como rastro de polen sobre los dedos',
    ]
  },
  elemento: {
    lines: [
      'como agua que aprende la forma del recipiente y lo rebasa',
      'como fuego que calienta más de lo que quema',
      'como aire que lleva noticias y calma',
      'como tierra que sostiene incluso en silencio',
      'como bruma que oculta para enseñar de otro modo',
      'como marejada que limpia la orilla',
      'como piedra que escucha y no olvida',
      'como trueno que avisa sin ponerse al centro',
    ]
  },
  virtud: {
    lines: [
      'guardando una brújula ética que no presume',
      'cuando la esperanza deja de ser consigna y se vuelve gesto',
      'con una piedad que mira y actúa sin ruido',
      'haciendo sitio donde otros sólo disputan',
      'dando nombre a lo frágil para cuidarlo mejor',
      'con justicia que aprende a escuchar primero',
      'teniendo el coraje de pedir perdón a tiempo',
      'sin confundir prudencia con miedo',
    ]
  },
  teoforico: {
    lines: [
      'portando un eco antiguo del Nombre',
      'con una invocación breve que acompaña y no pesa',
      'como si una promesa quedara prendida en el sonido',
      'guardando un timbre que se sabe llamado',
      'sin alarde, con un recuerdo de altar',
      'como quien firma con un trazo prestado del cielo',
      'con obediencia que no rompe la espalda',
      'y un silencio que se vuelve compañía',
    ]
  },
  toponimo: {
    lines: [
      'con la memoria de una geografía que cambió viajeros',
      'entre piedras que guardan voces de otros siglos',
      'siguiendo una ruta donde el lugar también nombra',
      'con olor a mapas gastados por el uso',
      'donde el empedrado enseña paciencia',
      'como campana que aún vibra en la plaza',
      'con un puente que recuerda por qué fue puesto',
      'en una colina que sabe de promesas',
    ]
  },
  raiz: {
    lines: [
      'anudando herencias sin quedar atrapado en ellas',
      'cuando la etimología se vuelve músculo y hábito',
      'construyendo presente desde las raíces, no sobre ellas',
      'recordando que el origen orienta, no encierra',
      'abriendo los viejos cajones para usar las herramientas',
      'dejando que la tradición respire',
      'limpiando el óxido sin borrar la marca',
      'probando que la linterna también alumbra hacia atrás',
    ]
  },
  neutro: {
    lines: [
      'sin estridencias, con una claridad que no pretende brillantez',
      'aprendiendo a perder para poder ganar con sentido',
      'cuidando lo que crece, incluso cuando nadie mira',
      'guardando pequeñas victorias que no necesitan aplauso',
      'prefiriendo el pulso firme al ruido',
      'sin confundir prisa con impulso',
      'midendo la fuerza para no romper lo necesario',
      'dejando que la luz llegue por su propio camino',
    ]
  }
}

// —————————————————————————————————————————————
// Plantillas por tono (varias por tono para diversidad)
// —————————————————————————————————————————————
const TEMPLATES: Record<Tone, Pattern[]> = {
  mitológica: [
    ({ nombre, significado, pick }) =>
`${nombre} fue escrito en un margen del atlas que no aparece en clase.
Dicen que su nombre guarda ${toLowerFirst(significado)}.
${capitalize(pick(mixLines(['mito'])))}
Quien lo lleva aprende a reconocer el umbral y cruzarlo.`,
    ({ nombre, significado, pick }) =>
`No en los templos, sino en el aire común, se pronunció ${nombre}.
Su trazo recuerda ${toLowerFirst(significado)}.
${capitalize(pick(mixLines(['mito'])))}`
  ],
  poética: [
    ({ nombre, significado, pick }) =>
`${nombre} suena a paso bien puesto.
${capitalize(pick(mixLines(['poe'])))} 
Su significado —${significado}— no adorna: acompasa la marcha.`,
    ({ nombre, significado, pick }) =>
`A veces ${nombre} cae como gota; a veces, como martillo suave.
${capitalize(pick(mixLines(['poe'])))}
Queda un rastro limpio que explica ${toLowerFirst(significado)}.`
  ],
  fantástica: [
    ({ nombre, significado, pick }) =>
`En el taller donde se reparan relojes del tiempo, ${nombre} es contraseña.
${capitalize(pick(mixLines(['fan'])))} 
Quien responde vuelve con algo pequeño y verdadero: ${toLowerFirst(significado)}.`,
    ({ nombre, significado, pick }) =>
`En la puerta sin pomo, ${nombre} sirve de llave.
${capitalize(pick(mixLines(['fan'])))} 
La historia no se infla: se entiende. Y eso basta.`
  ],
  épica: [
    ({ nombre, significado, pick }) =>
`${nombre} entendió pronto que el impulso vence al ruido.
${capitalize(pick(mixLines(['epi'])))} 
Por eso su paso deja camino y su significado —${significado}— encuentra oficio.`,
    ({ nombre, significado, pick }) =>
`${nombre} camina sin escolta.
${capitalize(pick(mixLines(['epi'])))} 
Donde muchos hacen humo, prefiere ${toLowerFirst(significado)}.`
  ],
}

// “mezclador” según etiquetas reales del nombre
function mixLines(modes: ('mito'|'poe'|'fan'|'epi')[]) {
  return (ctx: Ctx) => {
    // mapear etiquetas a pools
    const pools: string[] = []
    const has = (k: string) => ctx.tags.some(t => t === k || t.startsWith(k + ':'))

    if (has('celeste'))   pools.push(...stringify(BANKS.celeste.lines, ctx))
    if (has('naturaleza'))pools.push(...stringify(BANKS.naturaleza.lines, ctx))
    if (has('elemento'))  pools.push(...stringify(BANKS.elemento.lines, ctx))
    if (has('virtud'))    pools.push(...stringify(BANKS.virtud.lines, ctx))
    if (has('teoforico')) pools.push(...stringify(BANKS.teoforico.lines, ctx))
    if (has('toponimo'))  pools.push(...stringify(BANKS.toponimo.lines, ctx))
    if (has('raiz'))      pools.push(...stringify(BANKS.raiz.lines, ctx))

    if (!pools.length) pools.push(...stringify(BANKS.neutro.lines, ctx))

    // elige 2–3 frases distintas y combínalas
    const count = 2 + Math.floor(ctx.rnd() * 2)
    const chosen = pickN(pools, count, true, ctx)
    return chosen.join(' ')
  }
}

// —————————————————————————————————————————————
// API pública
// —————————————————————————————————————————————
export function generateStory(nombre: string, significado: string, opts: StoryOpts = {}) {
  const tone: Tone = opts.tone ?? 'épica'
  const seed = Math.abs((opts.seed ?? 0) + hash(nombre + '|' + significado + '|' + tone))
  const rnd = mulberry32(seed)
  const pick = <T,>(arr: T[]) => arr[Math.floor(rnd() * arr.length)]!
  const pickN = <T,>(arr: T[], n: number, distinct = false) => {
    if (!distinct || n >= arr.length) return Array.from({ length: n }, () => pick(arr))
    const copy = [...arr]
    const out: T[] = []
    for (let i = 0; i < n; i++) out.push(copy.splice(Math.floor(rnd() * copy.length), 1)[0]!)
    return out
  }

  const ctx: Ctx = { nombre, significado, tone, tags: opts.tags ?? [], rnd, pick, pickN }

  // selecciona una plantilla al azar dentro del tono
  const candidates = TEMPLATES[tone]
  let attempts = 0
  let out = ''
  const avoidSet = new Set(opts.avoid ?? [])

  while (attempts < 8) {
    const pat = pick(candidates)
    const text = pat(ctx)
    if (!avoidSet.has(text)) { out = text; break }
    attempts++
  }
  // último recurso: si todo repetía, agrega una cola variada
  if (!out) {
    out = pick(candidates)(ctx) + '\n' + capitalize(mixLines(['epi'])(ctx))
  }

  return { tipo: tone, relato: out }
}

export function storyForKnown(nombre: string, significado: string, opts: StoryOpts = {}) {
  return generateStory(nombre, significado, opts)
}
export function storyForConstructed(nombre: string, significado: string, opts: StoryOpts = {}) {
  return generateStory(nombre, significado, opts)
}

// —————————————————————————————————————————————
// Utilidades
// —————————————————————————————————————————————
function stringify(arr: Slice[], ctx: Ctx) {
  return arr.map(s => typeof s === 'function' ? s(ctx) : s)
}
function mulberry32(a: number) {
  return function() {
    let t = a += 0x6D2B79F5
    t = Math.imul(t ^ t >>> 15, t | 1)
    t ^= t + Math.imul(t ^ t >>> 7, t | 61)
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}
function hash(s: string){ let h = 0; for (let i=0;i<s.length;i++) h = (h*31 + s.charCodeAt(i))|0; return h }
function capitalize(s: string){ return s.charAt(0).toUpperCase() + s.slice(1) }
function toLowerFirst(s: string){ return s.length ? s.charAt(0).toLowerCase() + s.slice(1) : s }
function pickN<T>(arr: T[], n: number, distinct: boolean, ctx: Ctx){ return ctx.pickN(arr, n, distinct) }
