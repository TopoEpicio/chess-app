@echo off
cd /d "%~dp0.."

echo.
echo  Chess Training App - Avvio completo
echo =====================================
echo.

:: ============================================================
:: FRONTEND: installa dipendenze se node_modules non esiste
:: ============================================================
if not exist "frontend\node_modules" (
    echo  [..] Installazione dipendenze frontend...
    cd frontend
    npm install --legacy-peer-deps
    if %errorlevel% neq 0 (
        echo  [ERRORE] npm install fallito
        pause
        exit /b 1
    )
    cd ..
    echo  [OK] Dipendenze frontend installate
) else (
    echo  [OK] Dipendenze frontend gia presenti
)
echo.

:: ============================================================
:: BACKEND: installa dipendenze se necessario
:: ============================================================
echo  [..] Verifica dipendenze backend...
python -m pip install -q -r backend\requirements.txt 2>nul
if %errorlevel% neq 0 (
    echo  [ERRORE] pip install fallito
    pause
    exit /b 1
)
echo  [OK] Dipendenze backend pronte
echo.

:: ============================================================
:: PULIZIA PORTE
:: ============================================================
echo  [..] Pulizia porte 8003 e 5173...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8003"') do (
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173"') do (
    taskkill /f /pid %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul
echo.

:: ============================================================
:: AVVIO BACKEND (in nuova finestra)
:: ============================================================
echo  [..] Avvio backend su porta 8003...
start "Chess Backend" cmd /c "cd /d backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

:: Attendi che il backend risponda (usa PowerShell per evitare problemi curl)
echo  [..] Attesa avvio backend...
for /l %%i in (1,1,15) do (
    powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:8003/api/health' -TimeoutSec 2 -UseBasicParsing; exit !$r.StatusCode -eq 200 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% equ 0 (
        echo  [OK] Backend attivo su http://localhost:8003
        goto :backend_ok
    )
    timeout /t 1 /nobreak >nul
)
echo  [ERRORE] Backend non risponde dopo 15 secondi
pause
exit /b 1

:backend_ok
echo.

:: ============================================================
:: AVVIO FRONTEND (in nuova finestra)
:: ============================================================
echo  [..] Avvio frontend su porta 5173...
start "Chess Frontend" cmd /c "cd /d frontend && npm run dev"

:: Attendi che il frontend risponda
echo  [..] Attesa avvio frontend...
for /l %%i in (1,1,20) do (
    powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:5173' -TimeoutSec 2 -UseBasicParsing; exit !$r.StatusCode -eq 200 } catch { exit 1 }" >nul 2>&1
    if %errorlevel% equ 0 (
        echo  [OK] Frontend attivo su http://localhost:5173
        goto :frontend_ok
    )
    timeout /t 1 /nobreak >nul
)
echo  [WARN] Frontend non risponde ancora, potrebbe servire piu tempo
echo.

:frontend_ok
echo.
echo =====================================
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:8003/api/health
echo =====================================
echo.
echo  Chiudi le finestre "Chess Backend" e "Chess Frontend" per fermare i server.
echo.
pause