import React from "react";
import Chip from "./Chip";

export type Tone = "épica" | "poética" | "mitológica" | "fantástica";

type Props = {
  value: Tone;
  onChange: (t: Tone) => void;
  onRegenerate?: () => void;
};

const tones: Tone[] = ["épica","poética","mitológica","fantástica"];

export default function ToneSelector({ value, onChange, onRegenerate }: Props){
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {tones.map(t=>(
        <Chip key={t} active={value === t} onClick={()=>onChange(t)}>
          {t[0].toUpperCase()+t.slice(1)}
        </Chip>
      ))}
      <Chip onClick={onRegenerate}>Regenerar</Chip>
    </div>
  );
}
