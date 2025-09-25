# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Start Development
```bash
npm run dev
```
This starts both Vite dev server (port 3000) and Electron in development mode with hot reload and DevTools enabled.

### Build Commands
```bash
# Build React frontend only
npm run build-renderer

# Build entire application for distribution
npm run build

# Create distribution packages
npm run dist
```

### Individual Process Commands
```bash
# Start Electron with production build
npm run electron

# Start Electron in development mode
npm run electron-dev

# Preview production build
npm run start
```

### Testing
Currently no test framework is configured. The `npm test` command will fail with "no test specified".

## Architecture Overview

This is an **Electron desktop application** for ophthalmology clinics with the following stack:
- **Frontend**: React 18.x + Tailwind CSS (built with Vite)
- **Backend**: Electron main process with SQLite database
- **Security**: Context isolation with secure IPC communication

### Key Architectural Components

**Electron Multi-Process Architecture:**
- **Main Process** (`main.js`): Handles database, IPC, window management
- **Renderer Process** (`src/`): React application with two entry points:
  - `auth.html/auth.jsx` - Authentication flow (setup + login)
  - `index.html/main.jsx` - Main application dashboard

**Database Layer:**
- `database.js` - Core SQLite operations and table creation
- `services/DatabaseService.js` - Business logic wrapper (singleton pattern)
- `services/IPCHandlers.js` - IPC communication handlers

**Frontend Structure:**
- `src/components/AuthApp.jsx` - Authentication flow controller
- `src/components/MainApp.jsx` - Main dashboard with sidebar navigation
- Screen components: Welcome, Setup, Login, Loading screens
- `src/components/Icons.jsx` - SVG icon library

### Data Models
- **users** - doctors and clinic assistants with role-based access
- **patients** - patient records with search/filter capabilities
- **tests** - visual field test data (JSON storage)
- **reports** - PDF report generation
- **chat** - internal team messaging
- **settings** - application configuration

## Development Guidelines

### Database Location
SQLite database is stored in platform-specific locations:
- Windows: `%APPDATA%/eye-clinic/eye_clinic.db`
- macOS: `~/Library/Application Support/eye-clinic/eye_clinic.db`  
- Linux: `~/.config/eye-clinic/eye_clinic.db`

### Security Architecture
- **Context Isolation**: Enabled in both windows
- **IPC Communication**: All database operations go through secure IPC channels
- **Password Security**: bcrypt hashing with 10 salt rounds
- **No Node Integration**: Renderer processes cannot access Node.js directly

### UI/UX System
- **Design**: Blue gradient theme with custom Tailwind components
- **Components**: Reusable `.btn`, `.card`, `.input` classes in `src/index.css`
- **Typography**: Inter font family
- **Animations**: Custom fade-in and slide-in animations
- **Responsive**: Grid-based layouts with sidebar navigation

### IPC API Patterns
All IPC handlers follow consistent patterns:
- **Auth APIs**: `auth:*` (login, createUser, logout, etc.)
- **Patient APIs**: `patients:*` (CRUD operations)
- **Test APIs**: `tests:*` (visual field test management)
- **Chat APIs**: `chat:*` (messaging system)
- **Settings APIs**: `settings:*` and `db:*`

### Development Workflow
1. First run shows welcome screen and setup wizard
2. Creates admin user and clinic configuration
3. Main app requires authentication for all subsequent launches
4. Role-based UI (doctor vs assistant permissions)

### Configuration Files
- `vite.config.js` - Multi-entry build (auth + main)
- `tailwind.config.js` - Custom theme with primary/secondary colors
- `postcss.config.js` - Tailwind + Autoprefixer
- `preload.js` - Secure API exposure to renderer

## Common Tasks

### Adding New IPC Handlers
1. Add handler in `services/IPCHandlers.js`
2. Add corresponding method in `services/DatabaseService.js` if needed
3. Expose API in `preload.js`
4. Use `window.electronAPI.*` in React components

### Database Schema Changes
1. Modify table creation in `database.js` `createTables()` method
2. Add corresponding service methods in `DatabaseService.js`
3. Test with fresh database (delete existing `.db` file)

### Adding New Screens/Components
- Authentication flow: Add to `AuthApp.jsx` state management
- Main app: Add to `MainApp.jsx` navigation and content sections
- Follow existing component patterns with loading states

### Styling Guidelines
- Use Tailwind utility classes
- Custom components defined in `src/index.css` `@layer components`
- Follow blue gradient theme (primary colors)
- Ensure responsive design (grid layouts)

## Troubleshooting

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
# Navigate to app data directory and delete eye_clinic.db
npm run dev  # Will recreate database
```

### Build Failures
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Development Server Issues
- Vite dev server must be running on port 3000 before Electron starts
- Check that `wait-on http://localhost:3000` succeeds
- DevTools automatically open in development mode

## Power Apps Integration

When building mobile apps, prefer Power Apps Copilot with Dataverse backend, AI Builder integration, and Power Automate for syncing, focusing on accessibility, responsive design, and modern UI themes.