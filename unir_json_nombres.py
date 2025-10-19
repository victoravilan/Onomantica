#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Une varios archivos JSON (cada uno con una lista) en un solo JSON.
Admite patrones tipo comodín: *.json, nombres_*.json, etc.
Uso:
    py unir_json_nombres.py --out nombres_completos.json nombres_*.json
    # o listar explícitos:
    py unir_json_nombres.py --out nombres_completos.json a.json b.json c.json
"""

import json, argparse, glob, os, re, sys

def natural_key(s: str):
    # orden "humano": nombres_1_300.json < nombres_51_100.json < ...
    return [int(t) if t.isdigit() else t.lower()
            for t in re.split(r'(\d+)', os.path.basename(s))]

def expand_inputs(tokens, out_path):
    files = []
    for tok in tokens:
        # si trae comodín, expandimos
        if any(ch in tok for ch in "*?[]"):
            matches = glob.glob(tok)
            files.extend(matches)
        else:
            files.append(tok)
    # normalizamos a rutas absolutas, quitamos duplicados y el archivo de salida si aparece
    abs_out = os.path.abspath(out_path)
    norm = []
    seen = set()
    for f in files:
        af = os.path.abspath(f)
        if af == abs_out:
            continue
        if af not in seen and os.path.isfile(af):
            seen.add(af)
            norm.append(af)
    # orden natural
    norm.sort(key=natural_key)
    return norm

def main():
    p = argparse.ArgumentParser(description="Une varios JSON de nombres en uno solo.")
    p.add_argument("--out", required=True, help="Archivo JSON unificado de salida.")
    p.add_argument("archivos", nargs="+", help="Archivos o patrones a unir (en orden o con comodines).")
    args = p.parse_args()

    entradas = expand_inputs(args.archivos, args.out)
    if not entradas:
        print("⚠️ No se encontraron archivos que coincidan con los patrones dados.", file=sys.stderr)
        sys.exit(1)

    combinado = []
    print(f"📁 Uniendo {len(entradas)} archivo(s):")
    for ruta in entradas:
        print(f"  • {ruta}")
        with open(ruta, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                combinado.extend(data)
            else:
                print(f"   ⚠️ {ruta} no contiene una lista JSON; se omite.", file=sys.stderr)

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(combinado, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Total combinado: {len(combinado)} entradas")
    print(f"💾 Guardado en: {os.path.abspath(args.out)}")

if __name__ == "__main__":
    main()
