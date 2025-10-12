import { Search } from 'lucide-react'
import React from 'react'

export default function SearchBar({ value, onChange, onSubmit }:{
  value: string; onChange:(v:string)=>void; onSubmit:()=>void
}) {
  return (
    <div className="flex gap-2 items-center w-full max-w-2xl">
      <input
        className="flex-1 rounded-2xl px-4 py-3 bg-slate-800/60 text-slate-100 placeholder:text-slate-400 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
        placeholder="Escribe tu nombre…"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        onKeyDown={(e)=> e.key==='Enter' && onSubmit()}
      />
      <button
        className="inline-flex items-center gap-2 rounded-2xl px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow"
        onClick={onSubmit}
        aria-label="Buscar"
      >
        <Search size={18}/> Buscar
      </button>
    </div>
  )
}
