# Start both proxy server and React app

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Starting NVIDIA Proxy + React App" -ForegroundColor Green
Write-Host "========================================`n" -ForegroundColor Green

# Start proxy server in background
Write-Host "🚀 Starting NVIDIA Proxy Server..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "node server.js" -WorkingDirectory $PSScriptRoot

Start-Sleep -Seconds 3

# Start React app
Write-Host "🚀 Starting React App..." -ForegroundColor Cyan
npm start

Write-Host "`n✅ Both servers started!" -ForegroundColor Green
