@echo off
title Keystone ERP Shortcut Creator
color 0B
echo ================================================================================
echo           KEYSTONE ENTERPRISES -- DESKTOP SHORTCUT GENERATOR
echo ================================================================================
echo  Creating 1-Click Desktop Shortcut for Keystone Enterprises System...
echo ================================================================================

powershell -NoProfile -ExecutionPolicy Bypass -Command "$desk = [Environment]::GetFolderPath('Desktop'); if (-not (Test-Path $desk)) { $desk = [System.IO.Path]::Combine($env:USERPROFILE, 'Desktop'); New-Item -ItemType Directory -Force -Path $desk | Out-Null }; $target = [System.IO.Path]::Combine($desk, 'Keystone ERP System.lnk'); $w = New-Object -ComObject WScript.Shell; $s = $w.CreateShortcut($target); $s.TargetPath = '%~dp0Run_Keystone_ERP.bat'; $s.WorkingDirectory = '%~dp0'; $s.Description = 'Keystone ERP Enterprise System'; $s.Save()"

echo.
echo ================================================================================
echo  [SUCCESS] Desktop shortcut "Keystone ERP System" created successfully!
echo  You can now double-click the Desktop icon anytime to start the ERP Server.
echo ================================================================================
echo.
pause
