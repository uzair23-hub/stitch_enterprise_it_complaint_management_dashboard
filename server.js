/**
 * Keystone Enterprises — Production-Ready Industrial Server
 * Database Engine: SQLite 3 + JSON DB + Real-time Excel CSV Auto-Sync
 * Works online and 100% offline in air-gapped server environments.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

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
// 2. EXCEL CSV REAL-TIME AUTO-SYNC ENGINE
// -------------------------------------------------------------
function syncToExcelCsv(complaints) {
  let csv = '\uFEFF'; // UTF-8 BOM for Microsoft Excel compatibility
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
    let csvSize = 0;

    if (fs.existsSync(SQLITE_FILE)) sqliteSize = fs.statSync(SQLITE_FILE).size;
    if (fs.existsSync(DB_FILE)) jsonSize = fs.statSync(DB_FILE).size;
    if (fs.existsSync(CSV_FILE)) csvSize = fs.statSync(CSV_FILE).size;

    const info = {
      engine: useSqlite ? 'SQLite 3 + JSON + Excel CSV' : 'JSON Persistent Engine + Excel CSV',
      useSqlite,
      githubRepo: GITHUB_REPO,
      storageDirectory: DATA_DIR,
      files: {
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

  // POST /api/save -> Save data into SQLite, JSON DB, and Excel CSV
  if (reqUrl === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        payload.lastUpdated = new Date().toISOString();

        // 1. Write to JSON DB File
        fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf8');

        // 2. Write to SQLite DB Engine
        if (useSqlite) {
          saveToSqlite(payload);
        }

        // 3. Write to Excel CSV Master Sheet
        if (payload.complaints) {
          syncToExcelCsv(payload.complaints);
        }

        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({
          success: true,
          message: 'Saved to SQLite 3, JSON DB, and Excel CSV successfully',
          engine: useSqlite ? 'SQLite 3 + JSON + Excel' : 'JSON + Excel',
          count: payload.complaints ? payload.complaints.length : 0
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // GET /api/export-excel -> Download real-time Excel CSV file
  if (reqUrl === '/api/export-excel' && req.method === 'GET') {
    if (fs.existsSync(CSV_FILE)) {
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': 'attachment; filename="Complaints_Master_Export.csv"'
      });
      fs.createReadStream(CSV_FILE).pipe(res);
    } else {
      syncToExcelCsv([]);
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=UTF-8',
        'Content-Disposition': 'attachment; filename="Complaints_Master_Export.csv"'
      });
      fs.createReadStream(CSV_FILE).pipe(res);
    }
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
  console.log('\n  🗄️ PERSISTENT DATABASE ENGINE ACTIVE:');
  console.log(`  • Engine Type        : ${useSqlite ? 'SQLite 3 Database + JSON + Real-time Excel CSV' : 'JSON Persistent Engine + Excel CSV'}`);
  console.log(`  • Storage Directory  : ${DATA_DIR}`);
  console.log(`  • SQLite Database DB : data/complaints.sqlite`);
  console.log(`  • JSON Master File   : data/complaints_database.json`);
  console.log(`  • Excel Live Auto-Sync: data/complaints_master_sheet.csv`);
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
