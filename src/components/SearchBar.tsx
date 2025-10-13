import { Search } from "lucide-react";
import { useRef } from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
};

export default function SearchBar({ value, onChange, onSubmit }: Props) {
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-3xl relative">
      <input
        ref={ref}
        className="search"
        placeholder="Escribe un nombre…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => (e.key === "Enter" ? onSubmit() : null)}
      />
      <button
        onClick={onSubmit}
        className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary h-10 px-3"
      >
        <Search size={18} />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </div>
  );
}
