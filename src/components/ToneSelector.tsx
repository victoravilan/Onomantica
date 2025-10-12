// src/components/ToneSelector.tsx
import React from 'react'
import type { Tone } from '../lib/stories'

const TONES: Tone[] = ['épica','poética','mitológica','fantástica']

export default function ToneSelector({
  value, onChange, onRegenerate
}:{
  value: Tone
  onChange: (t: Tone) => void
  onRegenerate: () => void
}){
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <div className="text-sm text-slate-400">Tono:</div>
      <div className="flex gap-2">
        {TONES.map(t => (
          <button
            key={t}
            onClick={()=>onChange(t)}
            className={`px-3 py-1.5 rounded-xl text-sm border
              ${value===t
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'}`}>
            {t}
          </button>
        ))}
      </div>
      <button
        onClick={onRegenerate}
        className="ml-2 px-3 py-1.5 rounded-xl text-sm bg-slate-700 hover:bg-slate-600 text-white border border-slate-600">
        Regenerar
      </button>
    </div>
  )
}
