# ------------------------

# -------- CONFIG --------
$csv = "nombres.csv"
$bloqueTam = 100                 # tamaño del bloque
$numBloques = 30                 # 30 x 100 = 3000
$seedBase = 200                  # semilla base para variar creatividad por bloque
$outUnion = "public/data/nombres_completos.json"
$outReporte = "reporte_dup.txt"
# ------------------------

Write-Host "Verificando CSV fuente..."
if (-not (Test-Path $csv)) {
  Write-Error "ERROR: No se encontro el CSV fuente: $csv. Abortando."
  exit 1
}

# (Opcional) contar filas para advertir si no alcanza
$lineas = (Get-Content $csv -Raw).Split("`n").Count
$estimadoFilas = $lineas - 1
$totalNombres = $bloqueTam * $numBloques
Write-Host "Filas en CSV (aprox): $estimadoFilas. Se intentaran generar $totalNombres nombres."
if ($estimadoFilas -lt ($bloqueTam * $numBloques)) {
  Write-Warning "ADVERTENCIA: El CSV parece tener menos de $totalNombres filas."
}

# Generar bloques
for ($i = 0; $i -lt $numBloques; $i++) {
  $skip = $i * $bloqueTam
  $ini = "{0:D3}" -f ($skip + 1)
  $fin = "{0:D3}" -f ($skip + $bloqueTam)
  $out = "public/data/nombres_${ini}_${fin}.json"
  $seed = $seedBase + $i

  Write-Host ""
  Write-Host "Generando bloque ($($i+1) de $numBloques)..."
  py generador_nombres.py --in $csv --out $out --skip $skip --max $bloqueTam --seed $seed
  if ($LASTEXITCODE -ne 0) {
    Write-Warning "ERROR en el bloque $ini-$fin. Continuando..."
  }
}

# Unir + deduplicar (por 'nombre', sin acentos y case-insensitive; conserva la PRIMERA aparición)
Write-Host ""
Write-Host "Uniendo y deduplicando todos los bloques..."
py unir_json_nombres_dedupe.py --out $outUnion --report $outReporte "public/data/nombres_*.json"

# Estadísticas
Write-Host ""
Write-Host "Estadisticas del archivo final:"
py estadisticas_nombres.py $outUnion
Write-Host "Reporte de duplicados generado en: $outReporte"

