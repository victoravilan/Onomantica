type Props = { tipo: string; texto: string };

export default function StoryCard({ tipo, texto }: Props) {
  return (
    <section className="card p-6 shine card-gold">
      <div className="uppercase tracking-widest text-[12px] text-[color:var(--gold-dim)] mb-2">
        {tipo}
      </div>
      <p className="story">{texto}</p>
    </section>
  );
}
