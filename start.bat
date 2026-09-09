@echo off
title StegoVault - One-Click Launcher
echo ========================================================
echo          StegoVault - One-Click Launcher
echo ========================================================
echo.
echo Starting Backend on http://127.0.0.1:8000 ...
start "StegoVault Backend" cmd /k "cd /d %~dp0backend && .venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

echo Starting Frontend on http://127.0.0.1:5173 ...
start "StegoVault Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Opening Browser at http://localhost:5173 ...
ping 127.0.0.1 -n 3 >nul
start http://localhost:5173

echo.
echo ========================================================
echo StegoVault services launched successfully!
echo - Web Dashboard: http://localhost:5173
echo - Backend API:   http://127.0.0.1:8000
echo - Swagger Docs:  http://127.0.0.1:8000/docs
echo ========================================================
echo.
pause
