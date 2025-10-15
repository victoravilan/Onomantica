#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera significados (15–20 palabras) y micro-relatos (60–100 palabras) por nombre.
Entrada: CSV con columnas: Nombre,Genero,Origen
Salida: JSON: nombre, genero, origen, significado, historia:{tipo,relato}

Uso por bloques:
  python generador_nombres.py --in maestros.csv --out nombres_001_100.json --skip 0   --max 100 --seed 11
  python generador_nombres.py --in maestros.csv --out nombres_101_200.json --skip 100 --max 100 --seed 12
"""

import csv, json, random, argparse
from typing import List, Dict

TIPOS = ["histórica","bíblica","mitológica","poética","fantástica"]
RASGOS1 = ["valentía","sabiduría","protección","alegría","resiliencia","claridad","creatividad","fortaleza interior","templanza","curiosidad"]
RASGOS2 = ["empático","leal","visionario","protector","inspirador","honesto","sereno","disciplinado","compasivo","observador"]
IMPULSOS = ["liderazgo consciente","búsqueda de verdad","cuidado de los demás","crecimiento personal","sueños grandes","decisiones justas","aprendizaje continuo","servicio generoso"]
REFLEJOS = ["luz espiritual","equilibrio emocional","disciplina práctica","imaginación fértil","bondad auténtica","esperanza activa","pensamiento crítico","gracia bajo presión"]

DATOS_ESPECIFICOS = {
    "alejandro": "Su legado, como el del gran conquistador, evoca la capacidad de unir mundos y expandir horizontes, demostrando que la verdadera grandeza reside en la visión y la audacia.",
    "cesar": "El nombre resuena con el poder y la autoridad del líder romano, un estratega que transformó la historia. Quien lo lleva hereda un eco de mando y determinación.",
    "margarita": "Como la flor que lleva su nombre y la isla que inspira leyendas, Margarita evoca una belleza natural y una perla de sabiduría oculta. Su significado se despliega en pétalos de sencillez y tesoros de resiliencia.",
    "rosa": "Más que una flor, es un símbolo de amor, pasión y misterio esotérico. El nombre Rosa guarda el secreto de una belleza que se defiende con espinas y se entrega en su fragancia.",
    "berna": "Con la fuerza del oso y la solidez de la ciudad que nombra, Berna es un topónimo hecho persona. Simboliza un refugio de poder y una capital de carácter firme."
}

RELATOS_PLANTILLAS = {
    "bíblica": (
        "{nombre} aparece en tradiciones bíblicas, donde la fe atraviesa pruebas y renueva el corazón. "
        "Su historia recuerda que la dignidad florece cuando se sirve con humildad y verdad. "
        "Quien lleva {nombre} aprende a escuchar el silencio, a decidir con conciencia y a agradecer cada avance. "
        "Ante la angustia, {nombre} confía; ante el éxito, comparte. Así el nombre se vuelve puente entre lo humano y lo sagrado."
    ),
    "mitológica": (
        "Los relatos antiguos susurran que {nombre} cruzó valles y montañas guiado por un juramento de honor. "
        "No vencía por fuerza, sino por enfoque y templanza. Su huella, dicen, dejaba centellas sobre la piedra húmeda. "
        "Quien porta {nombre} conserva ese pacto con lo extraordinario: entrenar sin alarde, cuidarse del orgullo, "
        "y honrar el destino con disciplina. Cuando el miedo aparece, {nombre} lo convierte en maestro paciente."
    ),
    "histórica": (
        "En crónicas y memorias, {nombre} aparece ligado a decisiones firmes y horizontes abiertos. "
        "Aprendió a rectificar sin perder la dignidad y a sostener la palabra dada. "
        "El nombre {nombre} inspira a tejer puentes entre generaciones y culturas, a ordenar el caos cotidiano "
        "y a encender esperanza concreta donde otros renuncian. Liderazgo, sí, pero como servicio: "
        "mirar a los ojos, escuchar, y avanzar con respeto incluso en la discrepancia."
    ),
    "poética": (
        "Dicen que cuando alguien susurra {nombre}, una brisa limpia aquieta las dudas. "
        "El nombre guarda rumor de agua clara, paciencia y belleza sencilla. "
        "Quien lo lleva aprende a elegir palabras que curan y silencios que sostienen. "
        "Para brillar no necesita ruido: basta un gesto exacto, una mirada honesta, "
        "y una decisión valiente en el momento justo, como una lámpara pequeña en cuarto oscuro."
    ),
    "fantástica": (
        "En un bosque sin coordenadas, {nombre} halló una lámpara hecha de auroras. "
        "Cada vez que alguien se perdía, el cristal encendía un sendero de luciérnagas hasta la salida. "
        "Desde entonces, {nombre} simboliza coraje amable que guía sin imponer, ingenio que vuelve sombras en señales, "
        "y ternura que recuerda el camino a casa incluso cuando el mundo gira demasiado rápido."
    )
}

def _pal(lista): return random.choice(lista)

def generar_significado(nombre: str, origen: str) -> str:
    base = [
        f"De origen {origen.lower()}, asociado a la {_pal(RASGOS1)}.",
        f"Refleja un carácter {_pal(RASGOS2)} que impulsa hacia el {_pal(IMPULSOS)}.",
        f"Su esencia es una vocación de {_pal(REFLEJOS)} en los momentos decisivos de la vida."
    ]
    # Une las frases con una lógica que evite la repetición y suene más natural.
    # Por ejemplo, podrías elegir 2 de las 3 frases al azar.
    return " ".join(base)

def elegir_tipo(nombre: str, origen: str, preferidos: List[str]) -> str:
    lower = nombre.lower()
    if lower in {"josé","jose","maría","maria","mateo","noah","daniel","gabriel","sara","david","isabel","isabella"}:
        return "bíblica"
    if origen.lower() in {"griego","latín","latin","romano"} and lower in {"camila","alejandro","marco","helen","elena"}:
        return "histórica"
    if origen.lower() in {"griego","latín","latin"}:
        return random.choice(["mitológica","poética"])
    if origen.lower() in {"árabe","arabe"} and lower in {"aisha","fatima","omar","youssef","ahmed"}:
        return "histórica"
    if lower in {"yuki","sakura","haru","mei","wei"}:
        return "poética"
    if preferidos:
        return random.choice(preferidos)
    return random.choice(TIPOS)

def generar_relato(nombre: str, tipo: str) -> str:
    plantilla = RELATOS_PLANTILLAS.get(tipo, RELATOS_PLANTILLAS["poética"])
    relato_base = " ".join(plantilla.format(nombre=nombre).split())
    
    detalle_especifico = DATOS_ESPECIFICOS.get(nombre.lower())
    if detalle_especifico:
        return f"{detalle_especifico} {relato_base}"
    return relato_base

def procesar_fila(row: Dict[str,str], preferidos: List[str]) -> Dict:
    nombre = (row.get("Nombre") or row.get("nombre") or "").strip()
    genero = (row.get("Género") or row.get("Genero") or row.get("genero") or "U").strip()
    origen = (row.get("Origen") or row.get("origen") or "Desconocido").strip()
    if not nombre:
        return None
    significado = generar_significado(nombre, origen)
    tipo = elegir_tipo(nombre, origen, preferidos)
    relato = generar_relato(nombre, tipo)
    return {"nombre": nombre, "genero": genero, "origen": origen,
            "significado": significado, "historia":{"tipo": tipo, "relato": relato}}

def main():
    ap = argparse.ArgumentParser(description="Genera significados y relatos para nombres (JSON).")
    ap.add_argument("--infile", dest="in_csv", required=True, help="CSV de entrada (Nombre,Género,Origen).")
    ap.add_argument("--out", dest="out_json", required=True, help="JSON de salida.")
    ap.add_argument("--max", dest="max_rows", type=int, default=0, help="Filas a procesar (0 = todas).")
    ap.add_argument("--skip", dest="skip_rows", type=int, default=0, help="Filas a saltar desde el inicio.")
    ap.add_argument("--seed", dest="seed", type=int, default=42, help="Semilla para reproducibilidad.")
    ap.add_argument("--types", nargs="*", default=[], help="Restringe tipos: historica biblica mitologica poetica fantastica")
    args = ap.parse_args()

    random.seed(args.seed)

    mapa = {"historica":"histórica","biblica":"bíblica","mitologica":"mitológica","poetica":"poética","fantastica":"fantástica"}
    preferidos = [mapa.get(t.lower(), t) for t in args.types if mapa.get(t.lower(), t) in TIPOS]

    out, count, skipped = [], 0, 0
    with open(args.in_csv, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if args.skip_rows and skipped < args.skip_rows:
                skipped += 1
                continue
            if args.max_rows and count >= args.max_rows:
                break
            item = procesar_fila(row, preferidos)
            if item:
                out.append(item)
                count += 1

    with open(args.out_json, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print(f"Escribí {len(out)} entradas en {args.out_json} (skip={args.skip_rows}, max={args.max_rows})")

if __name__ == "__main__":
    main()
