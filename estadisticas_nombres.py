#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lee el JSON final de nombres y muestra estadísticas rápidas:
- Total de nombres
- Conteo por género
- Conteo por origen (los 20 más frecuentes)
"""

import json, argparse, collections

def main():
    parser = argparse.ArgumentParser(description="Estadísticas rápidas de un JSON de nombres.")
    parser.add_argument("archivo", help="Ruta al archivo JSON (ej. nombres_completos.json)")
    args = parser.parse_args()

    with open(args.archivo, "r", encoding="utf-8") as f:
        data = json.load(f)

    print(f"📊 Total de entradas: {len(data)}")

    # Conteo por género
    genero = collections.Counter([d.get("genero","").upper() for d in data if "genero" in d])
    print("\n👥 Por género:")
    for g, c in genero.most_common():
        print(f"  {g or '(vacío)'}: {c}")

    # Conteo por origen
    origen = collections.Counter([d.get("origen","").title() for d in data if "origen" in d])
    print("\n🌍 Orígenes más frecuentes:")
    for o, c in origen.most_common(20):
        print(f"  {o or '(vacío)'}: {c}")

if __name__ == "__main__":
    main()
