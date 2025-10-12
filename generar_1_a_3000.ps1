# =======================
# generar_1_a_3000.ps1
# Requiere: generador_nombres.py, unir_json_nombres_dedupe.py, estadisticas_nombres.py
# Fuente CSV: nombres.csv  (columnas: Nombre,Género,Origen)
# Genera bloques de 100 => 30 bloques = 3000 entradas
# =======================

# -------- CONFIG --------
$csv = ".\nombres.csv"           # cambia si tu fuente se llama distinto
$bloqueTam = 100                 # tamaño del bloque
$numBloques = 30                 # 30 x 100 = 3000
$seedBase = 200                  # semilla base para variar creatividad por bloque
$outUnion = ".\nombres_completos.json"
$outReporte = ".\reporte_dup.txt"
# ------------------------

Write-Host "🔎 Verificando CSV fuente: $csv"
if (-not (Test-Path $csv)) {
  Write-Error "No se encontró el CSV fuente: $csv. Aborta."
  exit 1
}

# (Opcional) contar filas para advertir si no alcanza
$lineas = (Get-Content $csv -Raw).Split("`n").Count
# Descontar la fila de cabecera si corresponde
$estimadoFilas = $lineas - 1
Write-Host "📄 Filas (aprox, sin cabecera): $estimadoFilas"
if ($estimadoFilas -lt ($bloqueTam * $numBloques)) {
  Write-Warning "El CSV parece tener menos de $($bloqueTam * $numBloques) filas. Igual genero hasta donde alcance."
}

# Generar bloques
for ($i = 0; $i -lt $numBloques; $i++) {
  $skip = $i * $bloqueTam
  $ini = "{0:D3}" -f ($skip + 1)
  $fin = "{0:D3}" -f ($skip + $bloqueTam)
  $out = ".\nombres_${ini}_${fin}.json"
  $seed = $seedBase + $i

  Write-Host ""
  Write-Host "🧩 Generando bloque $($i+1)/$numBloques  =>  $ini-$fin   (skip=$skip, max=$bloqueTam, seed=$seed)"
  py .\generador_nombres.py --in $csv --out $out --skip $skip --max $bloqueTam --seed $seed
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "⚠️ El bloque $ini-$fin devolvió error. Continúo con el siguiente."
  }
}

# Unir + deduplicar (por 'nombre', sin acentos y case-insensitive; conserva la PRIMERA aparición)
Write-Host ""
Write-Host "🔗 Uniendo y deduplicando todos los bloques en: $outUnion"
py .\unir_json_nombres_dedupe.py --out $outUnion --report $outReporte nombres_*.json

# Estadísticas
Write-Host ""
Write-Host "📊 Estadísticas del archivo final"
py .\estadisticas_nombres.py $outUnion
Write-Host "`n📝 Reporte de duplicados: $outReporte"
