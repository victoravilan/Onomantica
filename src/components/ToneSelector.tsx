import React from "react";
import { Flame, Feather, Landmark, Sparkles, RefreshCcw } from "lucide-react";

export type Tone = "épica" | "poética" | "mitológica" | "fantástica";

type Props = {
  value: Tone;
  onChange: (t: Tone) => void;
  onRegenerate: () => void;
};

const tones: { id: Tone; label: string; icon: React.ReactNode; className: string }[] = [
  { id: "épica",       label: "épica",       icon: <Flame className="size-4" />,     className: "tone-epica" },
  { id: "poética",     label: "poética",     icon: <Feather className="size-4" />,   className: "tone-poetica" },
  { id: "mitológica",  label: "mitológica",  icon: <Landmark className="size-4" />,  className: "tone-mitologica" },
  { id: "fantástica",  label: "fantástica",  icon: <Sparkles className="size-4" />,   className: "tone-fantastica" },
];

export default function ToneSelector({ value, onChange, onRegenerate }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {tones.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            className={`tone ${t.className} ${active ? "active" : ""}`}
            onClick={() => onChange(t.id)}
            aria-pressed={active}
            title={`Tono ${t.label}`}
          >
            {t.icon}
            <span className="capitalize">{t.label}</span>
          </button>
        );
      })}

      <button
        type="button"
        className="tone hover:bg-violet-600/15 border-violet-400/30"
        onClick={onRegenerate}
        title="Regenerar historia"
      >
        <RefreshCcw className="size-4" />
        <span>Regenerar</span>
      </button>
    </div>
  );
}
