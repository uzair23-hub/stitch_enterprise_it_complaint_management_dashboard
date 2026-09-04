@echo off
title Keystone ERP Industrial Local Server
setlocal enabledelayedexpansion

:: Enable Console Colors
color 0A
cd /d "%~dp0"

cls
echo ================================================================================
echo   __ __ _________.__  __________________  _______  ___________
echo  |  |/  \_   _____/  |/  /  _____/\__   |/  _  \ \      \   |_ 
echo  |     < |    __)_    /  /   \  ___  |  |  /  /_\  \      \  |  
echo  |   |  \|        \   /   \    \_\  \ |  | /    |    \      \ |  
echo  |___|__ \_______  /__/     \______  /____\____|__  /____/_  /____/ 
echo         \/       \/                \/             \/       \/       
echo.
echo           KEYSTONE ENTERPRISES -- ENTERPRISE INDUSTRIAL COMPLAINT MANAGEMENT
echo                       (v2.4 Enterprise Production Edition)
echo ================================================================================
echo  [+] GitHub Repository : https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard
echo  [+] Operating Standard : Industry 4.0 Compliant / Air-Gapped Offline Ready
echo  [+] Database Engine    : SQLite 3 DB + JSON DB + Excel Auto-Sync
echo  [+] Storage Directory  : data/ (complaints.sqlite + complaints_master_sheet.csv)
echo  [+] Local Server Target: http://localhost:3000
echo ================================================================================
echo.

:: 1. Check Node.js installation
echo [*] Validating Node.js Runtime Environment...
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Node.js is NOT installed or not found in PATH!
    echo [INFO]  Keystone ERP requires Node.js (v14 or higher).
    echo [INFO]  Please download & install Node.js from: https://nodejs.org
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo [OK] Node.js Runtime Detected: !NODE_VER!

:: 2. Launch browser automatically after 2 seconds
echo [*] Launching Web Interface at http://localhost:3000 ...
timeout /t 2 /nobreak >nul
start "" "http://localhost:3000"

:: 3. Start Zero-Dependency HTTP Server
echo [*] Starting Keystone Industrial Server (Zero-Dependency Engine)...
echo ================================================================================
echo  SERVER ACTIVE -- Real-time Telemetry & Excel Auto-Sync Live!
echo  Press Ctrl+C in this terminal window anytime to stop the server.
echo ================================================================================
echo.

node "%~dp0server.js"

pause
