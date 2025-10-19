export default function Header() {
  return (
    <header className="hero">
      <div className="container-page py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-grid place-items-center w-10 h-10 rounded-full border border-white/15 bg-ring-grad">
            <span className="text-gold text-xl">✒️</span>
          </span>
          <div className="leading-tight">
            <div className="h-title">Onomántica</div>
            <div className="text-sm text-yellow-200/70">El poder de tu nombre</div>
          </div>
        </div>
        <div className="text-sm text-yellow-200/60">PWA • Offline • Historias de nombres</div>
      </div>
    </header>
  );
}
