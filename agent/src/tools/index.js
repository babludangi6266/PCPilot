const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { validatePath } = require('../security/allowedPaths');

// ── Tool: get_drives ─────────────────────────────────────────────────────
async function getDrives() {
  return new Promise((resolve, reject) => {
    exec('wmic logicaldisk get name,size,freespace,description /format:csv', (err, stdout) => {
      if (err) {
        // Fallback: try PowerShell
        exec('powershell -Command "Get-PSDrive -PSProvider FileSystem | Select-Object Name,Used,Free,Root | ConvertTo-Json"',
          (err2, stdout2) => {
            if (err2) return reject(new Error('Failed to list drives'));
            try {
              const drives = JSON.parse(stdout2);
              const driveList = (Array.isArray(drives) ? drives : [drives]).map(d => ({
                letter: d.Name + ':',
                root: d.Root,
                usedGB: d.Used ? (d.Used / 1073741824).toFixed(1) : 'N/A',
                freeGB: d.Free ? (d.Free / 1073741824).toFixed(1) : 'N/A',
              }));
              resolve({ drives: driveList });
            } catch {
              resolve({ drives: [{ letter: 'C:', root: 'C:\\' }] });
            }
          }
        );
        return;
      }

      const lines = stdout.trim().split('\n').filter(l => l.trim());
      const drives = [];
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length >= 4) {
          const description = parts[1]?.trim() || '';
          const freeSpace = parts[2]?.trim();
          const name = parts[3]?.trim();
          const size = parts[4]?.trim();
          if (name) {
            drives.push({
              letter: name,
              description,
              totalGB: size ? (parseInt(size) / 1073741824).toFixed(1) : 'N/A',
              freeGB: freeSpace ? (parseInt(freeSpace) / 1073741824).toFixed(1) : 'N/A',
            });
          }
        }
      }

      if (drives.length === 0) {
        drives.push({ letter: 'C:', root: 'C:\\', description: 'Local Disk' });
      }

      resolve({ drives });
    });
  });
}

// ── Tool: list_directory ─────────────────────────────────────────────────
async function listDirectory({ path: dirPath }) {
  const safePath = validatePath(dirPath);

  const entries = await fs.promises.readdir(safePath, { withFileTypes: true });
  const items = [];
  const MAX_ITEMS = 50; // Cap to save tokens

  for (const entry of entries.slice(0, MAX_ITEMS)) {
    const fullPath = path.join(safePath, entry.name);
    const item = {
      name: entry.name,
      type: entry.isDirectory() ? 'folder' : 'file',
      path: fullPath,
    };

    try {
      if (entry.isFile()) {
        const stat = await fs.promises.stat(fullPath);
        item.size = formatSize(stat.size);
        item.modified = stat.mtime.toISOString().split('T')[0];
        item.extension = path.extname(entry.name).toLowerCase();
      }
    } catch {
      // Skip files we can't stat (permission issues)
    }

    items.push(item);
  }

  // Sort: folders first, then files alphabetically
  items.sort((a, b) => {
    if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const truncated = entries.length > MAX_ITEMS;

  return {
    path: safePath,
    totalItems: entries.length,
    showing: items.length,
    truncated,
    items,
  };
}

// ── Tool: open_file ──────────────────────────────────────────────────────
async function openFile({ path: filePath }) {
  const safePath = validatePath(filePath);

  // Check file exists
  const stat = await fs.promises.stat(safePath);
  if (!stat.isFile()) {
    throw new Error(`"${filePath}" is not a file.`);
  }

  // Dynamically import 'open' (it's ESM-only)
  const { default: open } = await import('open');
  await open(safePath);

  return {
    success: true,
    message: `Opened "${path.basename(safePath)}" in the default application.`,
    file: path.basename(safePath),
    path: safePath,
  };
}

// ── Tool: open_folder ────────────────────────────────────────────────────
async function openFolder({ path: folderPath }) {
  const safePath = validatePath(folderPath);

  const stat = await fs.promises.stat(safePath);
  if (!stat.isDirectory()) {
    throw new Error(`"${folderPath}" is not a folder.`);
  }

  const { default: open } = await import('open');
  await open(safePath);

  return {
    success: true,
    message: `Opened "${path.basename(safePath)}" in File Explorer.`,
    folder: path.basename(safePath),
    path: safePath,
  };
}

// ── Tool: search_files ───────────────────────────────────────────────────
async function searchFiles({ root, query, maxResults = 20 }) {
  const safePath = validatePath(root);
  const results = [];
  const queryLower = query.toLowerCase();

  async function walk(dir, depth = 0) {
    if (depth > 5 || results.length >= maxResults) return; // Limit depth and results

    try {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      for (const entry of entries) {
        if (results.length >= maxResults) break;

        const fullPath = path.join(dir, entry.name);

        // Skip hidden and system folders
        if (entry.name.startsWith('.') || entry.name.startsWith('$')) continue;
        if (entry.name === 'node_modules' || entry.name === '__pycache__') continue;

        if (entry.name.toLowerCase().includes(queryLower)) {
          results.push({
            name: entry.name,
            type: entry.isDirectory() ? 'folder' : 'file',
            path: fullPath,
          });
        }

        if (entry.isDirectory()) {
          await walk(fullPath, depth + 1);
        }
      }
    } catch {
      // Skip inaccessible directories
    }
  }

  await walk(safePath);

  return {
    query,
    root: safePath,
    resultCount: results.length,
    results,
  };
}

// ── Tool: read_text_file ─────────────────────────────────────────────────
async function readTextFile({ path: filePath, maxChars = 5000 }) {
  const safePath = validatePath(filePath);

  const stat = await fs.promises.stat(safePath);
  if (!stat.isFile()) {
    throw new Error(`"${filePath}" is not a file.`);
  }

  // Check if file is too large
  if (stat.size > 10 * 1024 * 1024) {
    throw new Error('File is too large (>10MB). Cannot read.');
  }

  const content = await fs.promises.readFile(safePath, 'utf-8');
  const truncated = content.length > maxChars;

  return {
    path: safePath,
    fileName: path.basename(safePath),
    size: formatSize(stat.size),
    content: content.slice(0, maxChars),
    truncated,
    totalChars: content.length,
  };
}

// ── Tool: open_app ───────────────────────────────────────────────────────
async function openApp({ appName }) {
  const APP_MAP = {
    chrome: 'chrome',
    'google chrome': 'chrome',
    firefox: 'firefox',
    edge: 'msedge',
    'microsoft edge': 'msedge',
    notepad: 'notepad',
    vscode: 'code',
    'visual studio code': 'code',
    calculator: 'calc',
    calc: 'calc',
    explorer: 'explorer',
    'file explorer': 'explorer',
    cmd: 'cmd',
    'command prompt': 'cmd',
    powershell: 'powershell',
    paint: 'mspaint',
    wordpad: 'wordpad',
    'task manager': 'taskmgr',
    'control panel': 'control',
    settings: 'ms-settings:',
    spotify: 'spotify',
    'snipping tool': 'snippingtool',
  };

  const key = appName.toLowerCase().trim();
  const command = APP_MAP[key];

  if (!command) {
    const available = Object.keys(APP_MAP).join(', ');
    throw new Error(`Unknown app "${appName}". Available apps: ${available}`);
  }

  return new Promise((resolve, reject) => {
    exec(`start "" "${command}"`, (err) => {
      if (err) {
        reject(new Error(`Failed to open ${appName}: ${err.message}`));
      } else {
        resolve({
          success: true,
          message: `Opened ${appName}.`,
          app: appName,
        });
      }
    });
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

// ── Tool dispatcher ─────────────────────────────────────────────────────
const TOOLS = {
  get_drives: getDrives,
  list_directory: listDirectory,
  open_file: openFile,
  open_folder: openFolder,
  search_files: searchFiles,
  read_text_file: readTextFile,
  open_app: openApp,
};

async function executeTool(name, args) {
  const fn = TOOLS[name];
  if (!fn) {
    throw new Error(`Unknown tool: ${name}`);
  }
  return await fn(args);
}

module.exports = {
  executeTool,
  getDrives,
  listDirectory,
  openFile,
  openFolder,
  searchFiles,
  readTextFile,
  openApp,
};
