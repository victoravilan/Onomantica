import { Share2 } from "lucide-react";

type Props = { onShare?: () => void }

export default function Header({ onShare }: Props) {
  return (
    <header className="hero">
      <div className="container-page py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-grid place-items-center w-10 h-10 rounded-full grad-ring border border-[color:var(--border)]">
            <span className="text-[color:var(--gold)] text-xl">✒️</span>
          </span>
          <div className="leading-tight">
            <div className="h-title">Onomántica</div>
            <div className="text-sm text-slate-300/80">El poder de tu nombre</div>
          </div>
        </div>

        <button onClick={onShare} className="btn btn-primary hidden sm:inline-flex">
          <Share2 size={18} />
          Compartir mi historia
        </button>
      </div>
    </header>
  );
}
