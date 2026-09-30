const path = require('path');

// ── Blocked paths — never allow access to these ──────────────────────────
const BLOCKED_PATHS = [
  'C:\\Windows',
  'C:\\Program Files',
  'C:\\Program Files (x86)',
  'C:\\ProgramData',
  'C:\\$Recycle.Bin',
].map(p => p.toLowerCase());

const BLOCKED_NAMES = [
  '.ssh', '.env', '.git', '.aws', '.azure',
  'AppData', 'cookies', 'login data', 'web data',
  'passwords', 'credential',
];

// ── Default allowed folders (MVP — customize via config later) ───────────
let allowedFolders = [
  'C:\\',
  'D:\\',
  'E:\\',
  'F:\\',
];

function setAllowedFolders(folders) {
  allowedFolders = folders;
}

/**
 * Validate that a path is safe to access:
 * 1. Must be under an allowed root
 * 2. Must not be a blocked system path
 * 3. Must not contain blocked path components
 */
function validatePath(inputPath) {
  // Resolve to absolute to prevent ../ tricks
  const resolved = path.resolve(inputPath).toLowerCase();

  // Check blocked paths
  for (const blocked of BLOCKED_PATHS) {
    if (resolved.startsWith(blocked)) {
      throw new Error(`🚫 Access denied: "${inputPath}" is a protected system path.`);
    }
  }

  // Check blocked name components
  const parts = resolved.split(path.sep);
  for (const part of parts) {
    for (const blocked of BLOCKED_NAMES) {
      if (part.toLowerCase() === blocked.toLowerCase()) {
        throw new Error(`🚫 Access denied: path contains restricted component "${blocked}".`);
      }
    }
  }

  // Check allowed folders (allow all drives in MVP)
  const isAllowed = allowedFolders.some(folder =>
    resolved.startsWith(folder.toLowerCase())
  );

  if (!isAllowed) {
    throw new Error(`🚫 Access denied: "${inputPath}" is not in the allowed folders list.`);
  }

  return path.resolve(inputPath); // Return properly-cased resolved path
}

module.exports = { validatePath, setAllowedFolders, allowedFolders };
