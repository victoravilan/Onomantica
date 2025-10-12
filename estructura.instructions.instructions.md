onomantica/
├─ public/
│  ├─ data/nombres_completos.json      # tu JSON final (3000)
│  ├─ icons/                           # íconos PWA
│  └─ manifest.webmanifest
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  ├─ index.css
│  ├─ components/
│  │  ├─ SearchBar.tsx
│  │  ├─ MeaningCard.tsx
│  │  ├─ StoryCard.tsx
│  │  └─ EmptyState.tsx
│  ├─ lib/
│  │  ├─ onomastics.ts                 # análisis de nombre/raíces
│  │  ├─ generator.ts                  # generación de historias
│  │  ├─ diacritics.ts                 # normalización
│  │  └─ store.ts                      # cachear dataset (IndexedDB/localStorage)
│  └─ types.ts
├─ .env                                # (opcional)
├─ index.html
├─ package.json
├─ postcss.config.js
├─ tailwind.config.js
├─ tsconfig.json
└─ vite.config.ts
