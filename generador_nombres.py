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

# Base de conocimiento enriquecida para nombres específicos.
DATOS_ESPECIFICOS = {
    "alejandro": {
        "etimologia": "Proviene del griego 'Alexandros' (Αλέξανδρος), compuesto por 'alexo' (proteger, defender) y 'andros' (hombre). Su significado es 'el que protege al hombre' o 'el defensor de la humanidad'.",
        "variantes": ["Alex, Sandro, Lisandro"],
        "personajes": [
            "Alejandro Magno, rey de Macedonia, cuya visión y conquistas extendieron la cultura helenística, redefiniendo el mundo antiguo.",
            "Varios papas y santos han llevado este nombre, como San Alejandro de Alejandría, clave en los primeros concilios de la Iglesia."
        ],
        "simbolismo": "Evoca liderazgo, ambición y la capacidad de crear imperios, tanto externos como internos. Es un nombre ligado a la estrategia y a la expansión de horizontes.",
        "relato_personalizado": "Su legado, como el del gran conquistador, evoca la capacidad de unir mundos y expandir horizontes. Quien lleva este nombre aprende que la verdadera fuerza no está en la espada, sino en la visión para proteger y guiar a su gente."
    },
    "cesar": {
        "etimologia": "Originado en el latín 'Caesar', cognomen de una ilustre familia romana. Su etimología es incierta; podría derivar de 'caesaries' (cabellera) o 'caedere' (cortar), en alusión a un ancestro nacido por cesárea.",
        "variantes": ["Cesarino"],
        "personajes": [
            "Julio César, general y estadista romano cuya vida y muerte marcaron el fin de la República y el inicio del Imperio. Su nombre se convirtió en sinónimo de 'emperador' (Káiser, Zar).",
            "César Chávez, líder campesino y activista por los derechos civiles en Estados Unidos."
        ],
        "simbolismo": "Representa la autoridad, el poder de decisión y la capacidad de transformar la sociedad. Es un nombre que porta el peso de la historia y la determinación.",
        "relato_personalizado": "El nombre resuena con el poder y la autoridad del líder romano que transformó la historia. Quien lo lleva hereda un eco de mando, estrategia y la audacia de cruzar cualquier Rubicón personal."
    },
    "margarita": {
        "etimologia": "Del griego 'margarites' (μαργαρίτης), que significa 'perla'. A través del latín, se asoció también a la flor homónima.",
        "variantes": ["Rita, Marga, Greta"],
        "personajes": [
            "Santa Margarita de Antioquía, una de las santas más populares de la Edad Media, patrona de las parturientas.",
            "Margarita de Valois, reina de Francia y Navarra, conocida como la 'Reina Margot', figura clave en las guerras de religión."
        ],
        "simbolismo": "Simboliza la pureza, la belleza oculta y la inocencia (como la perla dentro de la ostra y la flor de pétalos blancos). También se asocia con la isla de Margarita, conocida como la 'Perla del Caribe'.",
        "relato_personalizado": "Como la perla que le da nombre y la flor que inspira leyendas, Margarita evoca una belleza que se forma en la adversidad. Su significado se despliega en pétalos de sencillez y en el tesoro de una resiliencia luminosa."
    },
    "rosa": {
        "etimologia": "Directamente del latín 'rosa', nombre de la flor, que a su vez podría tener raíces en el persa antiguo.",
        "variantes": ["Rosalía, Rosario, Rosana"],
        "personajes": [
            "Santa Rosa de Lima, mística y primera santa de América.",
            "Rosa Parks, figura icónica del movimiento por los derechos civiles en Estados Unidos.",
            "En el esoterismo, la rosa es un símbolo central en el Rosacrucismo, representando el alma que florece en el centro de la cruz de la materia."
        ],
        "simbolismo": "Es el arquetipo de la belleza, el amor y la pasión. Sus espinas añaden el matiz de la protección y el sacrificio. Simboliza el misterio revelado y la perfección espiritual.",
        "relato_personalizado": "Más que una flor, es un símbolo universal de amor, pasión y misterio. El nombre Rosa guarda el secreto de una belleza que se defiende con espinas pero se entrega en su fragancia, un equilibrio entre delicadeza y fortaleza."
    },
    "berna": {
        "etimologia": "Principalmente un hipocorístico de Bernarda o Bernardo, de origen germánico ('berin-hard'), que significa 'fuerte como un oso'. También es el nombre de la capital de Suiza, cuya leyenda fundacional involucra a un oso.",
        "variantes": ["Bernardita, Bernardo"],
        "personajes": [
            "Santa Bernardita Soubirous, la vidente de Lourdes, cuyo nombre en su forma completa era Bernarde-Marie.",
            "Berna González Harbour, periodista y escritora española."
        ],
        "simbolismo": "Combina la fuerza y la valentía del oso con la solidez y la diplomacia de la ciudad suiza. Es un nombre que evoca protección, resistencia y un carácter firme.",
        "relato_personalizado": "Con la fuerza del oso y la solidez de la ciudad que nombra, Berna es un topónimo hecho persona. Simboliza un refugio de poder, una capital de carácter firme y un corazón que protege su territorio con lealtad."
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

NUMEROLOGIA_SIGNIFICADOS = {
    1: "Liderazgo, independencia y originalidad. Es el número del pionero, aquel que abre caminos con una energía y determinación únicas. Su reto es aprender a colaborar sin perder su individualidad.",
    2: "Cooperación, diplomacia y sensibilidad. Representa la dualidad y la unión. Es el número del mediador, que busca la armonía y valora las relaciones. Su fuerza reside en la paciencia y la empatía.",
    3: "Comunicación, creatividad y optimismo. Es el número del artista y el comunicador. Su don es la expresión y la alegría de vivir, inspirando a otros con su entusiasmo. Su reto es no dispersar su energía.",
    4: "Estructura, orden y pragmatismo. Representa la estabilidad y el trabajo duro. Es el número del constructor, que crea bases sólidas y valora la disciplina. Su poder es la constancia y la fiabilidad.",
    5: "Libertad, aventura y cambio. Es el número del viajero y el explorador del espíritu. Ama la variedad y se adapta con facilidad a nuevas situaciones. Su lección es usar su libertad con responsabilidad.",
    6: "Armonía, familia y responsabilidad. Representa el amor y el servicio a la comunidad. Es el número del cuidador, que nutre y protege a los suyos. Su don es la compasión y la búsqueda de la belleza.",
    7: "Análisis, introspección y espiritualidad. Es el número del sabio y el buscador de la verdad. Necesita tiempo para la reflexión y el estudio. Su camino es el del conocimiento profundo y la conexión con lo trascendente.",
    8: "Poder, ambición y materialización. Representa el éxito material y la autoridad. Es el número del estratega, que sabe manifestar sus visiones en el mundo real. Su reto es equilibrar lo material con lo espiritual.",
    9: "Humanitarismo, compasión y finalización. Es el número del idealista y el filántropo. Tiene una visión global y un profundo amor por la humanidad. Su misión es servir desinteresadamente y cerrar ciclos."
}

def _pal(lista): return random.choice(lista)

def calcular_numerologia(nombre: str) -> (int, str):
    """Calcula el número numerológico de un nombre (sistema pitagórico)."""
    tabla = {
        'a': 1, 'j': 1, 's': 1, 'á': 1, 'à': 1, 'ä': 1,
        'b': 2, 'k': 2, 't': 2,
        'c': 3, 'l': 3, 'u': 3, 'ú': 3, 'ü': 3,
        'd': 4, 'm': 4, 'v': 4,
        'e': 5, 'n': 5, 'w': 5, 'é': 5, 'è': 5, 'ë': 5, 'ñ': 5,
        'f': 6, 'o': 6, 'x': 6, 'ó': 6, 'ò': 6, 'ö': 6,
        'g': 7, 'p': 7, 'y': 7,
        'h': 8, 'q': 8, 'z': 8,
        'i': 9, 'r': 9, 'í': 9, 'ì': 9, 'ï': 9
    }
    
    valor_numerico = sum(tabla.get(letra, 0) for letra in nombre.lower())
    
    # Reducción a un solo dígito
    while valor_numerico > 9:
        if valor_numerico in [11, 22, 33]: # Números maestros (opcional)
            break
        valor_numerico = sum(int(digito) for digito in str(valor_numerico))
        
    return valor_numerico, NUMEROLOGIA_SIGNIFICADOS.get(valor_numerico, "Significado no disponible.")

def generar_descripcion_completa(nombre: str, origen: str) -> str:
    """Genera una descripción completa y estructurada del nombre."""
    info_especifica = DATOS_ESPECIFICOS.get(nombre.lower())
    
    # Párrafo 1: Origen y Significado
    if info_especifica:
        p1 = info_especifica['etimologia']
        if 'variantes' in info_especifica and info_especifica['variantes']:
            p1 += f" Algunas de sus variantes son {', '.join(info_especifica['variantes'])}."
        if 'simbolismo' in info_especifica:
            p1 += f" {info_especifica['simbolismo']}"
    else:
        p1 = f"De origen {origen.lower()}, se asocia a la {_pal(RASGOS1)} y a un carácter {_pal(RASGOS2)}. Refleja un impulso hacia el {_pal(IMPULSOS)}."

    # Párrafo 2: Personajes y Legado
    p2 = ""
    if info_especifica and 'personajes' in info_especifica:
        p2 = "Este nombre ha sido llevado por figuras notables a lo largo de la historia. " + " ".join(info_especifica['personajes'])
    else:
        # Párrafo de legado arquetípico para nombres sin datos específicos
        arquetipos = [
            f"Portadores de este nombre a menudo se destacan como {_pal(['pioneros', 'guardianes', 'visionarios', 'artistas'])}, dejando una huella de {_pal(['innovación', 'protección', 'creatividad', 'sabiduría'])} en su comunidad.",
            f"El eco de este nombre resuena en aquellos que buscan la {_pal(['justicia', 'verdad', 'belleza', 'armonía'])}, convirtiéndose en referentes de {_pal(['integridad', 'resiliencia', 'compasión', 'valentía'])}."
        ]
        p2 = random.choice(arquetipos)

    # Párrafo 3 y 4: Relatos
    # Usamos el relato personalizado si existe, si no, el genérico.
    if info_especifica and 'relato_personalizado' in info_especifica:
        p3 = info_especifica['relato_personalizado']
        p4 = generar_relato(nombre, random.choice(["fantástica", "mitológica"])) # Uno específico y otro aleatorio
    else:
        p3 = generar_relato(nombre, "poética")
        p4 = generar_relato(nombre, random.choice(["histórica", "fantástica", "mitológica"]))

    # Párrafo 5: Numerología
    num, sig_num = calcular_numerologia(nombre)
    p5 = f"En numerología, el nombre {nombre} resuena con la vibración del número {num}. {sig_num}"

    # Ensamblaje final
    parrafos = [p for p in [p1, p2, p3, p4, p5] if p]
    return "\n\n".join(parrafos)

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
    """Genera un relato de un tipo específico, usando datos específicos si existen."""
    plantilla = RELATOS_PLANTILLAS.get(tipo, RELATOS_PLANTILLAS["poética"])
    return " ".join(plantilla.format(nombre=nombre).split())

def procesar_fila(row: Dict[str,str], preferidos: List[str]) -> Dict:
    nombre = (row.get("Nombre") or row.get("nombre") or "").strip()
    genero = (row.get("Género") or row.get("Genero") or row.get("genero") or "U").strip()
    origen = (row.get("Origen") or row.get("origen") or "Desconocido").strip()
    if not nombre:
        return None

    descripcion_completa = generar_descripcion_completa(nombre, origen)
    tipo = elegir_tipo(nombre, origen, preferidos)

    # El relato ahora está integrado en el significado completo. Usamos el tipo solo para referencia.
    return {"nombre": nombre, "genero": genero, "origen": origen,
            "significado": descripcion_completa, "historia":{"tipo": tipo, "relato": ""}} # El relato ahora está integrado en el significado

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
