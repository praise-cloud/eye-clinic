# 🏥 Eye Clinic Management System

<div align="center">
  <img src="https://img.shields.io/badge/Version-1.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/React-18.x-61dafb.svg" alt="React">
  <img src="https://img.shields.io/badge/Electron-Latest-47848f.svg" alt="Electron">
  <img src="https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg" alt="Tailwind">
  <img src="https://img.shields.io/badge/SQLite-3.x-003b57.svg" alt="SQLite">
  <img src="https://img.shields.io/badge/License-ISC-green.svg" alt="License">
</div>

<div align="center">
  <h3>🩺 Professional Visual Field Test Management for Medical Professionals</h3>
  <p>A comprehensive desktop application for managing visual field tests, patient records, and clinic operations</p>
</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [💻 Development Setup](#-development-setup)
- [🔧 Build & Deploy](#-build--deploy)
- [🌊 Git Workflow](#-git-workflow)
- [📝 Commit Standards](#-commit-standards)
- [🔄 Pull Request Guidelines](#-pull-request-guidelines)
- [🧪 Testing](#-testing)
- [🗄️ Database Schema](#️-database-schema)
- [🔒 Security](#-security)
- [📚 API Documentation](#-api-documentation)
- [🎨 UI/UX Guidelines](#-uiux-guidelines)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎯 Overview

The **Eye Clinic Management System** is a modern, secure desktop application designed specifically for ophthalmology clinics. Built with cutting-edge web technologies packaged as a native desktop app, it provides a comprehensive solution for managing visual field tests, patient records, and clinical workflows.

### 👥 Target Users
- **👨‍⚕️ Doctors**: Review test results, generate reports, communicate with staff
- **👩‍💼 Clinic Assistants**: Register patients, upload test results, manage data entry

### 🎯 Primary Use Cases
- Visual field test data management and analysis
- Patient record keeping and history tracking
- Clinical report generation and export
- Secure team communication and collaboration
- Clinic operation analytics and insights

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- Secure login system with role-based access control
- bcrypt password hashing with salt rounds
- Context isolation and secure IPC communication
- Local-first data approach for medical privacy

### 🏥 **Complete Onboarding Flow**
- Professional welcome screen with feature showcase
- Multi-step clinic setup wizard
- Administrator account creation
- Automated database initialization

### 📊 **Dashboard & Analytics**
- Real-time statistics and clinic metrics
- Quick action panels for common tasks
- User-specific dashboards based on roles
- Responsive design for different screen sizes

### 👥 **Patient Management**
- Comprehensive patient registration and profiles
- Search and filter capabilities
- Medical history tracking
- Data export and backup options

### 🔬 **Visual Field Test Management**
- Test result upload and processing
- Machine integration capabilities
- Historical test comparison
- Advanced data visualization

### 📋 **Report Generation**
- Professional PDF report creation
- Customizable report templates
- Batch processing capabilities
- Export and sharing options

### 💬 **Team Communication**
- Internal messaging between doctors and assistants
- Real-time notifications
- Message history and search
- File attachment support

---

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 18.x** - Modern component-based UI framework
- **🎨 Tailwind CSS 3.x** - Utility-first CSS framework
- **⚡ Vite** - Fast build tool and development server
- **🔧 PostCSS** - CSS processing and optimization

### **Desktop Framework**
- **🖥️ Electron** - Cross-platform desktop app framework
- **🔒 Context Isolation** - Secure renderer process architecture
- **🔌 IPC Communication** - Secure main-renderer data exchange

### **Backend & Database**
- **🗄️ SQLite 3.x** - Lightweight, local database
- **🔐 bcryptjs** - Password hashing and security
- **📊 SQL Schema** - Relational data modeling

### **Development Tools**
- **📦 npm/yarn** - Package management
- **🔄 Concurrently** - Multiple process management
- **🛠️ Electron Builder** - Application packaging and distribution
- **⏳ Wait-on** - Service dependency management

### **Code Quality**
- **📏 ESLint** - Code linting and style checking
- **💅 Prettier** - Code formatting
- **🧪 Jest** - Unit testing framework
- **🔍 React Testing Library** - Component testing

---

## 🏗️ Architecture

### **Application Structure**
```
┌─────────────────────────────────────────────────┐
│                 Electron Main Process           │
│  ┌─────────────────┐    ┌─────────────────────┐ │
│  │   Database      │    │   IPC Handlers     │ │
│  │   Management    │    │   & Security       │ │
│  └─────────────────┘    └─────────────────────┘ │
└─────────────────────────────────────────────────┘
                          │
                    Secure IPC Bridge
                          │
┌─────────────────────────────────────────────────┐
│              Electron Renderer Process          │
│  ┌─────────────────────────────────────────────┐ │
│  │             React Application               │ │
│  │  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │ Auth Flow   │  │   Main Dashboard    │  │ │
│  │  │ Components  │  │   Components        │  │ │
│  │  └─────────────┘  └─────────────────────┘  │ │
│  │           Styled with Tailwind CSS         │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────┐
│                SQLite Database                  │
│   Users │ Patients │ Tests │ Reports │ Chat    │
└─────────────────────────────────────────────────┘
```

### **Component Architecture**
```
src/
├── components/
│   ├── AuthApp.jsx          # Authentication flow controller
│   ├── WelcomeScreen.jsx    # First-run welcome experience
│   ├── SetupScreen.jsx      # Multi-step clinic setup
│   ├── LoginScreen.jsx      # User authentication interface
│   ├── MainApp.jsx          # Main application dashboard
│   ├── LoadingScreen.jsx    # Loading states and transitions
│   └── Icons.jsx            # SVG icon component library
├── styles/
│   └── index.css           # Global styles and Tailwind config
├── auth.jsx                # Authentication app entry point
└── main.jsx                # Main app entry point
```

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher (or **yarn** v1.22.0+)
- **Git** v2.30.0 or higher

### **Installation**

1. **Clone the repository:**
   ```bash
   git clone https://github.com/praise-cloud/eye-clinic.git
   cd eye-clinic
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **First Launch Experience:**
   - Welcome screen with feature overview
   - Clinic information setup
   - Administrator account creation
   - Automatic database initialization

---

## 💻 Development Setup

### **Environment Configuration**

1. **Development Environment:**
   ```bash
   # Start with hot reload and DevTools
   npm run dev
   ```

2. **Production Preview:**
   ```bash
   # Build and preview production version
   npm run build-renderer
   npm run electron
   ```

3. **Database Location:**
   - **Windows**: `%APPDATA%/eye-clinic/eye_clinic.db`
   - **macOS**: `~/Library/Application Support/eye-clinic/eye_clinic.db`
   - **Linux**: `~/.config/eye-clinic/eye_clinic.db`

### **Available Scripts**

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development with hot reload |
| `npm run build-renderer` | Build React frontend |
| `npm run electron` | Start Electron app |
| `npm run electron-dev` | Start Electron in development mode |
| `npm run build` | Build entire application |
| `npm run dist` | Create distribution packages |
| `npm test` | Run test suite |
| `npm run lint` | Run ESLint code analysis |
| `npm run format` | Format code with Prettier |

---

## 🔧 Build & Deploy

### **Building for Production**

1. **Build React frontend:**
   ```bash
   npm run build-renderer
   ```

2. **Create distribution packages:**
   ```bash
   npm run dist
   ```

### **Platform-Specific Builds**

```bash
# Windows
npm run dist:win

# macOS
npm run dist:mac

# Linux
npm run dist:linux
```

### **Output Files**
- **Windows**: `.exe` installer and portable version
- **macOS**: `.dmg` installer and `.app` bundle
- **Linux**: `.AppImage`, `.deb`, and `.rpm` packages

---

## 🌊 Git Workflow

### **Branch Strategy**

We follow the **Git Flow** branching model:

```
main
├── develop
│   ├── feature/auth-system
│   ├── feature/patient-management
│   ├── feature/report-generation
│   └── feature/visual-field-integration
├── release/v1.1.0
└── hotfix/critical-security-patch
```

### **Branch Types**

| Branch | Purpose | Naming Convention |
|--------|---------|------------------|
| `main` | Production-ready code | `main` |
| `develop` | Integration branch | `develop` |
| `feature/*` | New features | `feature/feature-name` |
| `release/*` | Release preparation | `release/v1.0.0` |
| `hotfix/*` | Critical bug fixes | `hotfix/issue-description` |
| `bugfix/*` | Non-critical bug fixes | `bugfix/issue-description` |

### **Workflow Steps**

1. **Feature Development:**
   ```bash
   # Create feature branch from develop
   git checkout develop
   git pull origin develop
   git checkout -b feature/new-feature
   
   # Work on feature
   # ... make changes ...
   
   # Push feature branch
   git push origin feature/new-feature
   
   # Create Pull Request to develop
   ```

2. **Release Process:**
   ```bash
   # Create release branch
   git checkout develop
   git checkout -b release/v1.1.0
   
   # Finalize release
   # Update version numbers, documentation
   
   # Merge to main and develop
   git checkout main
   git merge release/v1.1.0
   git tag v1.1.0
   ```

---

## 📝 Commit Standards

### **Conventional Commits**

We use [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### **Commit Types**

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New features | `feat(auth): add role-based access control` |
| `fix` | Bug fixes | `fix(db): resolve connection timeout issue` |
| `docs` | Documentation | `docs: update API documentation` |
| `style` | Code style changes | `style: fix ESLint warnings` |
| `refactor` | Code refactoring | `refactor(components): extract common UI elements` |
| `test` | Add/update tests | `test(auth): add unit tests for login flow` |
| `chore` | Build/tool changes | `chore: update dependencies` |
| `perf` | Performance improvements | `perf(db): optimize query performance` |
| `ci` | CI/CD changes | `ci: add automated testing workflow` |

### **Commit Message Examples**

```bash
# Good commit messages
git commit -m "feat(patient): add patient search functionality"
git commit -m "fix(auth): resolve login validation error"
git commit -m "docs(README): update installation instructions"
git commit -m "refactor(components): extract reusable form elements"

# Commit with body and footer
git commit -m "feat(reports): add PDF export functionality

Add ability to export patient reports as PDF files with custom templates.
Includes support for batch processing and email delivery.

Closes #123
Reviewed-by: Dr. Smith"
```

---

## 🔄 Pull Request Guidelines

### **PR Requirements**

✅ **Before Creating a PR:**
- [ ] Branch is up-to-date with target branch
- [ ] All tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation is updated if needed
- [ ] Self-review completed

### **PR Template**

```markdown
## 📋 Description
Brief description of changes and motivation.

## 🔧 Type of Change
- [ ] 🐛 Bug fix (non-breaking change)
- [ ] ✨ New feature (non-breaking change)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work)
- [ ] 📚 Documentation update

## 🧪 Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-platform testing (if applicable)

## 📸 Screenshots (if applicable)

## 🔍 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings introduced
- [ ] Accessibility considerations addressed

## 🔗 Related Issues
Closes #issue_number
```

### **Review Process**

1. **Automated Checks**: All CI/CD checks must pass
2. **Code Review**: At least 1 approval from team member
3. **Testing**: QA verification for significant changes
4. **Documentation**: Technical writing review if needed

### **PR Labels**

| Label | Description |
|-------|-------------|
| `🐛 bug` | Bug fixes |
| `✨ enhancement` | New features |
| `📚 documentation` | Documentation updates |
| `🚨 breaking-change` | Breaking changes |
| `⚡ performance` | Performance improvements |
| `🔒 security` | Security-related changes |
| `🎨 ui/ux` | User interface changes |
| `🔧 dependencies` | Dependency updates |

---

## 🧪 Testing

### **Testing Strategy**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e
```

### **Test Structure**
```
tests/
├── unit/              # Unit tests
│   ├── components/    # React component tests
│   ├── utils/         # Utility function tests
│   └── database/      # Database operation tests
├── integration/       # Integration tests
│   ├── auth/          # Authentication flow tests
│   └── api/           # IPC communication tests
├── e2e/              # End-to-end tests
│   ├── onboarding/    # User onboarding flow
│   └── workflows/     # Complete user workflows
└── fixtures/         # Test data and mocks
```

### **Testing Guidelines**

- **Unit Tests**: Test individual components and functions
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows
- **Visual Tests**: Test UI appearance and accessibility
- **Security Tests**: Test authentication and authorization

---

## 🗄️ Database Schema

### **Entity Relationship Diagram**

```sql
-- Users Table
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('doctor', 'assistant')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    contact TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visual Field Tests Table
CREATE TABLE tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    eye TEXT CHECK (eye IN ('left', 'right', 'both')),
    machine_type TEXT,
    raw_data TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Reports Table
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    report_file BLOB, -- PDF file data
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Chat Messages Table
CREATE TABLE chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id)
);

-- Settings Table
CREATE TABLE settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔒 Security

### **Security Measures**

- **🔐 Password Security**: bcrypt hashing with salt rounds
- **🛡️ Context Isolation**: Electron renderer process isolation
- **🔌 Secure IPC**: Controlled main-renderer communication
- **📊 Local Data**: No cloud dependency for sensitive information
- **🎭 Role-Based Access**: Doctor and Assistant permission levels
- **🔍 Input Validation**: Client and server-side data validation

### **Security Best Practices**

1. **Never store passwords in plain text**
2. **Validate all user inputs**
3. **Use parameterized SQL queries**
4. **Implement proper session management**
5. **Regular security audits and updates**

---

## 📚 API Documentation

### **IPC Communication API**

```javascript
// Authentication APIs
window.electronAPI.isFirstRun()                    // Check if first run
window.electronAPI.login(email, password)          // User login
window.electronAPI.logout()                        // User logout
window.electronAPI.createUser(userData)            // Create new user
window.electronAPI.completeSetup(clinicData, adminData) // Complete setup

// Patient Management APIs
window.electronAPI.getPatients(filters)            // Get patient list
window.electronAPI.getPatient(id)                  // Get single patient
window.electronAPI.createPatient(patientData)      // Create patient
window.electronAPI.updatePatient(id, patientData)  // Update patient
window.electronAPI.deletePatient(id)               // Delete patient

// Test Management APIs
window.electronAPI.getTests(filters)               // Get test list
window.electronAPI.createTest(testData)            // Create test
window.electronAPI.updateTest(id, testData)        // Update test
window.electronAPI.deleteTest(id)                  // Delete test
```

---

## 🎨 UI/UX Guidelines

### **Design System**

- **Color Palette**: Blue gradient primary, grayscale secondary
- **Typography**: Inter font family for professional appearance
- **Spacing**: 8px grid system for consistent layout
- **Components**: Reusable button, form, and card components
- **Icons**: Consistent SVG icon library with proper sizing

### **Accessibility**

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and descriptions
- **Color Contrast**: WCAG AA compliance
- **Focus Indicators**: Clear focus states for all interactive elements

---

## 🚨 Troubleshooting

### **Common Issues**

**🐛 Application won't start:**
```bash
# Check Node.js version
node --version  # Should be v16.0.0+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Electron cache
npm run clean
```

**🗄️ Database errors:**
```bash
# Check database location and permissions
# Windows: %APPDATA%/eye-clinic/
# macOS: ~/Library/Application Support/eye-clinic/
# Linux: ~/.config/eye-clinic/

# Reset database (WARNING: This will delete all data)
rm eye_clinic.db
npm run dev
```

**🔧 Build failures:**
```bash
# Clear build cache
npm run clean

# Update dependencies
npm update

# Check for peer dependency issues
npm ls
```

---

## 🤝 Contributing

### **How to Contribute**

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Commit your changes** using conventional commits
6. **Push to your branch** (`git push origin feature/amazing-feature`)
7. **Open a Pull Request** with a clear title and description

### **Code of Conduct**

We are committed to providing a welcoming and inspiring community for all. Please read our [Code of Conduct](CODE_OF_CONDUCT.md) before contributing.

### **Development Team**

- **Lead Developer**: [@praise-cloud](https://github.com/praise-cloud)
- **UI/UX Designer**: TBD
- **Medical Consultant**: TBD
- **QA Engineer**: TBD

---

## 📄 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <h3>🏥 Built with ❤️ for Medical Professionals</h3>
  <p>Empowering eye clinics with modern technology for better patient care</p>
  
  **Version**: 1.0.0 | **Last Updated**: September 2025
  
  <a href="#top">⬆️ Back to Top</a>
</div>
