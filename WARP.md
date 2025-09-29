# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Overview

Electron + React (Vite) desktop application for an Eye Clinic management system with a local SQLite database. The app uses a secure preload bridge (contextIsolation) for IPC between the Electron main process and the renderer (React UI). Vite serves and builds two HTML entry points: the authentication flow and the main application UI.

## Common commands

Use Node.js with npm (package-lock.json present). Commands below are defined in package.json and work on Windows PowerShell.

- Install dependencies
  - npm install

- Start development (Vite + Electron)
  - npm run dev
  - Notes: Vite dev server runs on port 3000 (strict). Electron loads http://localhost:3000/auth.html or /index.html in development.

- Electron only (production mode against built files)
  - npm run electron
  - Tip: Ensure the renderer is built first (see build-renderer) so Electron can load dist/*.html.

- Build renderer (Vite)
  - npm run build-renderer
  - Output: dist/

- Full build + package (Vite build then electron-builder)
  - npm run build
  - npm run dist
  - Note: Packaging requires electron-builder to be available in the environment.

- Tests and linting
  - Currently not configured. npm test exits with an error placeholder; there are no eslint/prettier scripts in package.json.

## Architecture and structure

High-level system shape distilled from vite.config.js, main.js, preload.js, database.js, and src/:

- Build tooling and entries (Vite)
  - vite.config.js
    - root: src
    - inputs: src/index.html (main app), src/auth.html (authentication)
    - dev server: port 3000 (strict)
    - build output: dist/ (at repo root)

- Electron main process (entry: main.js)
  - Windows: creates two BrowserWindows:
    - Auth window (auth.html)
    - Main window (index.html)
  - Dev vs prod resource loading:
    - Development (NODE_ENV=development): loads from http://localhost:3000/*.html
    - Production (default): loads dist/*.html from disk
  - App/menu lifecycle:
    - Initializes the SQLite database on startup
    - Shows auth window first; main window opens after login
    - Manages application menu (File/View/Help) and graceful shutdown
  - IPC handlers implemented (examples):
    - auth:isFirstRun, auth:login, auth:logout, auth:getCurrentUser, auth:createUser, auth:completeSetup
    - window:openMain, window:closeAuth
    - db:getSettings, db:setSetting

- Preload bridge (preload.js, contextIsolation enabled)
  - Exposes window.electronAPI with safe invoke-based methods for renderer code.
  - Includes auth, window management, basic settings, and stubbed APIs for patients/tests/reports/chat/file/update events.
  - Event subscription helpers (e.g., onMessage, onUserUpdate, onTestImported) re-emit main-process events into the renderer.

- Local database layer (database.js)
  - Storage: per-user application data directory (Electron app.getPath('userData')) -> eye_clinic.db
  - Tables created on boot:
    - users, patients, tests, reports, chat, settings
  - Key capabilities:
    - initialize/createTables, isFirstRun
    - createUser (bcrypt password hashing), authenticateUser (bcrypt compare)
    - getSetting/setSetting with upsert semantics
    - thin run/all/get helpers around sqlite3

- Renderer (React + Tailwind via Vite)
  - Entrypoints:
    - src/auth.jsx (auth flow)
    - src/main.jsx (main application)
  - HTML:
    - src/auth.html, src/index.html
  - Components (selected):
    - src/components/{AuthApp.jsx, WelcomeScreen.jsx, SetupScreen.jsx, LoginScreen.jsx, MainApp.jsx, LoadingScreen.jsx, Icons.jsx}
  - Styles: src/index.css
  - Renderer accesses privileged operations exclusively through window.electronAPI (preload) using IPC.

## Notes for agents

- Port expectations: The dev server must run on port 3000 (strict). If occupied, vite will fail to start; fix the conflict rather than letting it pick a new port (main.js assumes 3000 in development).
- Environment: Scripts use cross-env to set NODE_ENV for Electron in development; production mode is the default when NODE_ENV is not "development".
- Build order: For production-like runs, build the renderer first (npm run build-renderer) before starting Electron without NODE_ENV=development.
- README vs reality: README.md contains additional aspirational commands (linting, test suites, per-platform packaging). Only use commands that exist in package.json unless you add the missing tooling explicitly.
