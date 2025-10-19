import React from "react";
import Card from "./Card";

type Props = { titulo: string; lines: string[]; className?: string };

export default function MeaningCard({ titulo, lines, className }: Props){
  return (
    <Card outlined className={`p-6 ${className ?? ""}`}>
      <div className="text-gold font-semibold mb-3">{titulo}</div>
      <ul className="space-y-2 text-mist/90 leading-relaxed">
        {lines.map((l,i)=> <li key={i} className="list-disc list-inside">{l}</li>)}
      </ul>
    </Card>
  );
}
