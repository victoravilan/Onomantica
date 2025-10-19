// netlify/functions/story.ts
import type { Handler } from '@netlify/functions'
import { generateStory, type Tone } from '../../src/lib/stories'

type StoryRequest = {
  nombre: string
  significado: string
  tone: Tone
  seed: number
  tags: string[]
  avoid?: string[]
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }
  try {
    const body = JSON.parse(event.body || '{}') as StoryRequest

    const out = generateStory(body.nombre, body.significado, {
      tone: body.tone,
      seed: body.seed,
      tags: body.tags,
      avoid: body.avoid
    })

    return { statusCode: 200, body: JSON.stringify(out) }
  } catch (err: any) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Story function error', detail: String(err?.message || err) }) }
  }
}
