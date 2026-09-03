@echo off
title Keystone Enterprises Pvt Ltd Complaint Management System - Desktop Shortcut Creator
cd /d "%~dp0"

echo ================================================================================
echo  Creating Desktop Shortcut for Keystone Enterprises Pvt Ltd Complaint Management System...
echo ================================================================================
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0create_shortcut.ps1"

echo.
echo [OK] Shortcut created successfully on your Desktop!
echo You can now double-click "Keystone ERP Dashboard" on your Desktop to open the system.
echo.
pause
