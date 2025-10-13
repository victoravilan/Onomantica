import { Sparkles, PenLine, LandPlot, Stars } from "lucide-react";

export type Tone = "épica" | "poética" | "mitológica" | "fantástica";

const OPTIONS: Array<{ key: Tone; icon: any; label: string }> = [
  { key: "épica",       icon: Sparkles, label: "Épica" },
  { key: "poética",     icon: PenLine,  label: "Poética" },
  { key: "mitológica",  icon: LandPlot, label: "Mitológica" },
  { key: "fantástica",  icon: Stars,    label: "Fantástica" },
];

type Props = {
  value: Tone;
  onChange: (t: Tone) => void;
  onRegenerate?: () => void;
};

export default function ToneSelector({ value, onChange, onRegenerate }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {OPTIONS.map(({ key, icon: Icon, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`tone-pill ${value === key ? "tone-pill-active" : ""}`}
        >
          <Icon size={16} className="text-[color:var(--gold)]" />
          <span>{label}</span>
        </button>
      ))}
      <button onClick={onRegenerate} className="tone-pill">
        <span className="w-2.5 h-2.5 rounded-full bg-[color:var(--gold)] mr-2 animate-pulse" />
        Regenerar
      </button>
    </div>
  );
}
