#!/usr/bin/env node

// This script runs during `npm install` from GitHub or during development
// It gracefully handles both scenarios

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Check if we're in a development environment (has pnpm-workspace.yaml)
const isDevEnvironment = existsSync(join(rootDir, 'pnpm-workspace.yaml'))

// Check if dist folder exists (pre-built package)
const hasDistFolder = existsSync(join(rootDir, 'dist'))

if (hasDistFolder && !isDevEnvironment) {
  // Installing from GitHub with pre-built dist folder
  console.log('✓ Using pre-built package')
  process.exit(0)
}

if (isDevEnvironment) {
  // Development environment - run the full prepare
  try {
    console.log('Running development prepare...')
    execSync('nuxi prepare client', { stdio: 'inherit', cwd: rootDir })
  }
  catch {
    console.warn('Warning: Could not run nuxi prepare client')
    process.exit(0)
  }
}
else {
  // Installing from GitHub without dist folder - this shouldn't happen
  // but we'll be graceful about it
  console.log('⚠ No pre-built package found. The module may not work correctly.')
  console.log('  Please ensure the dist folder is committed to the release branch.')
  process.exit(0)
}
