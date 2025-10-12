// src/components/ExtrasBadges.tsx
import React from 'react'
import type { RuleNote } from '../data/rules'

function kindStyle(kind: RuleNote['kind']) {
  switch (kind) {
    case 'teoforico': return 'bg-amber-900/40 text-amber-200 border-amber-800'
    case 'toponimo':  return 'bg-emerald-900/40 text-emerald-200 border-emerald-800'
    case 'virtud':    return 'bg-pink-900/40 text-pink-200 border-pink-800'
    case 'celeste':   return 'bg-sky-900/40 text-sky-200 border-sky-800'
    case 'naturaleza':return 'bg-green-900/40 text-green-200 border-green-800'
    case 'elemento':  return 'bg-indigo-900/40 text-indigo-200 border-indigo-800'
    case 'raiz':      return 'bg-slate-800 text-slate-200 border-slate-700'
    default:          return 'bg-slate-800 text-slate-200 border-slate-700'
  }
}

function kindLabel(kind: RuleNote['kind']) {
  switch (kind) {
    case 'teoforico': return 'Teofórico'
    case 'toponimo':  return 'Topónimo'
    case 'virtud':    return 'Virtud'
    case 'celeste':   return 'Celeste'
    case 'naturaleza':return 'Naturaleza'
    case 'elemento':  return 'Elemento'
    case 'raiz':      return 'Raíz'
    default:          return 'Nota'
  }
}

export default function ExtrasBadges({ extras }: { extras: RuleNote[] }) {
  if (!extras?.length) return null
  return (
    <div className="mt-3">
      <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Notas</div>
      <div className="flex flex-wrap gap-2">
        {extras.map((e, i) => (
          <span
            key={i}
            className={`text-xs border rounded-full px-2 py-1 ${kindStyle(e.kind)}`}
            title={e.note}
          >
            {kindLabel(e.kind)} — {e.note}
          </span>
        ))}
      </div>
    </div>
  )
}
