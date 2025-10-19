import React, { useState } from "react";
import { Search } from "lucide-react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props){
  const [local, setLocal] = useState(value);

  function submit(){
    onChange(local);
    onSubmit();
  }

  return (
    <div className="w-full max-w-3xl">
      <div className="search">
        <input
          className="search__input"
          placeholder="Escribe un nombre…"
          value={local}
          onChange={(e)=>setLocal(e.target.value)}
          onKeyDown={(e)=> e.key === "Enter" && submit()}
        />
        <button className="search__btn" onClick={submit}>
          <Search className="h-5 w-5" />
          Buscar
        </button>
      </div>
    </div>
  );
}
