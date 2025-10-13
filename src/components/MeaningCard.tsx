type Props = { titulo: string; lines: string[] };

export default function MeaningCard({ titulo, lines }: Props) {
  return (
    <section className="card p-6 shine">
      <h3 className="h-section mb-3">{titulo}</h3>
      <ul className="space-y-2 text-slate-200/90">
        {lines.map((l, i) => (
          <li key={i} className="flex gap-2">
            <span className="mt-[6px] w-1.5 h-1.5 rounded-full bg-[color:var(--gold)]/80" />
            <span>{l}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
