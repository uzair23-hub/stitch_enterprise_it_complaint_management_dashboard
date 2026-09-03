================================================================================
100% OFFLINE ZERO-DEPENDENCY NODE.JS ARCHITECTURE
================================================================================
KEYSTONE ENTERPRISES — IT COMPLAINT MANAGEMENT SYSTEM
Deployment & Operating Manual
================================================================================

OFFICIAL GITHUB REPOSITORY:
https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard

[ENGLISH & HINDI INSTRUCTIONS]

1. HOW TO RUN ON LOCAL PC (Local Machine Par Kaise Chalayein):
--------------------------------------------------------------------------------
Option A (Recommended 1-Click Launch):
Double-click on "Run_Keystone_ERP.bat" (or "start_server.bat").
This will check Node.js environment, launch the industrial server engine,
and automatically open your default browser at http://localhost:3000.

Option B (Desktop Shortcut):
Double-click on "setup_shortcut.bat" once.
It will create a "Keystone ERP System" shortcut directly on your Desktop!

Option C (Terminal Command):
Open Terminal/Command Prompt in this directory and run:
   node server.js


2. ONLINE & 100% AIR-GAPPED OFFLINE FUNCTIONALITY:
--------------------------------------------------------------------------------
• ZERO INTERNET NEEDED: This system uses a 0-dependency Node.js HTTP server.
  No "npm install" or internet package downloads required!
• LOCAL ASSETS: Tailwind CSS, Chart.js, and Material Icons are stored locally in the "lib/" directory.
• AUTOMATIC EXCEL AUTO-SYNC: All logged complaints auto-sync in real-time to Excel CSV format at:
  data/complaints_master_sheet.csv
• LOCAL JSON DATABASE: System state is saved to:
  data/complaints_database.json


3. FACTORY / LAN NETWORK MULTI-PC ACCESS:
--------------------------------------------------------------------------------
If you want multiple computers (e.g. Factory floor PCs, IT Admin Desk) to access this dashboard:
1. Run "Run_Keystone_ERP.bat" on the main server computer.
2. Note the LAN IP address shown in the console window (e.g., http://192.168.1.10:3000).
3. Open that URL on any PC connected to the same Wi-Fi / Industrial LAN network.


4. SYSTEM REQUIREMENTS:
--------------------------------------------------------------------------------
- Windows 10/11 or Linux/macOS
- Node.js (v14 or higher installed on server PC)

================================================================================
Developed & Prepared for Industrial Enterprise Deployment
================================================================================
