# Keystone ERP - Silent Launcher
# Yeh script server hidden chalata hai aur browser open karta hai
# Koi CMD/PowerShell window nahi aayega

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$serverPath = Join-Path $scriptDir "server.js"

# Check if node exists
$nodeExists = Get-Command node -ErrorAction SilentlyContinue
if (-not $nodeExists) {
    [System.Windows.Forms.MessageBox]::Show(
        "Node.js install nahi hai!`n`nDownload karo: https://nodejs.org/en/download",
        "Keystone ERP Error",
        [System.Windows.Forms.MessageBoxButtons]::OK,
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
    exit
}

# Check if server already running on port 3000
$portInUse = netstat -an 2>$null | Select-String ":3000.*LISTENING"

if ($portInUse) {
    # Already running - just open browser
    Start-Process "http://localhost:3000"
    exit
}

# Kill any stale node processes holding port 3000
$tcpConn = netstat -ano 2>$null | Select-String ":3000"
if ($tcpConn) {
    $pids = ($tcpConn | ForEach-Object { ($_ -split '\s+')[-1] }) | Sort-Object -Unique
    foreach ($p in $pids) {
        if ($p -match '^\d+$' -and $p -ne '0') {
            Stop-Process -Id $p -Force -ErrorAction SilentlyContinue
        }
    }
    Start-Sleep -Seconds 1
}

# Start Node server completely hidden
$pInfo = New-Object System.Diagnostics.ProcessStartInfo
$pInfo.FileName = "node"
$pInfo.Arguments = "`"$serverPath`""
$pInfo.WorkingDirectory = $scriptDir
$pInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
$pInfo.CreateNoWindow = $true
$pInfo.UseShellExecute = $false

$process = [System.Diagnostics.Process]::Start($pInfo)

# Wait for server to start (3 seconds)
Start-Sleep -Seconds 3

# Open browser
Start-Process "http://localhost:3000"
