import React from "react";
import { Sparkles, Share2 } from "lucide-react";

type Props = {
  onShare?: () => void;
};

export default function Header({ onShare }: Props) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-[#0b1220]/70 border-b border-white/10">
      <div className="container-page py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-9 grid place-items-center rounded-xl bg-violet-500/15 text-violet-300 border border-violet-300/20 shadow-inner">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="heading-hero">Onomántica</h1>
            <p className="subtle">El poder de tu nombre</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className="btn-ghost hidden sm:inline-flex"
            title="Ver en GitHub"
          >
            <svg viewBox="0 0 16 16" className="size-4 fill-slate-200">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.22 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.01.08-2.1 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.09.16 1.9.08 2.1.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.19 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
            <span className="hidden md:inline">GitHub</span>
          </a>

          <button
            type="button"
            className="btn-primary"
            onClick={onShare}
            title="Compartir mi historia"
          >
            <Share2 className="size-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
