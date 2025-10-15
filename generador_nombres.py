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

# Base de conocimiento para nombres específicos, con etimología y contexto.
DATOS_ESPECIFICOS = {
    "alejandro": {
        "etimologia": "Del griego 'Alexandros', significa 'el que protege al hombre'.",
        "relato": "Su legado, como el del gran conquistador, evoca la capacidad de unir mundos y expandir horizontes. Quien lleva este nombre aprende que la verdadera fuerza no está en la espada, sino en la visión para proteger y guiar a su gente.",
        "tags": ["historia", "realeza", "liderazgo", "griego"]
    },
    "cesar": {
        "etimologia": "Del latín 'Caesar', posiblemente de 'caesaries' (cabellera) o 'caedere' (cortar).",
        "relato": "El nombre resuena con el poder y la autoridad del líder romano que transformó la historia. Quien lo lleva hereda un eco de mando, estrategia y la audacia de cruzar cualquier Rubicón personal.",
        "tags": ["historia", "liderazgo", "romano", "poder"]
    },
    "margarita": {
        "etimologia": "Del griego 'margarites', que significa 'perla'.",
        "relato": "Como la perla que le da nombre y la flor que inspira leyendas, Margarita evoca una belleza que se forma en la adversidad. Su significado se despliega en pétalos de sencillez y en el tesoro de una resiliencia luminosa.",
        "tags": ["naturaleza", "joya", "flor", "griego"]
    },
    "rosa": {
        "etimologia": "Del latín 'rosa', nombre de la flor.",
        "relato": "Más que una flor, es un símbolo universal de amor, pasión y misterio. El nombre Rosa guarda el secreto de una belleza que se defiende con espinas pero se entrega en su fragancia, un equilibrio entre delicadeza y fortaleza.",
        "tags": ["naturaleza", "flor", "simbolismo", "amor"]
    },
    "berna": {
        "etimologia": "Topónimo de la capital de Suiza, del germánico 'bero' (oso).",
        "relato": "Con la fuerza del oso y la solidez de la ciudad que nombra, Berna es un topónimo hecho persona. Simboliza un refugio de poder, una capital de carácter firme y un corazón que protege su territorio con lealtad.",
        "tags": ["toponimo", "animal", "fuerza", "germanico"]
    }
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
    # Si hay un significado etimológico específico, lo usamos como base.
    info_especifica = DATOS_ESPECIFICOS.get(nombre.lower())
    if info_especifica and "etimologia" in info_especifica:
        base = info_especifica["etimologia"]
        frase_extra = f"Se asocia a un carácter {_pal(RASGOS2)} y a una vocación de {_pal(REFLEJOS)}."
        return f"{base} {frase_extra}"

    # Si no, creamos uno más variado y menos repetitivo.
    plantillas = [
        f"De origen {origen.lower()}, se asocia a la {_pal(RASGOS1)} y a un carácter {_pal(RASGOS2)}.",
        f"Refleja un carácter {_pal(RASGOS2)} que impulsa hacia el {_pal(IMPULSOS)}, con una esencia de {_pal(REFLEJOS)}.",
        f"Con raíces en la cultura {origen.lower()}, simboliza la {_pal(RASGOS1)} y una vocación de {_pal(REFLEJOS)}."
    ]
    significado_base = random.choice(plantillas)
    return f"{significado_base} Es un nombre que evoca sentido en los momentos decisivos de la vida."

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
    # Primero, revisamos si hay un relato específico para este nombre.
    info_especifica = DATOS_ESPECIFICOS.get(nombre.lower())
    if info_especifica and "relato" in info_especifica:
        return info_especifica["relato"]

    # Si no, usamos las plantillas genéricas como antes.
    plantilla = RELATOS_PLANTILLAS.get(tipo, RELATOS_PLANTILLAS["poética"])
    return " ".join(plantilla.format(nombre=nombre).split())

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
