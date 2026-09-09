# StegoVault One-Click PowerShell Launcher
$ErrorActionPreference = "Stop"
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "                    STEGOVAULT - SYSTEM LAUNCHER                      " -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Check Backend
Write-Host "[*] Checking Backend environment..." -ForegroundColor Yellow
$backendPython = Join-Path $backendDir ".venv\Scripts\python.exe"
if (-not (Test-Path $backendPython)) {
    Write-Host "[!] Virtual environment not found. Setting up..." -ForegroundColor Yellow
    python -m venv (Join-Path $backendDir ".venv")
    & (Join-Path $backendDir ".venv\Scripts\pip.exe") install -r (Join-Path $backendDir "requirements.txt")
} else {
    Write-Host "[OK] Backend virtual environment found." -ForegroundColor Green
}

# 2. Check Frontend
Write-Host "[*] Checking Frontend dependencies..." -ForegroundColor Yellow
$frontendModules = Join-Path $frontendDir "node_modules"
if (-not (Test-Path $frontendModules)) {
    Write-Host "[!] node_modules not found. Installing..." -ForegroundColor Yellow
    Push-Location $frontendDir
    npm install
    Pop-Location
} else {
    Write-Host "[OK] Frontend dependencies found." -ForegroundColor Green
}

Write-Host "`n[*] Starting Backend (http://127.0.0.1:8000)..." -ForegroundColor Cyan
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$backendDir`" && call .venv\Scripts\activate.bat && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"

Write-Host "[*] Starting Frontend (http://127.0.0.1:5173)..." -ForegroundColor Cyan
Start-Process cmd.exe -ArgumentList "/k", "cd /d `"$frontendDir`" && npm run dev"

Write-Host "[*] Launching browser in 3 seconds..." -ForegroundColor Cyan
Start-Sleep -Seconds 3
Start-Process "http://127.0.0.1:5173"

Write-Host "`n[SUCCESS] StegoVault is running!" -ForegroundColor Green
Write-Host "- Web Dashboard: http://127.0.0.1:5173" -ForegroundColor White
Write-Host "- Backend API:   http://127.0.0.1:8000" -ForegroundColor White
Write-Host "- Swagger Docs:  http://127.0.0.1:8000/docs`n" -ForegroundColor White
