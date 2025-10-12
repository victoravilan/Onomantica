// src/lib/enrich.ts
// Enriquecimiento semántico y de origen a partir de reglas locales.

import {
  THEOPHORIC_SUFFIXES,
  ROOT_GLOSSES,
  TOPONYMS,
  VIRTUE_WORDS,
  CELESTIAL_WORDS,
  NATURE_WORDS,
  ELEMENT_WORDS,
  RuleNote
} from '../data/rules'
import { normalize } from './diacritics'

export type Enrichment = {
  extras: RuleNote[]          // notas (teofórico/raíz/topónimo/virtud/celeste/naturaleza/elemento)
  mergedMeaning?: string      // significado enriquecido (si aplica)
  mergedOrigin?: string       // origen enriquecido (si aplica)
}

export function enrichName(
  nombre: string,
  base?: { significado?: string, origen?: string }
): Enrichment {
  const key = normalize(nombre)
  const extras: RuleNote[] = []

  // 1) Teofórico -el / -iel / -uel
  for (const t of THEOPHORIC_SUFFIXES) {
    if (key.endsWith(t.suf)) {
      extras.push({ kind: 'teoforico', note: t.note })
      break
    }
  }

  // 2) Raíces frecuentes
  for (const r of ROOT_GLOSSES) {
    if (key.includes(r.key)) {
      extras.push({ kind: 'raiz', note: r.note ?? r.gloss })
    }
  }

  // 3) Topónimos exactos (incluye “la verna”)
  for (const t of TOPONYMS) {
    if (key === normalize(t.name)) {
      extras.push({ kind: 'toponimo', note: t.note })
      break
    }
  }

  // 4) Virtudes / Celeste / Naturaleza / Elementos (match exacto)
  const virt = VIRTUE_WORDS.find(v => key === v.key)
  if (virt) extras.push({ kind: 'virtud', note: virt.note })

  const cel = CELESTIAL_WORDS.find(c => key === c.key)
  if (cel) extras.push({ kind: 'celeste', note: cel.note })

  const nat = NATURE_WORDS.find(n => key === n.key)
  if (nat) extras.push({ kind: 'naturaleza', note: nat.note })

  const ele = ELEMENT_WORDS.find(e => key === e.key)
  if (ele) extras.push({ kind: 'elemento', note: ele.note })

  // 5) Fusión de significado y origen
  let mergedMeaning = base?.significado || ''
  let mergedOrigin  = base?.origen || ''

  // Teofórico: menciona Elohim y añade Hebreo al origen si falta
  if (extras.some(e => e.kind === 'teoforico')) {
    const add = ' Lleva elemento teofórico hebreo («El/Elohim»).'
    if (!/Elohim|teofór/i.test(mergedMeaning)) {
      mergedMeaning = (mergedMeaning ? mergedMeaning.trim() + ' ' : '') + add
    }
    if (mergedOrigin && !/Hebre/i.test(mergedOrigin)) {
      mergedOrigin = `${mergedOrigin} / Hebreo`
    } else if (!mergedOrigin) {
      mergedOrigin = 'Hebreo'
    }
  }

  // Raíces: agrega “Matices asociados”
  const rootGlosas = ROOT_GLOSSES.filter(r => key.includes(r.key)).map(r => r.gloss)
  if (rootGlosas.length) {
    const add = ` Matices asociados: ${Array.from(new Set(rootGlosas)).join(', ')}.`
    if (!/Matices asociados/i.test(mergedMeaning)) {
      mergedMeaning = (mergedMeaning ? mergedMeaning.trim() + ' ' : '') + add
    }
  }

  // Virtud/celeste/naturaleza/elemento: añade frase breve si no está
  const addIf = (txt: string) => {
    if (!mergedMeaning.includes(txt)) {
      mergedMeaning = (mergedMeaning ? mergedMeaning.trim() + ' ' : '') + txt
    }
  }

  if (virt) addIf(' Nombre-virtud: expresa valor y orientación ética.')
  if (cel)  addIf(' Resonancia celeste: guía, ciclo y horizonte.')
  if (nat)  addIf(' Impronta de naturaleza: imagen sensorial y estacional.')
  if (ele)  addIf(' Arquetipo elemental activo en su simbolismo.')

  return {
    extras,
    mergedMeaning: mergedMeaning || undefined,
    mergedOrigin:  mergedOrigin  || undefined,
  }
}
