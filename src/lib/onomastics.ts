import { normalize } from './diacritics'

// Mapa mínimo de raíces onomásticas (añade/afina las que quieras)
const ROOTS: Record<string, { origen: string, glosa: string }> = {
  'bel': { origen: 'Semítico', glosa: 'señor, brillante' },
  'el':  { origen: 'Hebreo', glosa: 'Dios, divino' },
  'ana': { origen: 'Hebreo', glosa: 'gracia, compasión' },
  'kar': { origen: 'Indoario', glosa: 'hacer, crear' },
  'mir': { origen: 'Eslavo', glosa: 'paz, admiración' },
  'val': { origen: 'Latín', glosa: 'fuerza, coraje' },
  'leo': { origen: 'Griego/Latín', glosa: 'león, valentía' },
  'soph':{ origen: 'Griego', glosa: 'sabiduría' },
  'aid': { origen: 'Celta', glosa: 'fuego, ardor' },
  'yas': { origen: 'Persa', glosa: 'gloria' },
  'kai': { origen: 'Polinesio/Chino', glosa: 'mar, apertura / victoria' }
}

export type Analysis = {
  limpio: string,
  tokens: string[],
  matches: { raiz: string, origen: string, glosa: string }[]
}

export function analyzeName(input: string): Analysis {
  const limpio = normalize(input)
  // tokeniza por sílabas simples (heurística) y ventanas de 2-4 caracteres
  const tokens = limpio.match(/[a-zñ]+/g)?.[0]?.split(/(?<=[aeiou])/g).filter(Boolean) ?? [limpio]
  const matches: Analysis['matches'] = []
  const windows = new Set<string>()
  for (let i=0; i<limpio.length; i++){
    for (let j=2; j<=4 && i+j<=limpio.length; j++){
      windows.add(limpio.slice(i,i+j))
    }
  }
  for (const w of windows){
    if (ROOTS[w]) matches.push({ raiz: w, origen: ROOTS[w].origen, glosa: ROOTS[w].glosa })
  }
  return { limpio, tokens, matches }
}
