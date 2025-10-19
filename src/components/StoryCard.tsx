import React from "react";
import Card from "./Card";

export default function StoryCard({ tipo, texto }:{ tipo: string; texto: string }){
  return (
    <Card outlined className="p-6">
      <div className="section-title mb-2">{tipo}</div>
      <p className="text-[16px] leading-7 text-gold-200/90">
        {texto}
      </p>
    </Card>
  );
}
