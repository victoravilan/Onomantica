// src/lib/compound.ts
// Análisis y fusión de nombres compuestos: “Ana Sofía”, “Juan-Pablo”, y portmanteau “Marisol”.

import type { NombreItem } from '../types'
import { normalize } from './diacritics'
import { enrichName } from './enrich'
import { COMPOSITE_PARTS } from '../data/rules'

export type CompoundResult = {
  nombre: string
  partes: { nombre: string, hit?: NombreItem }[]
  origen: string
  significado: string
}

/**
 * Dado un input con 2+ partes separadas (espacio/guion) o un posible
 * portmanteau (sin espacio), intenta:
 *  1) Resolver cada parte por lookup/enriquecimiento
 *  2) Fusionar orígenes y sentidos
 *  3) Devolver un resultado compuesto
 */
export function analyzeCompound(
  input: string,
  byKey: Map<string, NombreItem>
): CompoundResult | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Caso 1: partes “claras” (espacio o guion)
  let tokens = trimmed.split(/[\s\-]+/).filter(Boolean)

  // Caso 2: portmanteau (sin espacio). Intento heurístico (mar+sol, rosa+maria, etc.)
  if (tokens.length === 1) {
    const k = normalize(trimmed)
    const hits: string[] = []
    let idx = 0

    // greedy: intenta partir usando COMPOSITE_PARTS en orden (prefiere claves más largas)
    const parts = [...COMPOSITE_PARTS].sort((a,b)=>b.key.length - a.key.length)

    while (idx < k.length) {
      let matched = false
      for (const p of parts) {
        if (k.slice(idx).startsWith(p.key)) {
          hits.push(k.slice(idx, idx + p.key.length))
          idx += p.key.length
          matched = true
          break
        }
      }
      if (!matched) { // avanza 1 y sigue (evita bucle)
        hits.push(k[idx])
        idx += 1
      }
    }

    // compacta letras sueltas contiguas si no sirvieron
    // y filtra piezas muy pequeñas
    const cleaned: string[] = []
    for (const h of hits) {
      if (h.length === 1 && /^[a-z]$/.test(h)) {
        // junta con la última si era letra suelta
        if (cleaned.length && cleaned[cleaned.length - 1].length === 1) {
          cleaned[cleaned.length - 1] += h
        } else {
          cleaned.push(h)
        }
      } else {
        cleaned.push(h)
      }
    }

    // si detectamos al menos dos “claves” reales (p.ej., mar + sol)
    const realKeys = cleaned.filter(x => COMPOSITE_PARTS.some(p => p.key === x))
    if (realKeys.length >= 2) {
      tokens = realKeys // tratamos como partes
    }
  }

  if (tokens.length < 2) return null

  const partes = tokens.map(t => {
    const k = normalize(t)
    return { nombre: t, hit: byKey.get(k) }
  })

  const origenes = new Set<string>()
  const sentidos: string[] = []

  for (const p of partes) {
    if (p.hit) {
      if (p.hit.origen) origenes.add(p.hit.origen)
      if (p.hit.significado) sentidos.push(p.hit.significado)
    } else {
      // Parte no encontrada: enriquecer por reglas
      const enr = enrichName(p.nombre)
      if (enr.mergedOrigin)  origenes.add(enr.mergedOrigin)
      if (enr.mergedMeaning) sentidos.push(enr.mergedMeaning)
    }
  }

  const origen = Array.from(origenes).join(' / ') || 'Composición moderna'
  let significado = ''
  if (sentidos.length >= 2) {
    significado = `Fusión de sentidos: ${sentidos.join(' + ')}.`
  } else if (sentidos.length === 1) {
    significado = sentidos[0]
  } else {
    significado = 'Combinación de dos nombres con identidad propia.'
  }

  return {
    nombre: tokens.map(t => t[0].toUpperCase() + t.slice(1)).join(' '),
    partes,
    origen,
    significado,
  }
}
