import React from 'react'

export default function MeaningCard({ titulo, lines }:{ titulo: string, lines: string[] }) {
  return (
    <div className="p-5 rounded-2xl bg-slate-800/50 ring-1 ring-slate-700 text-slate-200">
      <h3 className="text-slate-100 font-semibold mb-2">{titulo}</h3>
      <ul className="list-disc ml-5 space-y-1">
        {lines.map((l,i)=><li key={i}>{l}</li>)}
      </ul>
    </div>
  )
}
