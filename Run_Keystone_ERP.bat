@echo off
setlocal EnableDelayedExpansion
title Keystone Enterprises Pvt Ltd — Enterprise Complaint Management System (VIP Edition)

cd /d "%~dp0"
cls
color 0A

echo ================================================================================
echo  ============================================================================
echo   KEYSTONE ENTERPRISES PVT LTD  --  COMPLAINT MANAGEMENT SYSTEM  v2.5 VIP
echo  ============================================================================
echo ================================================================================
echo  [+] Security Model    : Username + Password Authentication (Admin / Dept / Staff)
echo  [+] Brute-Force Guard : 5 Attempts Max  /  15-Minute Account Lockout
echo  [+] Database Engine   : SQLite 3 + MS Excel (.xlsx) + JSON DB + CSV Auto-Sync
echo  [+] Excel DB File     : data/Complaints_Master_Database.xlsx
echo  [+] Monthly Report DB : Auto-Synced Permanent Sheet 3 (Monthly Summaries)
echo  [+] Live Website Link : https://uzair23-hub.github.io/stitch_enterprise_it_complaint_management_dashboard/
echo  [+] GitHub Repository : https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard
echo  [+] Operating Standard: Industry 4.0 Compliant / Air-Gapped Offline Ready
echo  [+] Local Server      : http://localhost:3000
echo ================================================================================
echo.

:: ── Security Notice ────────────────────────────────────────────────────────────
echo  [SECURITY NOTICE] Authorized Access Only. All activities logged.
echo  [DATABASE NOTICE] Permanent Excel DB ^& Monthly Reports Auto-Synced to Disk.
echo ================================================================================
echo.

:: ── Create / Refresh Desktop Folder & Shortcuts ─────────────────────────────
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_shortcut.ps1" >nul 2>&1

echo [OK] Desktop Suite Folder Ready on Desktop (including .bat, .lnk & links)!
echo.

:: ── Node.js Runtime Check ─────────────────────────────────────────────────────
echo [*] Validating Node.js Runtime Environment...
where node >nul 2>&1
if %errorlevel% neq 0 goto NONODE

for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo [OK] Node.js Runtime Detected: %NODE_VER%

:: Minimum version guard (v14+)
for /f "tokens=1 delims=v." %%M in ("%NODE_VER%") do set _MAJOR=%%M
if defined _MAJOR (
  if %_MAJOR% LSS 14 goto OLDNODE
)

echo.

:: ── Port Availability Check ───────────────────────────────────────────────────
echo [*] Checking port 3000 availability...
netstat -ano | findstr ":3000 " >nul 2>&1
if %errorlevel% equ 0 (
  echo [WARN] Port 3000 is already in use. The app may already be running.
  echo [INFO] Opening existing session in browser...
  powershell -Command "Start-Process 'http://localhost:3000'" >nul 2>&1
  goto END
)
echo [OK] Port 3000 is free.
echo.

:: ── Start Server ──────────────────────────────────────────────────────────────
echo [*] Starting Keystone Industrial Server...
echo ================================================================================
echo  SERVER ACTIVE -- Keystone ERP CMS Live!
echo  Browser will auto-open at: http://localhost:3000
echo.
echo  LOGIN CREDENTIALS:
echo    1. Administrator : Username: admin ^| Password: admin123
echo    2. Plant Staff   : Enter Employee Code as Username ^& Password (e.g. 13292 / 13292)
echo    3. Dept Heads    : Username: adeel_sofyan / rehan / etc. ^| Password: Code or 123456
echo.
echo  SECURITY RULES:
echo    5 wrong attempts = 15-minute account lockout.
echo    All login/logout events are audit-logged.
echo ================================================================================
echo.
echo  Press Ctrl+C to shut down the server safely.
echo ================================================================================
echo.

:: Open browser after 2 seconds asynchronously while server starts
start "" powershell -NoProfile -ExecutionPolicy Bypass -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"
node "%~dp0server.js"
goto END

:NONODE
echo.
echo ================================================================================
echo  [ERROR] Node.js is NOT installed or not found in PATH!
echo  [INFO]  Keystone ERP requires Node.js v14 or higher.
echo  [INFO]  Download from: https://nodejs.org/en/download
echo ================================================================================
echo.
pause
goto :EOF

:OLDNODE
echo.
echo ================================================================================
echo  [WARN] Node.js version %NODE_VER% detected. v14+ is required.
echo  [INFO] Please upgrade Node.js from: https://nodejs.org/en/download
echo ================================================================================
echo.
pause
goto :EOF

:END
echo.
echo ================================================================================
echo  [*] Server stopped. Keystone ERP session ended.
echo  [*] All session data has been cleared for security.
echo ================================================================================
pause
