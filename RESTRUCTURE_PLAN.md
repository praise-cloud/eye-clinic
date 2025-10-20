# File Structure Restructure Plan

## Current Issues
1. 17+ duplicate HTML files in /pages/
2. 15+ duplicate CSS files in /styles/
3. Class component (MainApp) mixed with functional components
4. Scattered component organization
5. Empty utility files
6. No proper routing

## Recommended Structure
```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   └── Card.jsx
│   ├── layout/               # Layout components
│   │   ├── Header.jsx ✓
│   │   ├── Sidebar.jsx ✓
│   │   └── Layout.jsx
│   └── features/             # Feature-specific components
│       ├── auth/
│       ├── patients/
│       ├── tests/
│       └── reports/
├── hooks/                    # Custom hooks
│   ├── useUser.js ✓
│   ├── useIPC.js ✓
│   └── useAuth.js
├── pages/                    # Main page components
│   ├── Dashboard.jsx
│   ├── Patients.jsx
│   ├── Tests.jsx
│   └── Reports.jsx
├── utils/                    # Utilities
│   ├── constants.js
│   ├── formatters.js
│   └── api.js
├── styles/                   # Consolidated styles
│   └── globals.css
└── App.jsx                   # Main app component
```

## Immediate Actions Needed

### 1. Clean up duplicate files
- Delete /pages/ folder (17 HTML files)
- Delete /styles/ folder (15 CSS files)
- Remove duplicate auth.html, index.html from src/

### 2. Convert MainApp to functional component
- Use useState instead of this.state
- Use useEffect instead of componentDidMount
- Implement proper hooks pattern

### 3. Fix utility files
- Rename fromatters.js → formatters.js
- Add essential constants
- Create proper API utilities

### 4. Consolidate styles
- Move all styles to src/styles/globals.css
- Remove duplicate CSS files
- Use Tailwind properly

### 5. Implement proper routing
- Add React Router for navigation
- Remove manual section switching
- Create proper page components