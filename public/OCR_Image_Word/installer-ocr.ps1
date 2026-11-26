$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$ocr = Join-Path $root "ocr"
$core = Join-Path $ocr "core"
$lang = Join-Path $ocr "lang"

New-Item -ItemType Directory -Force -Path $ocr,$core,$lang | Out-Null

function Get-File($url,$path){
    Write-Host "Téléchargement : $url" -ForegroundColor Cyan
    Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
    if(!(Test-Path $path)){ throw "Échec : $path" }
}

# Version v5, compatible avec la structure locale documentée par Tesseract.js.
$baseJs = "https://cdn.jsdelivr.net/npm/tesseract.js@5.0.0/dist"
$baseCore = "https://cdn.jsdelivr.net/npm/tesseract.js-core@5.0.0"
$baseLang = "https://tessdata.projectnaptha.com/4.0.0"

Get-File "$baseJs/tesseract.min.js" "$ocr/tesseract.min.js"
Get-File "$baseJs/worker.min.js" "$ocr/worker.min.js"

Get-File "$baseCore/tesseract-core.wasm.js" "$core/tesseract-core.wasm.js"
Get-File "$baseCore/tesseract-core-simd.wasm.js" "$core/tesseract-core-simd.wasm.js"
Get-File "$baseCore/tesseract-core-lstm.wasm.js" "$core/tesseract-core-lstm.wasm.js"
Get-File "$baseCore/tesseract-core-simd-lstm.wasm.js" "$core/tesseract-core-simd-lstm.wasm.js"

Get-File "$baseLang/fra.traineddata.gz" "$lang/fra.traineddata.gz"

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host " OCR LOCAL INSTALLE AVEC SUCCES" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Tu peux maintenant lancer : lancer.bat" -ForegroundColor Yellow
