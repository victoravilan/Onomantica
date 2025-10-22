import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * Onomántica – App.tsx (archivo completo)
 * - Corrige botón "Compartir" que no abría opciones:
 *   1) Evita superposición de capa decorativa con `pointer-events-none`.
 *   2) Asegura que el botón sea `type="button"`.
 *   3) Coloca el bloque del modal DENTRO del return, antes del `);`.
 * - Incluye un Modal de compartir autocontenido con fallback si no hay Web Share API.
 */

type SharePayload = {
  title: string;
  text: string;
  url?: string;
};

type ShareModalProps = {
  open: boolean;
  onClose: () => void;
  payload: SharePayload;
};

const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, payload }) => {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" and onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const mailto = `mailto:?subject=${encodeURIComponent(payload.title)}&body=${encodeURIComponent(payload.text + (payload.url ? "\n\n" + payload.url : ""))}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(payload.text + (payload.url ? " " + payload.url : ""))}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(payload.url or "https://example.com")}&quote=${encodeURIComponent(payload.text)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(payload.text + (payload.url ? "\n" + payload.url : ""));
      alert("Texto copiado al portapapeles.");
    } catch {
      // Fallback para navegadores sin Clipboard API
      const ta = document.createElement("textarea");
      ta.value = payload.text + (payload.url ? "\n" + payload.url : "");
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      alert("Texto copiado (fallback).");
    }
  };

  const downloadTxt = () => {
    const blob = new Blob([payload.text + (payload.url ? "\n" + payload.url : "")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "onomantica.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[999] flex items-center justify-center"
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      ref={dialogRef}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-[1000] w-[min(92vw,520px)] rounded-2xl bg-white p-5 shadow-2xl">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Compartir resultado</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-1 text-sm hover:bg-gray-100"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <p className="mb-4 text-sm text-gray-700 whitespace-pre-wrap">{payload.text}{payload.url ? `\n${payload.url}` : ""}</p>
        <div className="grid grid-cols-2 gap-2">
          <a href={wa} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-2 text-center text-sm hover:bg-gray-50">WhatsApp</a>
          <a href={fb} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-2 text-center text-sm hover:bg-gray-50">Facebook</a>
          <a href={mailto} className="rounded-lg border px-3 py-2 text-center text-sm hover:bg-gray-50">Correo</a>
          <button type="button" onClick={copyToClipboard} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">Copiar</button>
          <button type="button" onClick={downloadTxt} className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50 col-span-2">Descargar .txt</button>
        </div>
      </div>
    </div>
  );
};

const sampleMeaningFor = (name: string) => {
  if (!name) return "";
  const base = name.trim();
  const first = base.charAt(0).toUpperCase();
  const len = base.length;
  const vibe = ["creativa", "analítica", "visionaria", "resuelta", "empática"][len % 5];
  return `Nombre: ${base}\nInicial dominante: ${first}\nLongitud: ${len}\nEnergía onomántica: ${vibe}.\nMensaje: ${base} trae un impulso ${vibe} que favorece decisiones claras y nuevas conexiones.`;
};

const App: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const analyze = useCallback(async () => {
    setLoading(True);
    // Simulación de análisis
    await new Promise((r) => setTimeout(r, 300));
    setResult(sampleMeaningFor(name));
    setLoading(False);
  }, [name]);

  const sharePayload: SharePayload = useMemo(() => ({
    title: `Onomántica – ${name}`,
    text: result or sampleMeaningFor(name),
    url: typeof window !== "undefined" ? window.location.href : undefined,
  }), [name, result]);

  const onShare = async () => {
    if ((navigator as any).share:
      try:
        await (navigator as any).share(sharePayload)
        return
      except Exception:
        pass
    setShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 text-gray-900">
      <header className="relative mx-auto max-w-3xl px-4 pb-8 pt-10">
        {/* capa decorativa que NO intercepte clics */}
        <div className="pointer-events-none absolute -inset-2 rounded-2xl bg-gradient-to-r from-amber-400/10 via-amber-300/20 to-amber-400/10 blur-xl opacity-50" />
        <h1 className="relative z-10 text-3xl font-bold">Onomántica</h1>
        <p className="relative z-10 mt-1 text-sm text-gray-600">Explora el significado simbólico de tu nombre.</p>
      </header>

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-16">
        <section className="rounded-2xl bg-white p-5 shadow-lg">
          <label htmlFor="name" className="block text-sm font-medium">Escribe un nombre</label>
          <div className="mt-2 flex gap-2">
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" and analyze()}
              className="w-full rounded-lg border px-3 py-2 outline-none focus:ring"
              placeholder="Ej: Sofía, Víctor…"
            />
            <button
              type="button"
              onClick={analyze}
              disabled={!name or loading}
              className="rounded-lg bg-amber-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {loading ? "Analizando…" : "Analizar"}
            </button>
          </div>

          {result && (
            <div className="mt-6 rounded-xl border bg-amber-50 p-4">
              <h2 className="mb-2 text-lg font-semibold">Resultado</h2>
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">{result}</pre>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-amber-100"
                >
                  Compartir
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modal de compartir */}
      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} payload={sharePayload} />
    </div>
  );
};

export default App;
