/**
 * TechFlow ERP — Production-Ready Zero-Dependency Industrial Server
 * Auto-syncs all entered data to disk in JSON and Excel (CSV) formats.
 * Works online and 100% offline in air-gapped server environments.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;
const DATA_DIR = path.join(BASE_DIR, 'data');

// Ensure data folder exists for Excel & database storage
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_FILE = path.join(DATA_DIR, 'complaints_database.json');
const CSV_FILE = path.join(DATA_DIR, 'complaints_master_sheet.csv');

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

function syncToExcelCsv(complaints) {
  let csv = '\uFEFF'; // UTF-8 BOM for Excel to open properly with international characters
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

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0];

  // Set CORS headers for local network access
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // -------------------------------------------------------------
  // API Endpoints for Backend Data Sync & Excel Persistence
  // -------------------------------------------------------------

  // GET /api/data -> Load server database
  if (reqUrl === '/api/data' && req.method === 'GET') {
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(raw);
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
      res.end(JSON.stringify({ complaints: [], notifications: [], activity: [] }));
    }
    return;
  }

  // POST /api/save -> Save data into JSON database and Excel CSV master file
  if (reqUrl === '/api/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf8');
        if (payload.complaints) {
          syncToExcelCsv(payload.complaints);
        }
        res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8' });
        res.end(JSON.stringify({ success: true, message: 'Saved to database and Excel CSV successfully', count: payload.complaints ? payload.complaints.length : 0 }));
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

server.listen(PORT, '0.0.0.0', () => {
  const localIPs = getLocalIpAddresses();
  console.log('\n=============================================================');
  console.log('🚀 TechFlow ERP Industrial Production Server is RUNNING');
  console.log('=============================================================');
  console.log(`\n  👉 Localhost:       http://localhost:${PORT}`);
  console.log(`  👉 Localhost IP:    http://127.0.0.1:${PORT}`);
  if (localIPs.length > 0) {
    console.log(`  👉 LAN / Server IP: http://${localIPs[0]}:${PORT}`);
  }
  console.log('\n  Features active:');
  console.log('  • 0 Demo Data (Clean production state for industrial deployment)');
  console.log('  • Real-time Excel CSV auto-save to: data/complaints_master_sheet.csv');
  console.log('  • JSON database storage at:        data/complaints_database.json');
  console.log('  • Works 100% offline in air-gapped manufacturing plants');
  console.log('  • Press Ctrl+C in terminal to stop server.\n');
  console.log('=============================================================\n');
});

process.on('SIGINT', () => {
  console.log('\nStopping TechFlow ERP Server...');
  server.close(() => {
    process.exit(0);
  });
});
