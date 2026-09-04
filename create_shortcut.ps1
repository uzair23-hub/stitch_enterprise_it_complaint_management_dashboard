# Keystone ERP - VIP Desktop Suite & Shortcut Creator
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$batFile   = Join-Path $scriptDir "Run_Keystone_ERP.bat"
$xlsxFile  = Join-Path $scriptDir "data\Complaints_Master_Database.xlsx"
$desktop   = [Environment]::GetFolderPath("Desktop")

# Create Main Desktop Shortcut
$shell = New-Object -ComObject WScript.Shell
$shortcutMain = Join-Path $desktop "Keystone ERP Dashboard.lnk"
$s = $shell.CreateShortcut($shortcutMain)
$s.TargetPath       = $batFile
$s.WorkingDirectory = $scriptDir
$s.IconLocation     = "C:\Windows\System32\shell32.dll,14"
$s.Description      = "Keystone ERP Dashboard - Click to Launch"
$s.Save()

# Create Desktop Folder: "Keystone ERP System"
$suiteDir = Join-Path $desktop "Keystone ERP System"
if (!(Test-Path $suiteDir)) {
    New-Item -ItemType Directory -Path $suiteDir | Out-Null
}

# 1. Launcher Shortcut in Folder
$s1 = $shell.CreateShortcut((Join-Path $suiteDir "Run Keystone ERP Dashboard.lnk"))
$s1.TargetPath       = $batFile
$s1.WorkingDirectory = $scriptDir
$s1.IconLocation     = "C:\Windows\System32\shell32.dll,14"
$s1.Save()

# 2. Direct .bat Launcher File included in Folder
$directBat = Join-Path $suiteDir "Start_Keystone_ERP.bat"
$batContent = "@echo off`r`ncd /d `"$scriptDir`"`r`ncall `"$batFile`"`r`n"
Set-Content -Path $directBat -Value $batContent

# 3. Master Excel Database (.xlsx) in Folder
$s2 = $shell.CreateShortcut((Join-Path $suiteDir "Complaints Master Database (.xlsx).lnk"))
$s2.TargetPath       = $xlsxFile
$s2.WorkingDirectory = (Join-Path $scriptDir "data")
$s2.IconLocation     = "C:\Windows\System32\shell32.dll,264"
$s2.Save()

# 4. Live Website Portal (.url) in Folder
$urlFile = Join-Path $suiteDir "Live Website Portal (GitHub Live).url"
Set-Content -Path $urlFile -Value "[InternetShortcut]`nURL=https://uzair23-hub.github.io/stitch_enterprise_it_complaint_management_dashboard/"

# 5. GitHub Repository Link (.url) in Folder
$ghFile = Join-Path $suiteDir "GitHub Repository Source.url"
Set-Content -Path $ghFile -Value "[InternetShortcut]`nURL=https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard"

# 6. Credentials & Info Text File
$infoFile = Join-Path $suiteDir "LOGIN_CREDENTIALS_AND_LINKS.txt"
$infoContent = @"
================================================================================
  KEYSTONE ENTERPRISES PVT LTD - COMPLAINT MANAGEMENT SYSTEM
================================================================================

[LINKS]
* Live Website (GitHub Pages):
  https://uzair23-hub.github.io/stitch_enterprise_it_complaint_management_dashboard/

* GitHub Repository:
  https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard

* Localhost URL:
  http://localhost:3000

--------------------------------------------------------------------------------
[LOGIN CREDENTIALS]

1. SYSTEM ADMINISTRATOR:
   Username : admin
   Password : admin123

2. EMPLOYEES / PLANT STAFF:
   Username : [Your Employee Code]  (e.g., 13292)
   Password : [Your Employee Code]  (e.g., 13292)
   * Note: Password is set to your Employee Code by default.

3. DEPARTMENT HEADS (IT, Electronics, Electrical, Mechanical):
   Username : adeel_sofyan / saif_wahab / rehan / abdullah
   Password : your Employee Code or 123456

================================================================================
"@
Set-Content -Path $infoFile -Value $infoContent

Write-Host ""
Write-Host "  [OK] Desktop Suite Folder & Shortcuts Created!" -ForegroundColor Green
Write-Host "  Desktop Folder: $suiteDir" -ForegroundColor Cyan
Write-Host "  Desktop Shortcut: $shortcutMain" -ForegroundColor Cyan
Write-Host "  Direct .bat in Folder: $directBat" -ForegroundColor Cyan
Write-Host ""
