// Run with: node find-bad-chars.js
// Scans src/ and App.js for characters outside safe printable ASCII +
// common accented letters, and reports file:line:column + the exact
// character code so you can find and fix it.
const fs = require('fs');
const path = require('path');

const ROOT_DIRS = ['src', '.']; // scans src/ recursively, plus App.js etc. in root
const EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx'];
const SKIP_DIRS = ['node_modules', '.git', '.expo', 'android', 'ios', 'dist', 'build'];

// Characters considered "safe": standard printable ASCII (0x20-0x7E),
// tab/newline/CR, and common accented Latin letters (café, é, à, etc.)
function isSuspicious(char) {
  const code = char.codePointAt(0);
  if (code === 0x09 || code === 0x0a || code === 0x0d) return false; // tab/LF/CR
  if (code >= 0x20 && code <= 0x7e) return false; // printable ASCII
  if (code >= 0x00c0 && code <= 0x024f) return false; // Latin accented letters
  if (code === 0x2014 || code === 0x2013) return false; // em dash / en dash
  if (code === 0x2018 || code === 0x2019) return false; // curly single quotes
  if (code === 0x201c || code === 0x201d) return false; // curly double quotes
  if (code === 0x2026) return false; // ellipsis …
  if (code === 0x2192 || code === 0x2190) return false; // arrows → ←
  return true; // flag everything else, including U+00A0 (non-breaking space),
               // zero-width chars, BOM, control chars, mojibake, etc.
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const findings = [];

  lines.forEach((line, lineIdx) => {
    for (let col = 0; col < line.length; col++) {
      const char = line[col];
      if (isSuspicious(char)) {
        findings.push({
          line: lineIdx + 1,
          col: col + 1,
          code: 'U+' + char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0'),
          context: line.slice(Math.max(0, col - 15), col + 15),
        });
      }
    }
  });

  return findings;
}

function walk(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (SKIP_DIRS.includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (EXTENSIONS.includes(path.extname(entry.name))) {
      results.push(fullPath);
    }
  }
  return results;
}

console.log('Scanning for suspicious characters...\n');

let totalFound = 0;
const filesToScan = new Set();

for (const dir of ROOT_DIRS) {
  if (dir === '.') {
    // only top-level files, not recursive, to avoid re-scanning src/ twice
    const entries = fs.readdirSync('.', { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && EXTENSIONS.includes(path.extname(entry.name))) {
        filesToScan.add(entry.name);
      }
    }
  } else if (fs.existsSync(dir)) {
    walk(dir).forEach((f) => filesToScan.add(f));
  }
}

for (const file of filesToScan) {
  const findings = scanFile(file);
  if (findings.length > 0) {
    totalFound += findings.length;
    console.log(`\x1b[31m${file}\x1b[0m`);
    findings.forEach((f) => {
      console.log(`  line ${f.line}, col ${f.col}  [${f.code}]  ...${f.context}...`);
    });
  }
}

console.log(`\n${totalFound === 0 ? 'No suspicious characters found.' : `Found ${totalFound} suspicious character(s) — see above.`}`);