// api/story.ts (Vercel)
import type { VercelRequest, VercelResponse } from '@vercel/node'

// (Opcional) puedes importar tu propio generador local para fallback:
import { generateStory, type Tone } from '../src/lib/stories'

type StoryRequest = {
  nombre: string
  significado: string
  tone: Tone
  seed: number
  tags: string[]
  avoid?: string[]
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' })
    return
  }

  try {
    const body = req.body as StoryRequest

    // ─────────────────────────────────────────────────────────
    // AQUI iría tu llamada a un LLM/servicio externo si quieres.
    // Por ahora: usamos el generador local como stub serio.
    // ─────────────────────────────────────────────────────────
    const out = generateStory(body.nombre, body.significado, {
      tone: body.tone,
      seed: body.seed,
      tags: body.tags,
      avoid: body.avoid
    })

    res.status(200).json(out)
  } catch (err: any) {
    res.status(500).json({ error: 'Story endpoint error', detail: String(err?.message || err) })
  }
}
