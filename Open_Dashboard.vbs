' ============================================================
' Keystone ERP - Silent Launcher (No CMD Window)
' Double-click: Server hidden start hoga, browser auto-open
' Server band karne ke liye: Stop_Server.vbs chalao
' ============================================================

Dim WshShell, fso, scriptDir

Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get folder path of this script
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName) & "\"

Dim serverJsPath
serverJsPath = scriptDir & "server.js"

' Check if server.js exists
If Not fso.FileExists(serverJsPath) Then
    MsgBox "server.js not found in: " & scriptDir, vbCritical, "Keystone ERP Error"
    WScript.Quit
End If

' Check if already running on port 3000 using netstat
Dim oExec, result
Set oExec = WshShell.Exec("cmd /c netstat -an 2>&1")
result = oExec.StdOut.ReadAll()

If InStr(result, ":3000") > 0 And InStr(result, "LISTENING") > 0 Then
    ' Already running - just open browser
    WshShell.Run "http://localhost:3000"
    WScript.Quit
End If

' Start server: use cmd /c with node, window hidden (0)
' Run node in background without showing any window
WshShell.Run "cmd /c node """ & serverJsPath & """ > """ & scriptDir & "server.log"" 2>&1", 0, False

' Wait for server to start (3 seconds)
WScript.Sleep 3000

' Open browser
WshShell.Run "http://localhost:3000"

Set WshShell = Nothing
Set fso = Nothing
