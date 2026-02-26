#!/usr/bin/env node

// This script runs BEFORE npm install and removes workspace dependencies
// when installing from GitHub with npm (not pnpm)

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')
const packageJsonPath = join(rootDir, 'package.json')

// Check if we're in a pnpm workspace (development)
const isWorkspace = existsSync(join(rootDir, 'pnpm-workspace.yaml'))

// Check if we're being installed with npm (not pnpm)
const isNpmInstall = process.env.npm_config_user_agent?.startsWith('npm')

if (!isWorkspace && isNpmInstall) {
  console.log('📦 Preparing package for npm installation from GitHub...')

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))

    // Remove workspace dependencies
    if (packageJson.devDependencies) {
      delete packageJson.devDependencies['nuxt-email-renderer-devtools']
    }
    if (packageJson.optionalDependencies) {
      delete packageJson.optionalDependencies['nuxt-email-renderer-devtools']
    }

    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
    console.log('✓ Removed workspace dependencies')
  }
  catch (error) {
    console.warn('Warning: Could not modify package.json:', error.message)
  }
}
