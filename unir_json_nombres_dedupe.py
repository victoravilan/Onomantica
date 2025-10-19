#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Une varios archivos JSON (cada uno con una lista de objetos) en uno solo,
expandiendo comodines (p.ej. *.json), ordenando "naturalmente" y
ELIMINANDO DUPLICADOS según una clave configurable (por defecto: nombre).

Uso:
  py unir_json_nombres_dedupe.py --out nombres_completos.json nombres_*.json
Opciones:
  --key nombre            Clave para deduplicar (default: nombre)
  --keep last             Mantiene el último duplicado (default: first)
  --case-sensitive        No normaliza mayúsculas/minúsculas (default: insensible)
  --keep-accents          No quita acentos (default: quita acentos)
  --report report.txt     Escribe un reporte de duplicados detectados
"""

import json, argparse, glob, os, re, sys, unicodedata

def natural_key(s: str):
    return [int(t) if t.isdigit() else t.lower()
            for t in re.split(r'(\d+)', os.path.basename(s))]

def expand_inputs(tokens, out_path):
    files = []
    for tok in tokens:
        if any(ch in tok for ch in "*?[]"):
            files.extend(glob.glob(tok))
        else:
            files.append(tok)
    abs_out = os.path.abspath(out_path)
    norm, seen = [], set()
    for f in files:
        af = os.path.abspath(f)
        if af == abs_out:
            continue
        if af not in seen and os.path.isfile(af):
            seen.add(af)
            norm.append(af)
    norm.sort(key=natural_key)
    return norm

def strip_accents(s: str) -> str:
    return "".join(ch for ch in unicodedata.normalize("NFKD", s) if not unicodedata.combining(ch))

def make_key(rec: dict, field: str, case_sensitive: bool, keep_accents: bool) -> str:
    v = rec.get(field, "")
    if not isinstance(v, str):
        v = str(v)
    k = v
    if not keep_accents:
        k = strip_accents(k)
    if not case_sensitive:
        k = k.lower()
    return k.strip()

def main():
    p = argparse.ArgumentParser(description="Une JSONs y elimina duplicados por clave.")
    p.add_argument("--out", required=True, help="Archivo JSON de salida.")
    p.add_argument("--key", default="nombre", help="Campo clave para deduplicar (default: nombre).")
    p.add_argument("--keep", choices=["first","last"], default="first",
                   help="Si hay duplicados, conservar el primero o el último (default: first).")
    p.add_argument("--case-sensitive", action="store_true", help="No normaliza mayúsculas/minúsculas.")
    p.add_argument("--keep-accents", action="store_true", help="No elimina acentos al comparar.")
    p.add_argument("--report", default="", help="Ruta de archivo para reporte de duplicados.")
    p.add_argument("archivos", nargs="+", help="Archivos/patrones a unir (ej. nombres_*.json).")
    args = p.parse_args()

    entradas = expand_inputs(args.archivos, args.out)
    if not entradas:
        print("⚠️ No se encontraron archivos que coincidan.", file=sys.stderr)
        sys.exit(1)

    print(f"📁 Uniendo {len(entradas)} archivo(s):")
    for r in entradas: print("  •", r)

    out = []
    for ruta in entradas:
        with open(ruta, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                out.extend(data)
            else:
                print(f"   ⚠️ {ruta} no es una lista JSON; se omite.", file=sys.stderr)

    # Deduplicación
    idx_by_key = {}
    dups = []
    for i, rec in enumerate(out):
        k = make_key(rec, args.key, args.case_sensitive, args.keep_accents)
        if k in idx_by_key:
            dups.append((k, idx_by_key[k], i))
            if args.keep == "last":
                idx_by_key[k] = i
        else:
            idx_by_key[k] = i

    # Construir resultado sin duplicados
    keep_indices = set(idx_by_key.values())
    nuevo = [rec for i, rec in enumerate(out) if i in keep_indices]

    # Reporte
    removed = len(out) - len(nuevo)
    if args.report:
        with open(args.report, "w", encoding="utf-8") as rf:
            rf.write(f"Duplicados detectados: {removed}\n")
            rf.write(f"Clave: {args.key}, keep={args.keep}, case_sensitive={args.case_sensitive}, keep_accents={args.keep_accents}\n\n")
            for k, first_i, dup_i in dups:
                rf.write(f"{k}  (primer: {first_i}, duplicado: {dup_i})\n")

    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(nuevo, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Entradas totales leídas: {len(out)}")
    print(f"🧹 Duplicados removidos:   {removed}")
    print(f"📌 Clave usada:            {args.key}  (keep={args.keep}, case_sensitive={args.case_sensitive}, keep_accents={args.keep_accents})")
    print(f"💾 Guardado en:            {os.path.abspath(args.out)}")
    if args.report:
        print(f"📝 Reporte:                {os.path.abspath(args.report)}")

if __name__ == "__main__":
    main()
