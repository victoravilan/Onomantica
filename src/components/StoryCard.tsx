import React from 'react'

export default function StoryCard({ tipo, texto }:{ tipo: string, texto: string }) {
  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-700/40 to-fuchsia-600/30 ring-1 ring-indigo-600/40 text-slate-50">
      <div className="uppercase tracking-widest text-xs text-indigo-200 mb-2">Historia {tipo}</div>
      <p className="leading-relaxed">{texto}</p>
    </div>
  )
}
