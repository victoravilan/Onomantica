import type { NombreItem, HistoriaTipo } from '../types'
import { analyzeName } from './onomastics'

const pick = <T>(arr: T[]) => arr[Math.floor(Math.random()*arr.length)]

const tones: Record<HistoriaTipo, (n: string)=>string> = {
  'bíblica': (n) => `${n} aparece en tradiciones que hablan de fe que atraviesa pruebas y renueva el corazón. Aprende a escuchar el silencio, decidir con conciencia y agradecer cada avance; ante la angustia, confía; ante el éxito, comparte.`,
  'histórica': (n) => `Crónicas y memorias ligan a ${n} con decisiones firmes y horizontes abiertos. No presume la victoria: la construye con respeto, palabra y servicio, encendiendo esperanza concreta donde otros renuncian.`,
  'mitológica': (n) => `Los relatos antiguos murmuran que ${n} cruzó valles guiado por un juramento de honor. No vencía por fuerza, sino por templanza. Cada paso dejaba centellas sobre la piedra húmeda.`,
  'poética': (n) => `Cuando alguien susurra ${n}, una brisa limpia aquieta dudas. El nombre guarda rumor de agua clara y belleza sencilla: basta un gesto exacto y una decisión valiente en el momento justo.`,
  'fantástica': (n) => `En un bosque sin coordenadas, ${n} halló una lámpara hecha de auroras. Cuando alguien se pierde, abre un sendero de luciérnagas: guía sin imponer, convierte sombras en señales y recuerda el camino a casa.`
}

export function storyFromKnown(item: NombreItem): string {
  // respeta el tipo, pero refresca el texto para evitar repetición literal del dataset
  const f = tones[item.historia.tipo]
  return f ? f(item.nombre) : tones['poética'](item.nombre)
}

export function meaningFromRoots(name: string) {
  const a = analyzeName(name)
  if (a.matches.length === 0) {
    return {
      origen: 'Mixto',
      significado: `Nombre moderno de creación libre; suena a búsqueda de identidad, creatividad y fortaleza interior con vocación luminosa.`,
      rasgos: []
    }
  }
  const glosas = a.matches.map(m => m.glosa)
  const origenes = Array.from(new Set(a.matches.map(m => m.origen))).join(', ')
  return {
    origen: origenes || 'Mixto',
    significado: `Nombre compuesto con ecos antiguos: ${glosas.join(', ')}; sugiere carácter sereno, visión creativa y coraje para sostener decisiones justas.`,
    rasgos: glosas
  }
}

export function storyFromConstructed(name: string): { tipo: HistoriaTipo, relato: string } {
  const { significado } = meaningFromRoots(name)
  const base = [
    `Dicen que ${name} nació de sílabas que se buscaban como ríos confluentes.`,
    `En su eco conviven memorias antiguas y promesas nuevas.`,
    `Quien lleva ${name} aprende a nombrar el mundo con ternura valiente:`,
    `convertir tropiezos en señales, y silencios en mapas que orientan.`,
    `Así, el significado que lo sostiene —${significado}— se vuelve faro cotidiano.`
  ].join(' ')
  return { tipo: 'poética', relato: base }
}
