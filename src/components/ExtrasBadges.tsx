import { RuleNote } from "../data/rules";

export default function ExtrasBadges({ extras }: { extras: RuleNote[] }) {
  if (!extras?.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {extras.map((e, i) => (
        <span key={i} className="chip">{e.label}</span>
      ))}
    </div>
  );
}
