param(
  [string]$BackendPort = "8003",
  [string]$FrontendPort = "5173"
)

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RootDir = Join-Path $ScriptDir ".."
$BackendDir = Join-Path $RootDir "backend"
$FrontendDir = Join-Path $RootDir "frontend"

Write-Host "♟ Chess Training App - Avvio" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Kill any existing processes on these ports
$existingBackend = netstat -ano | Select-String ":$BackendPort " | ForEach-Object { if ($_ -match "(\d+)$") { $Matches[1] } }
if ($existingBackend) {
  Write-Host "Porta $BackendPort in uso, termino processo..." -ForegroundColor Yellow
  $existingBackend | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
  Start-Sleep 1
}

# Start backend
Write-Host "▶ Avvio backend (porta $BackendPort)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
  param($dir, $port)
  Set-Location $dir
  python -m uvicorn app.main:app --host 0.0.0.0 --port $port
} -ArgumentList $BackendDir, $BackendPort

Start-Sleep 3

# Check backend started
$backendOk = $false
for ($i = 0; $i -lt 10; $i++) {
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:$BackendPort/api/health" -UseBasicParsing -TimeoutSec 2
    if ($resp.StatusCode -eq 200) {
      $backendOk = $true
      break
    }
  } catch {}
  Start-Sleep 1
}

if (-not $backendOk) {
  Write-Host "⚠ Backend non risponde, controlla errori sopra" -ForegroundColor Yellow
} else {
  Write-Host "✓ Backend attivo su http://localhost:$BackendPort" -ForegroundColor Green
}

# Start frontend
Write-Host "▶ Avvio frontend (porta $FrontendPort)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
  param($dir)
  Set-Location $dir
  npm run dev
} -ArgumentList $FrontendDir

Start-Sleep 4

$frontendOk = $false
for ($i = 0; $i -lt 10; $i++) {
  try {
    $resp = Invoke-WebRequest -Uri "http://localhost:$FrontendPort" -UseBasicParsing -TimeoutSec 2
    if ($resp.StatusCode -eq 200) {
      $frontendOk = $true
      break
    }
  } catch {}
  Start-Sleep 1
}

if (-not $frontendOk) {
  Write-Host "⚠ Frontend non risponde, potrebbe ancora avviarsi..." -ForegroundColor Yellow
} else {
  Write-Host "✓ Frontend attivo su http://localhost:$FrontendPort" -ForegroundColor Green
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "  Frontend: http://localhost:$FrontendPort" -ForegroundColor White
Write-Host "  Backend:  http://localhost:$BackendPort/api/health" -ForegroundColor White
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "Premi CTRL+C per fermare tutto" -ForegroundColor Yellow

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
}
finally {
  Write-Host "`nArresto server..." -ForegroundColor Yellow
  Stop-Job $backendJob -ErrorAction SilentlyContinue
  Stop-Job $frontendJob -ErrorAction SilentlyContinue
  Remove-Job $backendJob -ErrorAction SilentlyContinue
  Remove-Job $frontendJob -ErrorAction SilentlyContinue
  Write-Host "✓ Server fermati" -ForegroundColor Green
}
