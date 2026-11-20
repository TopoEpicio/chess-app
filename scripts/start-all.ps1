<# 
.SYNOPSIS
    Avvia Chess Training App (backend + frontend) installando le dipendenze se necessario.
#>

param(
    [string]$BackendPort = "8003",
    [string]$FrontendPort = "5173"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Join-Path $ScriptDir ".."
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

function Write-Status($msg, $color = 'White') { Write-Host "  $msg" -ForegroundColor $color }
function Write-OK($msg) { Write-Status "[OK] $msg" 'Green' }
function Write-Warn($msg) { Write-Status "[WARN] $msg" 'Yellow' }
function Write-Err($msg) { Write-Status "[ERRORE] $msg" 'Red' }
function Write-Step($msg) { Write-Status "[..] $msg" 'Cyan' }

Write-Host ""
Write-Host "♟ Chess Training App - Avvio completo" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# ------------------------------------------------------------
# FRONTEND: installa dipendenze
# ------------------------------------------------------------
Write-Step "Controllo dipendenze frontend..."
if (-not (Test-Path (Join-Path $FrontendDir "node_modules"))) {
    Write-Step "Installazione dipendenze frontend (npm install --legacy-peer-deps)..."
    try {
        Set-Location $FrontendDir
        npm install --legacy-peer-deps
        Write-OK "Dipendenze frontend installate"
    } catch {
        Write-Err "npm install fallito: $_"
        exit 1
    }
    Set-Location $RootDir
} else {
    Write-OK "Dipendenze frontend già presenti"
}
Write-Host ""

# ------------------------------------------------------------
# BACKEND: installa dipendenze
# ------------------------------------------------------------
Write-Step "Controllo dipendenze backend..."
try {
    python -m pip install -q -r (Join-Path $BackendDir "requirements.txt")
    Write-OK "Dipendenze backend pronte"
} catch {
    Write-Err "pip install fallito: $_"
    exit 1
}
Write-Host ""

# ------------------------------------------------------------
# PULIZIA PORTE
# ------------------------------------------------------------
Write-Step "Pulizia porte $BackendPort e $FrontendPort..."
@(netstat -ano | Select-String ":$BackendPort ") | ForEach-Object {
    if ($_ -match "(\d+)$") { Stop-Process -Id $Matches[1] -Force -ErrorAction SilentlyContinue }
}
@(netstat -ano | Select-String ":$FrontendPort ") | ForEach-Object {
    if ($_ -match "(\d+)$") { Stop-Process -Id $Matches[1] -Force -ErrorAction SilentlyContinue }
}
Start-Sleep 2
Write-Host ""

# ------------------------------------------------------------
# AVVIO BACKEND
# ------------------------------------------------------------
Write-Step "Avvio backend (porta $BackendPort)..."
$backendJob = Start-Job -ScriptBlock {
    param($dir, $port)
    Set-Location $dir
    python -m uvicorn app.main:app --host 0.0.0.0 --port $port
} -ArgumentList $BackendDir, $BackendPort

Write-Step "Attesa avvio backend (puo richiedere 20-30 secondi)..."
$backendOk = $false
for ($i = 0; $i -lt 30; $i++) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/health" -UseBasicParsing -TimeoutSec 3
        if ($resp.StatusCode -eq 200) { $backendOk = $true; break }
    } catch {}
    Start-Sleep 1
    if ($i % 5 -eq 0) { Write-Host "    .. ancora in attesa ($i/30s)" -ForegroundColor Gray }
}

if (-not $backendOk) {
    Write-Err "Backend non risponde dopo 30 secondi"
    Receive-Job $backendJob | Write-Host -ForegroundColor Red
    exit 1
}
Write-OK "Backend attivo su http://localhost:$BackendPort"
Write-Host ""

# ------------------------------------------------------------
# AVVIO FRONTEND
# ------------------------------------------------------------
Write-Step "Avvio frontend (porta $FrontendPort)..."
$frontendJob = Start-Job -ScriptBlock {
    param($dir)
    Set-Location $dir
    npm run dev
} -ArgumentList $FrontendDir

Write-Step "Attesa avvio frontend (puo richiedere 15-25 secondi)..."
$frontendOk = $false
for ($i = 0; $i -lt 25; $i++) {
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -UseBasicParsing -TimeoutSec 3
        if ($resp.StatusCode -eq 200) { $frontendOk = $true; break }
    } catch {}
    Start-Sleep 1
    if ($i % 5 -eq 0) { Write-Host "    .. ancora in attesa ($i/25s)" -ForegroundColor Gray }
}

if (-not $frontendOk) {
    Write-Warn "Frontend non risponde ancora, potrebbe servire più tempo"
} else {
    Write-OK "Frontend attivo su http://localhost:$FrontendPort"
}
Write-Host ""

# ------------------------------------------------------------
# RIEPILOGO
# ------------------------------------------------------------
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:$FrontendPort" -ForegroundColor White
Write-Host "  Backend:  http://localhost:$BackendPort/api/health" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Premi CTRL+C per fermare tutto" -ForegroundColor Yellow
Write-Host ""

# Mantieni vivo e monitora i job
try {
    while ($true) {
        Start-Sleep 5
        if ($backendJob.State -eq 'Failed') {
            Receive-Job $backendJob | Write-Host -ForegroundColor Red
            break
        }
        if ($frontendJob.State -eq 'Failed') {
            Receive-Job $frontendJob | Write-Host -ForegroundColor Red
            break
        }
    }
} finally {
    Write-Host "`nArresto server..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Write-OK "Server fermati"
}