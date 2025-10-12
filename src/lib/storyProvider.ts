// src/lib/storyProvider.ts
// Abstracción de proveedor de historias: Local (reglas) y Remote (stub /api/story).
// Así puedes activar un backend/LLM sin tocar la UI. También define un "comando" interno.

import { generateStory, type Tone } from './stories'

export type StoryRequest = {
  nombre: string
  significado: string
  tone: Tone
  seed: number
  tags: string[]
  avoid?: string[]      // lista de relatos ya vistos para evitar repetición
}

export type StoryResponse = { tipo: string; relato: string }

export interface StoryProvider {
  generate(req: StoryRequest): Promise<StoryResponse>
}

// —————————————————————————————————————————————
// Proveedor LOCAL (reglas de stories.ts)
// —————————————————————————————————————————————
export class LocalStoryProvider implements StoryProvider {
  async generate(req: StoryRequest): Promise<StoryResponse> {
    const out = generateStory(req.nombre, req.significado, {
      tone: req.tone,
      seed: req.seed,
      tags: req.tags,
      avoid: req.avoid
    })
    return out
  }
}

// —————————————————————————————————————————————
// Proveedor REMOTO (stub): POST /api/story
// Espera un JSON con la misma estructura de StoryRequest.
// Devuelve { tipo, relato }. Implementa tu serverless a gusto.
// —————————————————————————————————————————————
export class RemoteStoryProvider implements StoryProvider {
  constructor(private endpoint = '/api/story') {}
  async generate(req: StoryRequest): Promise<StoryResponse> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req)
    })
    if (!res.ok) throw new Error(`Remote story error HTTP ${res.status}`)
    const data = await res.json()
    // saneo básico
    return { tipo: String(data.tipo ?? req.tone), relato: String(data.relato ?? '') }
  }
}

/**
 * “Comando interno” sugerido (por si expones en UI una mini consola):
 * 
 *   /onomantica:story nombre="Marisol" tone="poética" tags="celeste,naturaleza,elemento:agua"
 * 
 * Lo parseas en la app y llamas a StoryProvider.generate con esos params.
 */
