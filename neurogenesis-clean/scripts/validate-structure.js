#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const REQUIRED_DIRECTORIES = [
  'src/app',
  'src/app/debates',
  'src/app/debates/[debateId]',
  'src/app/debates/[debateId]/analysis',
  'src/app/debates/[debateId]/transcript',
  'src/actions',
  'src/actions/ai',
  'src/actions/db',
  'src/components',
  'src/lib',
  'src/types'
];

const REQUIRED_FILES = [
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/app/debates/[debateId]/page.tsx',
  'src/app/debates/[debateId]/analysis/page.tsx',
  'src/app/debates/[debateId]/transcript/page.tsx',
  'src/actions/ai/analysis-actions.ts',
  'next.config.js',
  'tsconfig.json'
];

// Validate directories
console.log('Validating required directories...');
const missingDirs = [];
for (const dir of REQUIRED_DIRECTORIES) {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    missingDirs.push(dir);
  }
}

// Validate files
console.log('Validating required files...');
const missingFiles = [];
for (const file of REQUIRED_FILES) {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    missingFiles.push(file);
  }
}

// Check for client component usage in server component files
console.log('Checking for proper client/server component usage...');
const serverComponentIssues = [];
function checkServerComponentFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      checkServerComponentFiles(fullPath);
    } 
    else if (entry.name === 'page.tsx' || entry.name === 'layout.tsx') {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes("'use client'") || content.includes('"use client"')) {
        serverComponentIssues.push(fullPath);
      }
    }
  }
}
checkServerComponentFiles(path.join(process.cwd(), 'src/app'));

// Report issues
let hasErrors = false;

if (missingDirs.length > 0) {
  console.error('❌ Missing required directories:');
  missingDirs.forEach(dir => console.error(`  - ${dir}`));
  hasErrors = true;
}

if (missingFiles.length > 0) {
  console.error('❌ Missing required files:');
  missingFiles.forEach(file => console.error(`  - ${file}`));
  hasErrors = true;
}

if (serverComponentIssues.length > 0) {
  console.error('❌ Server component files with "use client" directive:');
  serverComponentIssues.forEach(file => console.error(`  - ${file}`));
  hasErrors = true;
}

if (hasErrors) {
  console.error('❌ Structure validation failed');
  process.exit(1);
} else {
  console.log('✅ Structure validation passed');
}