// src/data/rules.ts
// Reglas y mini-bases locales para enriquecer significados y orígenes.

export type RuleNote =
  | { kind: 'teoforico'; note: string }
  | { kind: 'raiz'; note: string }
  | { kind: 'toponimo'; note: string }
  | { kind: 'virtud'; note: string }
  | { kind: 'celeste'; note: string }
  | { kind: 'naturaleza'; note: string }
  | { kind: 'elemento'; note: string };

// —————————————————————————————————————————————
// 1) Sufijos teofóricos (hebreo ‘El/Elohim’)
// —————————————————————————————————————————————
export const THEOPHORIC_SUFFIXES: { suf: string; note: string }[] = [
  { suf: 'el',  note: 'Elemento teofórico hebreo — «El/Elohim» (Dios). Presente en Daniel, Gabriel, Miguel, etc.' },
  { suf: 'iel', note: 'Variante teofórica hebrea (-iel) ≈ «El/Elohim» (Dios).' },
  { suf: 'uel', note: 'Variante teofórica hebrea (-uel) ≈ «El/Elohim» (Dios).' },
];

// —————————————————————————————————————————————
// 2) Raíces frecuentes (aportan matiz)
// —————————————————————————————————————————————
export const ROOT_GLOSSES: { key: string; gloss: string; note?: string }[] = [
  { key: 'victor', gloss: 'vencedor, quien triunfa', note: 'Del latín «victor»: vencedor.' },
  { key: 'bern',   gloss: 'oso / fuerza del oso',    note: 'Germánico «bern-»: oso. En Bernard/-a, Bernardo, Bernarda.' },
  { key: 'luc',    gloss: 'luz, claridad',           note: 'Latín «lux/luc-»: luz.' },
  { key: 'sofi',   gloss: 'sabiduría (gr.)',         note: 'Griego «sophía»: sabiduría.' },
  { key: 'val',    gloss: 'valor, fuerza',           note: 'Latín «val-»: vigor, valía.' },
  { key: 'mund',   gloss: 'protección',              note: 'Germánico «-mund»: protección (Raimundo, Edmundo).' },
  { key: 'mar',    gloss: 'mar / amplitud',          note: 'Latín «mare»: mar; alude a amplitud, viajes, profundidad.' },
  { key: 'sol',    gloss: 'sol / energía',           note: 'Latín «sol»: astro, energía vital.' },
];

// —————————————————————————————————————————————
// 3) Topónimos que coinciden con nombres de pila
//    *Puedes ampliarlo sin problemas*
// —————————————————————————————————————————————
export const TOPONYMS: { name: string; note: string }[] = [
  { name: 'berna',  note: 'Berna es la capital de Suiza. Como nombre personal suele ser hipocorístico de Bernarda/Bernardo (germ. «bern-» = oso).' },
  { name: 'la verna', note: 'La Verna (Toscana, Italia) es una región/paraje monástico asociado a San Francisco; “Verna” puede evocar “primaveral” (lat. «vernalis»).' },
  { name: 'roma',   note: 'Roma, capital de Italia; nombre femenino ocasional, con connotación histórica y cultural.' },
  { name: 'siena',  note: 'Siena, ciudad de la Toscana; nombre femenino moderno.' },
  { name: 'lima',   note: 'Lima, capital de Perú; también voz común (herramienta), según contexto.' },
  { name: 'verona', note: 'Verona, ciudad italiana de gran tradición literaria (Shakespeare).' },
];

// —————————————————————————————————————————————
// 4) Nombres desde sustantivos/virtudes (Piedad, Paz...)
// —————————————————————————————————————————————
export const VIRTUE_WORDS: { key: string; note: string }[] = [
  { key: 'piedad',   note: 'Virtud (pietas): compasión, devoción.' },
  { key: 'caridad',  note: 'Virtud teologal: amor al prójimo.' },
  { key: 'esperanza',note: 'Virtud teologal: expectativa confiada del bien.' },
  { key: 'fe',       note: 'Virtud teologal: creencia y confianza.' },
  { key: 'paz',      note: 'Valor universal: armonía, ausencia de conflicto.' },
  { key: 'gloria',   note: 'Honor, brillo, renombre; resonancia bíblica y litúrgica.' },
  { key: 'justicia', note: 'Virtud cardinal: dar a cada cual lo que corresponde.' },
  { key: 'prudencia',note: 'Virtud cardinal: sabiduría práctica.' },
];

// —————————————————————————————————————————————
// 5) Astros/estelar (Sol, Luna, Estrella...)
// —————————————————————————————————————————————
export const CELESTIAL_WORDS: { key: string; note: string }[] = [
  { key: 'sol',     note: 'Astro rey: energía, ciclo, claridad.' },
  { key: 'luna',    note: 'Satélite: ciclos, marea, intuición, noche.' },
  { key: 'estrella',note: 'Puntos de luz: guía, destino, orientación.' },
  { key: 'cielo',   note: 'Bóveda celeste: elevación, horizonte.' },
];

// —————————————————————————————————————————————
// 6) Naturaleza/elementos (Flor, Rosa, Mar...)
// —————————————————————————————————————————————
export const NATURE_WORDS: { key: string; note: string }[] = [
  { key: 'flor',  note: 'Naturaleza: brote, belleza efímera, primavera.' },
  { key: 'rosa',  note: 'Flor emblemática: belleza, amor, espinas (ambivalencia).' },
  { key: 'jazmin',note: 'Flor de aroma intenso; pureza, encanto sutil.' },
  { key: 'mar',   note: 'Elemento agua en vastedad: viaje, profundidad, cambio.' },
];

export const ELEMENT_WORDS: { key: string; note: string }[] = [
  { key: 'agua',  note: 'Elemento: vida, fluidez, adaptación.' },
  { key: 'fuego', note: 'Elemento: energía, transformación, coraje.' },
  { key: 'aire',  note: 'Elemento: movimiento, pensamiento, voz.' },
  { key: 'tierra',note: 'Elemento: sostén, materia, paciencia.' },
];

// —————————————————————————————————————————————
// 7) Diccionario para portmanteau/compuestos “sin espacio”
//    (mar+sol, rosa+maría, luc+as, etc.)
// —————————————————————————————————————————————
export const COMPOSITE_PARTS: { key: string; kind: 'celeste'|'naturaleza'|'virtud'|'elemento'|'raiz'; note: string }[] = [
  { key: 'mar',   kind: 'naturaleza', note: 'Mar: agua, viaje, profundidad.' },
  { key: 'sol',   kind: 'celeste',    note: 'Sol: energía, claridad, centro.' },
  { key: 'luna',  kind: 'celeste',    note: 'Luna: ciclos, intuición.' },
  { key: 'estre', kind: 'celeste',    note: 'Estrella (inicio “estre-”): guía, destino.' },
  { key: 'rosa',  kind: 'naturaleza', note: 'Rosa: belleza, amor, ambivalencia (espinas).' },
  { key: 'flor',  kind: 'naturaleza', note: 'Flor: brote, primavera, delicadeza.' },
  { key: 'luc',   kind: 'raiz',       note: 'Luz/claridad.' },
  { key: 'sofi',  kind: 'raiz',       note: 'Sabiduría.' },
  { key: 'val',   kind: 'raiz',       note: 'Valor/fuerza.' },
  { key: 'victor',kind: 'raiz',       note: 'Vencedor/triunfo.' },
  { key: 'bern',  kind: 'raiz',       note: 'Oso/fuerza.' },
  // añade “maria/marí” si quieres cubrir Rosamaría/MaríaSol como casos típicos
  { key: 'maria', kind: 'raiz',       note: 'María: tradición bíblica/cristiana.' },
  { key: 'mari',  kind: 'raiz',       note: 'Variante/tronco de María o prefijo “mari-”.' },
];
