#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

try {
  // Get git commit hash
  const gitHash = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
  const shortHash = gitHash.substring(0, 8);
  
  // Generate timestamp
  const timestamp = new Date().toISOString();
  
  // Create version object
  const version = {
    hash: gitHash,
    shortHash: shortHash,
    timestamp: timestamp,
    buildTime: Date.now()
  };
  
  // Ensure public directory exists
  const publicDir = join(__dirname, '../public');
  mkdirSync(publicDir, { recursive: true });
  
  // Write version.json to public directory
  const versionPath = join(publicDir, 'version.json');
  writeFileSync(versionPath, JSON.stringify(version, null, 2));
  
  console.log(`✓ Version file generated: ${shortHash}`);
  console.log(`  Full hash: ${gitHash}`);
  console.log(`  Timestamp: ${timestamp}`);
  
} catch (error) {
  console.error('Error generating version:', error.message);
  
  // Fallback version for environments without git
  const fallbackVersion = {
    hash: 'unknown',
    shortHash: 'unknown',
    timestamp: new Date().toISOString(),
    buildTime: Date.now()
  };
  
  const publicDir = join(__dirname, '../public');
  mkdirSync(publicDir, { recursive: true });
  
  const versionPath = join(publicDir, 'version.json');
  writeFileSync(versionPath, JSON.stringify(fallbackVersion, null, 2));
  
  console.log('✓ Fallback version file generated');
}