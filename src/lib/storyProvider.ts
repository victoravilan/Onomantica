// src/lib/storyProvider.ts
import { buildStory, type Tone, type StoryContext } from './storyEngine'

export type GenerateInput = {
  nombre: string
  significado: string
  tone: Tone
  seed?: number
  tags?: string[]
  avoid?: string[]
}

export type GenerateOutput = {
  tipo: string
  relato: string
  notas?: string[]
}

export interface StoryProvider {
  generate(input: GenerateInput): Promise<GenerateOutput>
}

// Proveedor local (offline)
export class LocalStoryProvider implements StoryProvider {
  async generate(input: GenerateInput): Promise<GenerateOutput> {
    const out = buildStory(input.tone, {
      nombre: input.nombre,
      significado: input.significado,
      tags: input.tags,
      seed: input.seed,
      avoid: input.avoid
    })
    return { tipo: out.tipo, relato: out.relato, notas: out.notas }
  }
}

// Si más tarde quieres remoto:
// export class RemoteStoryProvider implements StoryProvider {
//   constructor(private url: string){}
//   async generate(input: GenerateInput): Promise<GenerateOutput> {
//     const res = await fetch(this.url, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(input) })
//     if (!res.ok) throw new Error('Remote error')
//     return await res.json()
//   }
// }
