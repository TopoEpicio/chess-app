@echo off
cd /d "%~dp0.."

echo.
echo  Chess Training App
echo =====================
echo.

:: Kill any existing process on port 8003
echo  [..] Pulizia porta 8003...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":8003"') do (
    taskkill /f /pid %%a >nul 2>&1
)
timeout /t 2 /nobreak >nul

:: Start backend in a new window
echo  [..] Avvio backend...
start "Chess Backend" cmd /c "cd /d backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8003 --reload"

:: Wait and check backend
timeout /t 4 /nobreak >nul
curl -s http://localhost:8003/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo  [OK] Backend attivo su http://localhost:8003
) else (
    echo  [..] In attesa del backend...
)

:: Start frontend in a new window
echo  [..] Avvio frontend...
start "Chess Frontend" cmd /c "cd /d frontend && npm run dev"

echo.
echo  [OK] Frontend su http://localhost:5173
echo  [OK] Backend  su http://localhost:8003/api/health
echo.
echo  Chiudi le finestre del terminale per fermare i server.
echo.
pause
