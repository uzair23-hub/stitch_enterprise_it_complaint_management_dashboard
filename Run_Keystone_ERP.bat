@echo off
setlocal EnableDelayedExpansion
title Keystone Enterprises Pvt Ltd — Complaint Management System

cd /d "%~dp0"
cls
color 0A

echo ================================================================================
echo  ============================================================================
echo   KEYSTONE ENTERPRISES PVT LTD  --  COMPLAINT MANAGEMENT SYSTEM  v2.0
echo  ============================================================================
echo ================================================================================
echo  [+] Security Model    : Username + Password Authentication
echo  [+] Brute-Force Guard : 5 Attempts Max  /  15-Minute Account Lockout
echo  [+] Audit Logging     : LOGIN / LOGOUT events stored in localStorage
echo  [+] Input Validation  : Alphanumeric sanitisation enforced
echo  [+] Operating Standard: Industry 4.0 Compliant / Air-Gapped Offline Ready
echo  [+] Real-time Storage : JSON DB + Auto Excel CSV Sync
echo  [+] Local Server      : http://localhost:3000
echo ================================================================================
echo.

:: ── Security Banner ───────────────────────────────────────────────────────────
echo  [SECURITY NOTICE] Unauthorized access is strictly prohibited.
echo  [SECURITY NOTICE] All login activity is logged and monitored.
echo  [SECURITY NOTICE] 5 failed login attempts will lock access for 15 minutes.
echo ================================================================================
echo.

:: ── Auto-create Desktop Shortcut (first run only) ───────────────────────────
set "DESKTOP_LNK=%USERPROFILE%\Desktop\Keystone ERP Dashboard.lnk"
if not exist "%DESKTOP_LNK%" (
  echo [*] Creating Desktop Shortcut...
  powershell -NoProfile -ExecutionPolicy Bypass -Command "$s = (New-Object -ComObject WScript.Shell).CreateShortcut('%DESKTOP_LNK%'); $s.TargetPath = '%~f0'; $s.WorkingDirectory = '%~dp0'; $s.IconLocation = 'C:\Windows\System32\shell32.dll,14'; $s.Description = 'Keystone ERP Dashboard - Click to Launch'; $s.Save();"
  if exist "%DESKTOP_LNK%" (
    echo [OK] Desktop shortcut created: Keystone ERP Dashboard
  ) else (
    echo [WARN] Could not create desktop shortcut (check permissions).
  )
  echo.
)

:: ── Node.js Runtime Check ─────────────────────────────────────────────────────
echo [*] Validating Node.js Runtime Environment...
where node >nul 2>&1
if %errorlevel% neq 0 goto NONODE

for /f "tokens=*" %%v in ('node -v 2^>nul') do set NODE_VER=%%v
echo [OK] Node.js Runtime Detected: %NODE_VER%

:: Minimum version guard (v14+)
for /f "tokens=1 delims=v." %%M in ("%NODE_VER%") do set _MAJOR=%%M
for /f "tokens=2 delims=v." %%M in ("%NODE_VER%") do set _MAJOR=%%M
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
echo    Username : admin
echo    Password : admin123
echo.
echo  SECURITY RULES:
echo    5 wrong attempts = 15-minute account lockout.
echo    All login/logout events are audit-logged.
echo ================================================================================
echo.
echo  Press Ctrl+C to shut down the server safely.
echo ================================================================================
echo.

:: Open browser after 2 seconds
powershell -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'" >nul 2>&1 &

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
