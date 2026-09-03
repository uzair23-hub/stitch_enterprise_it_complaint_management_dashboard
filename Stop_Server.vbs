' ============================================================
' Keystone ERP - Stop Server
' Double-click karo server band karne ke liye
' ============================================================

Dim WshShell
Set WshShell = CreateObject("WScript.Shell")

' Kill all node.js processes
WshShell.Run "cmd /c taskkill /F /IM node.exe >nul 2>&1", 0, True

MsgBox "Keystone ERP Server has been stopped.", vbInformation, "Keystone ERP - Server Stopped"

Set WshShell = Nothing
