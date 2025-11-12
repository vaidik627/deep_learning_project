@echo off
echo ========================================
echo Starting Multi-AI Platform
echo ========================================
echo.

echo [1/3] Stopping any existing processes...
taskkill /F /IM node.exe >nul 2>&1

echo [2/3] Starting Backend Proxy Server (Port 3001)...
start "NVIDIA Proxy Server" cmd /k "node server.js"
timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend React App (Port 3000)...
start "React App" cmd /k "npm start"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo.
echo Backend: http://localhost:3001
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit this window...
pause >nul
