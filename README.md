# 🏭 Keystone Enterprises — IT Complaint Management System

[![Industry 4.0 Standard](https://img.shields.io/badge/Standard-Industry_4.0-blue.svg)](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)
[![Zero-Dependency Server](https://img.shields.io/badge/Node.js-Zero--Dependency-success.svg)](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)
[![Air-Gapped Offline](https://img.shields.io/badge/Deployment-Air--Gapped_Offline_Ready-purple.svg)](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)
[![Real-Time Excel Sync](https://img.shields.io/badge/Database-Real--Time_Excel_CSV-emerald.svg)](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)
[![GitHub Repository](https://img.shields.io/badge/GitHub-uzair23--hub-181717?logo=github)](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)

> **Keystone Enterprises Dashboard** is a high-performance, industrial-grade enterprise complaint management dashboard engineered for manufacturing plants, industrial facilities, and corporate IT/facility operations. Designed for high availability with real-time SLA telemetry, multi-department triage (IT, Electronics, Electrical, Mechanical), automated Microsoft Excel synchronization, and 100% air-gapped offline operation.

---

## 🔗 Official GitHub Repository
**URL**: [https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)

---

## 🌟 Key Enterprise Highlights

- **⚡ Zero External Runtime Dependencies**: Powered by a 100% self-contained standard Node.js HTTP engine (`server.js`). Operates seamlessly without `npm install` or active internet connectivity.
- **📊 Real-Time Excel Auto-Sync**: Every complaint logged or updated automatically syncs in real-time to Microsoft Excel CSV format (`data/complaints_master_sheet.csv`) with UTF-8 BOM encoding.
- **🏢 Multi-Department Triage & Isolation**: Dedicated operational workspaces for **IT**, **Electronics**, **Electrical**, and **Mechanical** engineering departments.
- **🎯 SLA & Telemetry Dashboard**: Live monitoring of Mean Time To Resolve (MTTR), SLA compliance percentages (98.4%+ benchmark), ticket priority distribution (Low, Medium, High, Critical), and resolution performance.
- **🔒 Role-Based Access Control (RBAC)**:
  - **Administrator (`admin`)**: Complete system-wide overview, analytics, audit trail, user directory, and bulk data operations.
  - **Department Head (`it_dept`, `elec_dept`, `mech_dept`)**: Department ticket queues, technician task allocation, and department performance reports.
  - **Employee (`emp001`, `emp002`)**: Frictionless complaint filing portal, status tracking, and satisfaction feedback.
- **🚀 Automated Industrial Batch Launchers**: One-click Windows Batch execution (`Run_Keystone_ERP.bat`) featuring ASCII branding banners, Node.js runtime validation, multi-PC LAN access display, and automatic browser initialization.

---

## 📁 Repository Structure

```
stitch_enterprise_it_complaint_management_dashboard/
│
├── 🚀 Run_Keystone_ERP.bat         # Primary Windows Batch Launcher (Automated Environment Setup)
├── ⚡ start_server.bat             # Fast Industrial Server Startup Batch File
├── 🛠️ setup_shortcut.bat           # 1-Click Desktop Shortcut Generator
├── 🖥️ server.js                    # Production Zero-Dependency Node.js HTTP Engine
├── 🌐 index.html                   # Single-Page Enterprise Dashboard App (Tailwind + Chart.js)
├── 📑 DESIGN.md                    # Industrial Design Architecture & Specification Document
├── 📖 README_INDUSTRIAL_DEPLOYMENT.txt # Multi-Language Operational Deployment Manual
│
├── 📂 data/
│   ├── complaints_database.json    # Live Persistent JSON System Database
│   └── complaints_master_sheet.csv # Auto-Synced Master Excel CSV Database
│
└── 📂 lib/                         # 100% Offline Asset Bundle (Tailwind CSS, Chart.js, Fonts)
```

---

## ⚡ Quick Start Guide (Windows)

### Option 1: 1-Click Batch Launcher (Recommended)
Double-click `Run_Keystone_ERP.bat` in the root folder.
- Validates Node.js environment automatically.
- Launches local HTTP server at `http://localhost:3000`.
- Automatically opens your default web browser.

### Option 2: Desktop Shortcut Creation
Double-click `setup_shortcut.bat` once to place a **Keystone ERP System** shortcut directly on your Windows Desktop.

### Option 3: Terminal Command
```bash
node server.js
```

---

## 🌐 Factory LAN Network Multi-PC Setup
To allow multiple factory PCs (e.g., Shop Floor workstations, IT Helpdesk) to access the dashboard:
1. Run `Run_Keystone_ERP.bat` on the primary server host PC.
2. Note the LAN IP address printed in the console (e.g. `http://192.168.1.50:3000`).
3. Open that URL on any PC connected to the local plant network / Wi-Fi.

---

## 👤 Default System Credentials

| Role | Username | Password | Operational Access Level |
|---|---|---|---|
| **System Admin** | `admin` | `admin123` | Full Enterprise Control Hub |
| **IT Dept Head** | `it_dept` | `it123` | IT Department Workspace |
| **Electronics Head** | `elec_dept` | `elec123` | Electronics Engineering Workspace |
| **Electrical Head** | `electrical_dept` | `elec456` | Electrical Facilities Workspace |
| **Mechanical Head** | `mech_dept` | `mech123` | Mechanical Maintenance Workspace |

---

## 🏆 Repository & Developer Information
Developed for Enterprise Industrial & IT Facility Operations.  
**GitHub Repository**: [https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard](https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard)
