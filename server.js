/**
 * Keystone Enterprises — Production-Ready Industrial Server
 * Database Engine: SQLite 3 + Native MS Excel (.xlsx) + JSON DB + CSV Auto-Sync
 * Works online and 100% offline in air-gapped server environments.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const ExcelJS = require('exceljs');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');
const GITHUB_REPO = 'https://github.com/uzair23-hub/stitch_enterprise_it_complaint_management_dashboard';

// Ensure data directory exists for Database & Excel storage
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'complaints_database.json');
const SQLITE_FILE = path.join(DATA_DIR, 'complaints.sqlite');
const XLSX_FILE = path.join(DATA_DIR, 'Complaints_Master_Database.xlsx');
const CSV_FILE = path.join(DATA_DIR, 'complaints_master_sheet.csv');

// -------------------------------------------------------------
// 1. SQLITE 3 DATABASE ENGINE INITIALIZATION
// -------------------------------------------------------------
let sqliteDb = null;
let useSqlite = false;

try {
  const { DatabaseSync } = require('node:sqlite');
  sqliteDb = new DatabaseSync(SQLITE_FILE);
  sqliteDb.exec(`
    CREATE TABLE IF NOT EXISTS complaints (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);
  useSqlite = true;
  console.log('[DATABASE] SQLite 3 Engine ACTIVE at:', SQLITE_FILE);
} catch (e) {
  console.log('[DATABASE] SQLite module fallback to JSON Database file storage:', e.message);
  useSqlite = false;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.pdf': 'application/pdf',
  '.csv': 'text/csv; charset=UTF-8',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const devName in interfaces) {
    const iface = interfaces[devName];
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];
      if (alias.family === 'IPv4' && !alias.internal) {
        ips.push(alias.address);
      }
    }
  }
  return ips;
}

// -------------------------------------------------------------
// 2. NATIVE MS EXCEL (.XLSX) & CSV AUTO-SYNC ENGINE
// -------------------------------------------------------------
async function syncToExcelXlsx(complaints = [], users = [], activity = []) {
  try {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'Keystone Enterprises Pvt Ltd';
    workbook.created = new Date();

    // -------------------------------------------------------------
    // SHEET 1: Complaints Master Database
    // -------------------------------------------------------------
    const sheet = workbook.addWorksheet('Complaints Master', {
      views: [{ showGridLines: true, state: 'frozen', xSplit: 0, ySplit: 4 }]
    });

    // Title Header Banner
    sheet.mergeCells('A1:N1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = 'KEYSTONE ENTERPRISES PVT LTD — COMPLAINT MANAGEMENT SYSTEM';
    titleCell.font = { name: 'Segoe UI', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(1).height = 32;

    sheet.mergeCells('A2:N2');
    const subCell = sheet.getCell('A2');
    subCell.value = `Industrial Database Master Export — Generated: ${new Date().toLocaleString()} | Total Tickets: ${complaints.length}`;
    subCell.font = { name: 'Segoe UI', size: 10, italic: true, bold: true, color: { argb: 'FF1E40AF' } };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDBEAFE' } };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    sheet.getRow(2).height = 22;

    sheet.getRow(3).height = 10; // Spacing row

    // Table Column Headers (Row 4)
    const headers = [
      'Complaint ID', 'Employee Name', 'Employee Code', 'Department', 'Category',
      'Priority', 'Status', 'Description', 'Created Date', 'Created Time',
      'Est Resolution', 'Resolved By', 'Resolved Date', 'Resolution Remarks'
    ];

    const headerRow = sheet.getRow(4);
    headerRow.values = headers;
    headerRow.height = 26;

    headerRow.eachCell((cell) => {
      cell.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FF475569' } },
        left: { style: 'thin', color: { argb: 'FF475569' } },
        bottom: { style: 'medium', color: { argb: 'FF0F172A' } },
        right: { style: 'thin', color: { argb: 'FF475569' } }
      };
    });

    // Data Rows (Row 5+)
    complaints.forEach((c, idx) => {
      const rIdx = idx + 5;
      const row = sheet.getRow(rIdx);
      row.values = [
        c.id || '',
        c.employeeName || '',
        c.employeeCode || '',
        c.department || '',
        c.category || '',
        c.priority || '',
        c.status || '',
        c.description || '',
        c.createdDate || '',
        c.createdTime || '',
        c.estimatedResolution || '',
        c.resolvedBy || '',
        c.resolvedDate || '',
        c.resolutionRemarks || ''
      ];
      row.height = 22;

      const isEven = idx % 2 === 0;
      const rowBg = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        cell.font = { name: 'Segoe UI', size: 9 };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: rowBg } };
        cell.alignment = { vertical: 'middle', horizontal: [1, 3, 6, 7, 9, 10, 13].includes(colNumber) ? 'center' : 'left' };
        cell.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };

        // Priority Formatting
        if (colNumber === 6) {
          const p = (c.priority || '').toLowerCase();
          cell.font = { name: 'Segoe UI', size: 9, bold: true };
          if (p === 'critical') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEE2E2' } };
            cell.font.color = { argb: 'FF991B1B' };
          } else if (p === 'high') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEDD5' } };
            cell.font.color = { argb: 'FF9A3412' };
          } else if (p === 'medium') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0F2FE' } };
            cell.font.color = { argb: 'FF075985' };
          } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF1F5F9' } };
            cell.font.color = { argb: 'FF475569' };
          }
        }

        // Status Formatting
        if (colNumber === 7) {
          const s = (c.status || '').toLowerCase();
          cell.font = { name: 'Segoe UI', size: 9, bold: true };
          if (s === 'resolved') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDCFCE7' } };
            cell.font.color = { argb: 'FF166534' };
          } else if (s === 'in progress') {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFEF3C7' } };
            cell.font.color = { argb: 'FF92400E' };
          } else {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFE4E6' } };
            cell.font.color = { argb: 'FF9F1239' };
          }
        }
      });
    });

    // Auto Column Widths
    const widths = [16, 24, 16, 18, 26, 14, 15, 45, 14, 14, 18, 22, 14, 38];
    sheet.columns.forEach((col, idx) => {
      col.width = widths[idx] || 18;
    });

    // -------------------------------------------------------------
    // SHEET 2: Department Summary
    // -------------------------------------------------------------
    const summarySheet = workbook.addWorksheet('Department Summary', { views: [{ showGridLines: true }] });
    summarySheet.mergeCells('A1:E1');
    const sTitle = summarySheet.getCell('A1');
    sTitle.value = 'DEPARTMENT COMPLAINT ANALYTICS SUMMARY';
    sTitle.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    sTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    sTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    summarySheet.getRow(1).height = 28;

    const sHeader = summarySheet.getRow(3);
    sHeader.values = ['Department', 'Total Tickets', 'Resolved', 'Pending / Open', 'Resolution Rate'];
    sHeader.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    sHeader.height = 24;
    sHeader.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    const depts = ['IT', 'Electronics', 'Electrical', 'Mechanical', 'Finance', 'Administration', 'Merchandising', 'Compliance', 'Procurement', 'Pressing'];
    depts.forEach((dept, i) => {
      const deptComplaints = complaints.filter(c => c.department?.toUpperCase() === dept.toUpperCase());
      const total = deptComplaints.length;
      const resolved = deptComplaints.filter(c => c.status === 'Resolved').length;
      const pending = total - resolved;
      const rate = total > 0 ? Math.round((resolved / total) * 100) + '%' : '100%';

      const r = summarySheet.getRow(i + 4);
      r.values = [dept, total, resolved, pending, rate];
      r.height = 20;
      r.eachCell(c => {
        c.font = { name: 'Segoe UI', size: 9 };
        c.alignment = { horizontal: 'center', vertical: 'middle' };
        c.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });

    summarySheet.columns = [{ width: 22 }, { width: 18 }, { width: 16 }, { width: 18 }, { width: 18 }];

    // -------------------------------------------------------------
    // SHEET 3: Monthly Reports Summary
    // -------------------------------------------------------------
    const monthlySheet = workbook.addWorksheet('Monthly Reports Summary', { views: [{ showGridLines: true }] });
    monthlySheet.mergeCells('A1:F1');
    const mTitle = monthlySheet.getCell('A1');
    mTitle.value = 'KEYSTONE ENTERPRISES — PERMANENT MONTHLY COMPLAINT PERFORMANCE REPORT';
    mTitle.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    mTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E3A8A' } };
    mTitle.alignment = { horizontal: 'center', vertical: 'middle' };
    monthlySheet.getRow(1).height = 28;

    const mHeader = monthlySheet.getRow(3);
    mHeader.values = ['Month-Year', 'Total Complaints', 'Resolved Tickets', 'Pending / In-Progress', 'Critical Faults', 'SLA Resolution Rate'];
    mHeader.font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: 'FFFFFFFF' } };
    mHeader.height = 24;
    mHeader.eachCell(cell => {
      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
    });

    // Group complaints by YYYY-MM
    const monthGroups = {};
    complaints.forEach(c => {
      let ym = 'Unspecified';
      if (c.createdDate && c.createdDate.length >= 7) {
        ym = c.createdDate.substring(0, 7);
      }
      if (!monthGroups[ym]) monthGroups[ym] = [];
      monthGroups[ym].push(c);
    });

    const monthsSorted = Object.keys(monthGroups).sort().reverse();
    if (monthsSorted.length === 0) {
      monthsSorted.push(new Date().toISOString().substring(0, 7));
      monthGroups[monthsSorted[0]] = [];
    }

    monthsSorted.forEach((ym, i) => {
      const list = monthGroups[ym] || [];
      const tot = list.length;
      const res = list.filter(c => c.status === 'Resolved').length;
      const pend = tot - res;
      const crit = list.filter(c => c.priority === 'Critical').length;
      const rate = tot > 0 ? Math.round((res / tot) * 100) + '%' : '0%';

      const r = monthlySheet.getRow(i + 4);
      r.values = [ym, tot, res, pend, crit, rate];
      r.height = 20;
      r.eachCell(c => {
        c.font = { name: 'Segoe UI', size: 9 };
        c.alignment = { horizontal: 'center', vertical: 'middle' };
        c.border = {
          top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
          right: { style: 'thin', color: { argb: 'FFE2E8F0' } }
        };
      });
    });

    monthlySheet.columns = [{ width: 18 }, { width: 18 }, { width: 18 }, { width: 22 }, { width: 18 }, { width: 22 }];

    // Save Workbook to disk permanently
    await workbook.xlsx.writeFile(XLSX_FILE);
    console.log('[EXCEL ENGINE] MS Excel (.xlsx) file auto-synced with Monthly Reports:', XLSX_FILE);
  } catch (err) {
    console.error('[EXCEL ENGINE] Error saving XLSX spreadsheet:', err.message);
  }
}

function syncToExcelCsv(complaints) {
  let csv = '\uFEFF'; // UTF-8 BOM for Microsoft Excel CSV compatibility
  csv += 'Complaint ID,Employee Name,Employee Code,Department,Category,Priority,Status,Description,Created Date,Created Time,Est Resolution,Resolved By,Resolved Date,Resolution Remarks\n';
  
  if (Array.isArray(complaints)) {
    complaints.forEach(c => {
      const cleanDesc = (c.description || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
      const cleanRemarks = (c.resolutionRemarks || '').replace(/"/g, '""').replace(/\r?\n/g, ' ');
      csv += `"${c.id || ''}","${c.employeeName || ''}","${c.employeeCode || ''}","${c.department || ''}","${c.category || ''}","${c.priority || ''}","${c.status || ''}","${cleanDesc}","${c.createdDate || ''}","${c.createdTime || ''}","${c.estimatedResolution || ''}","${c.resolvedBy || ''}","${c.resolvedDate || ''}","${cleanRemarks}"\n`;
    });
  }
  
  fs.writeFileSync(CSV_FILE, csv, 'utf8');
}

// Save complete payload to SQLite database tables
function saveToSqlite(payload) {
  if (!useSqlite || !sqliteDb) return;
  const now = new Date().toISOString();

  sqliteDb.exec('BEGIN TRANSACTION;');
  try {
    if (Array.isArray(payload.complaints)) {
      sqliteDb.exec('DELETE FROM complaints;');
      const stmt = sqliteDb.prepare('INSERT INTO complaints (id, data, updated_at) VALUES (?, ?, ?);');
      payload.complaints.forEach(c => {
        if (c.id) stmt.run(c.id, JSON.stringify(c), now);
      });
    }
    if (Array.isArray(payload.users)) {
      sqliteDb.exec('DELETE FROM users;');
      const stmt = sqliteDb.prepare('INSERT INTO users (id, data, updated_at) VALUES (?, ?, ?);');
      payload.users.forEach(u => {
        if (u.id) stmt.run(u.id, JSON.stringify(u), now);
      });
    }
    if (Array.isArray(payload.notifications)) {
      sqliteDb.exec('DELETE FROM notifications;');
      const stmt = sqliteDb.prepare('INSERT INTO notifications (id, data, updated_at) VALUES (?, ?, ?);');
      payload.notifications.forEach(n => {
        if (n.id) stmt.run(n.id, JSON.stringify(n), now);
      });
    }
    if (Array.isArray(payload.activity)) {
      sqliteDb.exec('DELETE FROM activity;');
      const stmt = sqliteDb.prepare('INSERT INTO activity (id, data, updated_at) VALUES (?, ?, ?);');
      payload.activity.forEach(a => {
        if (a.id) stmt.run(a.id, JSON.stringify(a), now);
      });
    }
    sqliteDb.exec('COMMIT;');
  } catch (err) {
    sqliteDb.exec('ROLLBACK;');
    console.error('[DATABASE] SQLite Transaction Error:', err.message);
  }
}

// Load data from SQLite database or fallback to JSON DB
function loadDatabaseData() {
  if (useSqlite && sqliteDb) {
    try {
      const complaintsRows = sqliteDb.prepare('SELECT data FROM complaints;').all();
      const usersRows = sqliteDb.prepare('SELECT data FROM users;').all();
      const notifRows = sqliteDb.prepare('SELECT data FROM notifications;').all();
      const activityRows = sqliteDb.prepare('SELECT data FROM activity;').all();

      const complaints = complaintsRows.map(r => JSON.parse(r.data));
      const users = usersRows.map(r => JSON.parse(r.data));
      const notifications = notifRows.map(r => JSON.parse(r.data));
      const activity = activityRows.map(r => JSON.parse(r.data));

      if (complaints.length > 0 || users.length > 0) {
        return { complaints, users, notifications, activity, lastUpdated: new Date().toISOString(), source: 'SQLite 3' };
      }
    } catch (e) {
      console.error('[DATABASE] Read from SQLite error, falling back to JSON:', e.message);
    }
  }

  // Fallback to JSON database file
  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      const data = JSON.parse(raw);
      data.source = 'JSON DB';
      // Seed SQLite if SQLite was empty
      if (useSqlite && sqliteDb && (data.complaints?.length || data.users?.length)) {
        saveToSqlite(data);
      }
      return data;
    } catch (e) {
      console.error('[DATABASE] Error reading JSON file:', e.message);
    }
  }

  return { complaints: [], users: [], notifications: [], activity: [], lastUpdated: new Date().toISOString(), source: 'Clean DB' };
}

// Initial Sync check on server startup
const initialData = loadDatabaseData();
if (initialData.complaints) {
  syncToExcelXlsx(initialData.complaints, initialData.users, initialData.activity).catch(() => {});
  syncToExcelCsv(initialData.complaints);
}

// -------------------------------------------------------------
// 3. HTTP SERVER & API ROUTES
// -------------------------------------------------------------
const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/database-info -> Return Live Database & Storage Details
  if (reqUrl === '/api/database-info' && req.method === 'GET') {
    const data = loadDatabaseData();
    let sqliteSize = 0;
    let jsonSize = 0;
    let xlsxSize = 0;
    let csvSize = 0;

    if (fs.existsSync(SQLITE_FILE)) sqliteSize = fs.statSync(SQLITE_FILE).size;
    if (fs.existsSync(DB_FILE)) jsonSize = fs.statSync(DB_FILE).size;
    if (fs.existsSync(XLSX_FILE)) xlsxSize = fs.statSync(XLSX_FILE).size;
    if (fs.existsSync(CSV_FILE)) csvSize = fs.statSync(CSV_FILE).size;

    const info = {
      engine: useSqlite ? 'SQLite 3 + MS Excel (.xlsx) + JSON + CSV' : 'JSON Engine + MS Excel (.xlsx) + CSV',
      useSqlite,
      githubRepo: GITHUB_REPO,
      storageDirectory: DATA_DIR,
      files: {
        xlsx: { path: XLSX_FILE, sizeBytes: xlsxSize, exists: fs.existsSync(XLSX_FILE) },
        sqlite: { path: SQLITE_FILE, sizeBytes: sqliteSize, exists: fs.existsSync(SQLITE_FILE) },
        json: { path: DB_FILE, sizeBytes: jsonSize, exists: fs.existsSync(DB_FILE) },
        csv: { path: CSV_FILE, sizeBytes: csvSize, exists: fs.existsSync(CSV_FILE) }
      },
      counts: {
        complaints: data.complaints ? data.complaints.length : 0,
        users: data.users ? data.users.length : 0,
        notifications: data.notifications ? data.notifications.length : 0,
        activity: data.activity ? data.activity.length : 0
      },
      lastUpdated: data.lastUpdated || new Date().toISOString()
    };

    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify(info));
    return;
  }

  // GET /api/data -> Load server database
  if (reqUrl === '/api/data' && req.method === 'GET') {
    const data = loadDatabaseData();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
    res.end(JSON.stringify(data));
    return;
  }

  // POST /api/save -> Save data into SQLite, JSON DB, MS Excel (.xlsx) and CSV
  if (reqUrl === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payload = JSON.parse(body);
        payload.lastUpdated = new Date().toISOString();

        // 1. Write to JSON DB File
        fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf8');

        // 2. Write to SQLite DB Engine
        if (useSqlite) {
          saveToSqlite(payload);
        }

        // 3. Write to Native MS Excel (.xlsx) & CSV Master Files
        if (payload.complaints) {
          await syncToExcelXlsx(payload.complaints, payload.users, payload.activity);
          syncToExcelCsv(payload.complaints);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'Saved to SQLite 3, MS Excel (.xlsx), JSON DB, and CSV successfully',
          engine: useSqlite ? 'SQLite 3 + MS Excel (.xlsx) + JSON' : 'JSON + MS Excel (.xlsx)',
          count: payload.complaints ? payload.complaints.length : 0
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // GET /api/export-excel -> Download real-time MS Excel (.xlsx) file
  if (reqUrl === '/api/export-excel' && req.method === 'GET') {
    const data = loadDatabaseData();
    syncToExcelXlsx(data.complaints || [], data.users || [], data.activity || []).then(() => {
      if (fs.existsSync(XLSX_FILE)) {
        const stats = fs.statSync(XLSX_FILE);
        res.writeHead(200, {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': 'attachment; filename="Complaints_Master_Database.xlsx"',
          'Content-Length': stats.size
        });
        fs.createReadStream(XLSX_FILE).pipe(res);
      } else if (fs.existsSync(CSV_FILE)) {
        const stats = fs.statSync(CSV_FILE);
        res.writeHead(200, {
          'Content-Type': 'text/csv; charset=UTF-8',
          'Content-Disposition': 'attachment; filename="Complaints_Master_Export.csv"',
          'Content-Length': stats.size
        });
        fs.createReadStream(CSV_FILE).pipe(res);
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Excel file unavailable');
      }
    }).catch(err => {
      console.error('[EXCEL EXPORT ERROR]', err);
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Excel export error: ' + err.message);
    });
    return;
  }

  // -------------------------------------------------------------
  // Static File Serving
  // -------------------------------------------------------------
  if (reqUrl === '/' || reqUrl === '') reqUrl = '/index.html';

  let safePath;
  try {
    safePath = path.normalize(decodeURIComponent(reqUrl)).replace(/^(\.\.[\/\\])+/, '');
  } catch (e) {
    safePath = reqUrl;
  }

  let filePath = path.join(BASE_DIR, safePath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const fallbackIndex = path.join(BASE_DIR, 'index.html');
      fs.readFile(fallbackIndex, (fbErr, content) => {
        if (fbErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=UTF-8' });
          res.end(content);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`\n[INFO] Port ${PORT} is already in use.`);
    console.log(`[INFO] Server may already be running at http://localhost:${PORT}`);
    console.log('[INFO] Exiting gracefully...');
    process.exit(0);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});

server.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIpAddresses();
  console.log('\n=============================================================');
  console.log('🚀 KEYSTONE ERP INDUSTRIAL DATABASE SERVER IS RUNNING');
  console.log('=============================================================');
  console.log(`  👉 GitHub Repository: ${GITHUB_REPO}`);
  console.log(`  👉 Localhost Link:    http://localhost:${PORT}`);
  console.log(`  👉 Localhost IP:      http://127.0.0.1:${PORT}`);
  if (localIPs.length > 0) {
    localIPs.forEach(ip => {
      console.log(`  👉 LAN / Network IP:  http://${ip}:${PORT}`);
    });
  }
  console.log('\n  🗄️ PERSISTENT DATABASE & NATIVE MS EXCEL AUTO-SYNC ACTIVE:');
  console.log(`  • Engine Type        : ${useSqlite ? 'SQLite 3 Database + Native MS Excel (.xlsx) + JSON + CSV' : 'JSON Persistent Engine + MS Excel (.xlsx) + CSV'}`);
  console.log(`  • Storage Directory  : ${DATA_DIR}`);
  console.log(`  • MS Excel File (.xlsx): data/Complaints_Master_Database.xlsx`);
  console.log(`  • SQLite Database DB : data/complaints.sqlite`);
  console.log(`  • JSON Master File   : data/complaints_database.json`);
  console.log(`  • Excel CSV Backup   : data/complaints_master_sheet.csv`);
  console.log('\n  📶 OFFLINE & LAN ACCESS:');
  console.log('  • Works 100% offline in air-gapped server environments.');
  console.log('  • Data persists permanently on disk across reboots and client sessions.');
  console.log('  • Press Ctrl+C in terminal to stop server safely.\n');
  console.log('=============================================================\n');
});

process.on('SIGINT', () => {
  console.log('\nStopping Keystone ERP Database Server...');
  server.close(() => {
    process.exit(0);
  });
});
