# Keystone ERP - Desktop Shortcut Creator
# Run karo: powershell -ExecutionPolicy Bypass -File create_shortcut.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ps1File   = Join-Path $scriptDir "launch_hidden.ps1"
$desktop   = [Environment]::GetFolderPath("Desktop")
$shortcut  = Join-Path $desktop "Keystone ERP Dashboard.lnk"

$shell = New-Object -ComObject WScript.Shell
$s = $shell.CreateShortcut($shortcut)
$s.TargetPath     = "powershell.exe"
$s.Arguments      = "-NoProfile -ExecutionPolicy Bypass -WindowStyle Hidden -File `"$ps1File`""
$s.WorkingDirectory = $scriptDir
$s.IconLocation   = "C:\Windows\System32\shell32.dll,14"
$s.Description    = "Keystone ERP Dashboard - Click to Launch"
$s.Save()

if (Test-Path $shortcut) {
    Write-Host ""
    Write-Host "  [OK] Shortcut created on Desktop!" -ForegroundColor Green
    Write-Host "  Path: $shortcut" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "  Double-click 'Keystone ERP Dashboard' on Desktop" -ForegroundColor Yellow
    Write-Host "  Browser will open directly - No CMD window!" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "[ERROR] Shortcut creation failed!" -ForegroundColor Red
}

Start-Sleep -Seconds 3
