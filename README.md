# 🏥 Eye Clinic Management System

<div align="center">
  <img src="https://img.shields.io/badge/Version-2.0.0-blue.svg" alt="Version">
  <img src="https://img.shields.io/badge/React-18.x-61dafb.svg" alt="React">
  <img src="https://img.shields.io/badge/Electron-Latest-47848f.svg" alt="Electron">
  <img src="https://img.shields.io/badge/Tailwind-3.x-38bdf8.svg" alt="Tailwind">
  <img src="https://img.shields.io/badge/SQLite-3.x-003b57.svg" alt="SQLite">
  <img src="https://img.shields.io/badge/License-ISC-green.svg" alt="License">
</div>

<div align="center">
  <h3>🩺 Professional Eye Clinic Management for Medical Professionals</h3>
  <p>A comprehensive desktop application for managing visual field tests, patient records, inventory, and clinic operations with dark mode support</p>
</div>

---

## 📋 Table of Contents

- [🎯 Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🏗️ Architecture](#️-architecture)
- [🚀 Quick Start](#-quick-start)
- [💻 Development](#-development)
- [📦 Features in Detail](#-features-in-detail)
- [🗄️ Database Schema](#️-database-schema)
- [🔒 Security](#-security)
- [🎨 UI/UX Design](#-uiux-design)
- [🚨 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## 🎯 Overview

The **Eye Clinic Management System** is a modern, secure desktop application designed specifically for ophthalmology clinics. Built with cutting-edge web technologies packaged as a native desktop app, it provides a comprehensive solution for managing visual field tests, patient records, inventory, team communication, and clinical workflows.

### 👥 Target Users
- **👨⚕️ Doctors**: Review test results, generate reports, manage patients, communicate with staff
- **👩💼 Clinic Assistants**: Register patients, upload test results, manage inventory, handle data entry
- **🔧 Administrators**: Manage users, monitor system activity, configure settings

### 🎯 Primary Use Cases
- Visual field test data management and analysis
- Patient record keeping and history tracking
- Medical inventory and supplies management
- Clinical report generation and export
- Secure team communication and collaboration
- Clinic operation analytics and insights
- User management and activity monitoring

---

## ✨ Key Features

### 🔐 **Authentication & Security**
- Secure login system with role-based access control (Admin, Doctor, Assistant)
- bcrypt password hashing with salt rounds
- Context isolation and secure IPC communication
- Local-first data approach for medical privacy
- Password visibility toggles on all auth screens
- Activity logging and audit trails

### 🏥 **Complete Onboarding Flow**
- Professional welcome screen with feature showcase
- Multi-step clinic setup wizard
- Administrator account creation
- Automated database initialization
- Dark mode support from first launch

### 📊 **Dashboard & Analytics**
- Real-time statistics and clinic metrics
- Quick action panels for common tasks
- User-specific dashboards based on roles
- Activity feed with recent system events
- Responsive design for different screen sizes
- Dark mode compatible

### 👥 **Patient Management**
- Comprehensive patient registration and profiles
- Advanced search and filter capabilities
- Medical history tracking
- Patient case management
- Test results linked to patient records
- Data export and backup options

### 🔬 **Visual Field Test Management**
- Test result upload and processing
- Machine integration capabilities
- Historical test comparison
- Advanced data visualization
- Test case management per patient
- Support for multiple test types

### 📦 **Inventory Management (Full CRUD)**
- Create, Read, Update, Delete inventory items
- Image upload for inventory items
- Stock level tracking (current, minimum, maximum)
- Low stock warnings and alerts
- Supplier and manufacturer information
- Purchase and expiry date tracking
- Location and category management
- Comprehensive item details (pricing, unit of measure, notes)
- Stock status indicators (In Stock, Warning, Low Stock)

### 📋 **Report Generation**
- Professional PDF report creation
- Customizable report templates
- Batch processing capabilities
- Export and sharing options
- Patient-specific reports

### 💬 **Team Communication**
- Internal messaging between doctors and assistants
- Real-time message display
- Message history and search
- File and image attachment support
- Auto-send images on selection
- Reply to messages
- Message deletion
- Read/unread status tracking
- Dark mode compatible chat interface

### ⚙️ **User Profile & Settings**
- Editable user profiles with photo upload
- Password change functionality
- Role-based preference options
- Email and push notification settings
- Auto backup configuration (doctors only)
- Dark mode toggle
- Success notifications for actions

### 🌙 **Dark Mode Support**
- System-wide dark theme
- Toggle in settings
- Persistent preference storage
- All screens and components themed
- Pleasant color schemes for readability
- Smooth transitions between themes

### 👤 **User Management (Admin)**
- Create, edit, and delete users
- Role assignment (Admin, Doctor, Assistant)
- User status management (Active/Inactive)
- Password reset functionality
- User activity monitoring

### 📊 **Activity Monitoring**
- Comprehensive activity logs
- User action tracking
- Timestamp and details for all activities
- Filter by user, action type, and date range
- Export activity reports
- Audit trail for compliance

---

## 🛠️ Tech Stack

### **Frontend**
- **⚛️ React 18.x** - Modern component-based UI framework
- **🎨 Tailwind CSS 3.x** - Utility-first CSS framework with dark mode
- **⚡ Vite** - Fast build tool and development server
- **🔧 PostCSS** - CSS processing and optimization
- **🧭 React Router** - Client-side routing for navigation

### **Desktop Framework**
- **🖥️ Electron** - Cross-platform desktop app framework
- **🔒 Context Isolation** - Secure renderer process architecture
- **🔌 IPC Communication** - Secure main-renderer data exchange
- **📁 File System Access** - Secure file operations

### **Backend & Database**
- **🗄️ SQLite 3.x** - Lightweight, local database
- **🔐 bcryptjs** - Password hashing and security
- **📊 SQL Schema** - Relational data modeling with migrations

### **Development Tools**
- **📦 npm** - Package management
- **🔄 Concurrently** - Multiple process management
- **🛠️ Electron Builder** - Application packaging and distribution
- **⏳ Wait-on** - Service dependency management

---

## 🏗️ Architecture

### **Application Structure**
```
┌─────────────────────────────────────────────────┐
│           Electron Main Process                 │
│  ┌─────────────────┐    ┌─────────────────────┐ │
│  │   Database      │    │   IPC Handlers     │ │
│  │   Management    │    │   & Security       │ │
│  │   (SQLite)      │    │   (Auth, CRUD)     │ │
│  └─────────────────┘    └─────────────────────┘ │
└─────────────────────────────────────────────────┘
                          │
                    Secure IPC Bridge
                    (Context Isolation)
                          │
┌─────────────────────────────────────────────────┐
│         Electron Renderer Process               │
│  ┌─────────────────────────────────────────────┐ │
│  │          React Application                  │ │
│  │  ┌─────────────┐  ┌─────────────────────┐  │ │
│  │  │ Auth Flow   │  │   Main Dashboard    │  │ │
│  │  │ (Setup,     │  │   (Sidebar Nav,     │  │ │
│  │  │  Login)     │  │    Content Areas)   │  │ │
│  │  └─────────────┘  └─────────────────────┘  │ │
│  │     Styled with Tailwind CSS + Dark Mode   │ │
│  └─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────┐
│              SQLite Database                    │
│  Users │ Patients │ Tests │ Reports │ Chat     │
│  Inventory │ Activity Logs │ Settings          │
└─────────────────────────────────────────────────┘
```

### **Component Architecture**
```
src/
├── components/
│   ├── AuthApp.jsx              # Authentication flow controller
│   ├── MainApp.jsx              # Main application with routing
│   ├── Icons.jsx                # SVG icon library
│   ├── LoadingScreen.jsx        # Loading states
│   ├── layout/
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Side navigation menu
│   │   └── Layout.jsx           # Main layout wrapper
│   ├── content/
│   │   ├── DashboardContent.jsx # Dashboard overview
│   │   ├── PatientsContent.jsx  # Patient list
│   │   ├── InventoryContent.jsx # Inventory list
│   │   ├── MessagesContent.jsx  # Chat interface
│   │   ├── ReportsContent.jsx   # Reports list
│   │   ├── SettingsContent.jsx  # User profile & settings
│   │   └── ChatInputActions.jsx # Chat input icons
│   └── modals/
│       ├── AddPatientModal.jsx  # Patient creation
│       ├── NewMessageModal.jsx  # Message composition
│       ├── LogoutModal.jsx      # Logout confirmation
│       └── UploadTestModal.jsx  # Test upload
├── pages/
│   ├── LoginScreen.jsx          # Login interface
│   ├── SignupScreen.jsx         # User registration
│   ├── SetupScreen.jsx          # Initial setup wizard
│   ├── WelcomeScreen.jsx        # Welcome screen
│   ├── DoctorsDashboard.jsx     # Doctor dashboard
│   ├── AdminDashboard.jsx       # Admin dashboard
│   ├── PatientsScreen.jsx       # Patient management
│   ├── CreateInventoryItemScreen.jsx  # Create/Edit inventory
│   ├── ViewInventoryItemScreen.jsx    # View inventory details
│   └── PatientDetailsRecords.jsx      # Patient details
├── context/
│   ├── ThemeContext.jsx         # Dark mode state
│   └── SystemConfigContext.jsx  # System configuration
├── hooks/
│   ├── useUser.js               # User state management
│   ├── useIPC.js                # IPC communication
│   └── usePatients.js           # Patient data hooks
├── services/
│   ├── DatabaseService.js       # Database operations
│   ├── IPCHandlers.js           # IPC handlers
│   └── patientService.js        # Patient API
└── utils/
    ├── constants.js             # App constants
    ├── formatters.js            # Data formatters
    └── sessionUtils.js          # Session management
```

---

## 🚀 Quick Start

### **Prerequisites**
- **Node.js** v16.0.0 or higher
- **npm** v8.0.0 or higher
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
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **First Launch Experience:**
   - Welcome screen with feature overview
   - Clinic information setup
   - Administrator account creation
   - Automatic database initialization
   - Choose light or dark theme

---

## 💻 Development

### **Available Scripts**

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development with hot reload |
| `npm run build-renderer` | Build React frontend |
| `npm run electron` | Start Electron app |
| `npm run electron-dev` | Start Electron in development mode |
| `npm run build` | Build entire application |
| `npm run dist` | Create distribution packages |

### **Database Location**
- **Windows**: `%APPDATA%/eye-clinic/eye_clinic.db`
- **macOS**: `~/Library/Application Support/eye-clinic/eye_clinic.db`
- **Linux**: `~/.config/eye-clinic/eye_clinic.db`

### **Development Workflow**
1. Run `npm run dev` to start both Vite and Electron
2. Vite dev server runs on `http://localhost:3000`
3. Electron window opens automatically with DevTools
4. Hot reload enabled for React components
5. Database auto-creates on first run

---

## 📦 Features in Detail

### **Inventory Management**

#### Create/Edit Inventory Items
- **Item Information**: Code, name, category, description
- **Quantities**: Current stock, minimum level, maximum level
- **Pricing**: Unit cost, unit of measure
- **Manufacturer**: Name, model number, serial number
- **Supplier**: Name, contact information
- **Dates**: Purchase date, expiry date
- **Location**: Storage location
- **Status**: Active, inactive, discontinued
- **Image**: Upload product image (JPG, PNG, GIF, WEBP)
- **Notes**: Additional information

#### View Inventory
- Table view with images
- Stock status indicators (color-coded)
- Quick actions: View, Edit, Delete
- Search and filter capabilities
- Empty state handling

#### Stock Status Logic
- **Low Stock** (Red): Current ≤ Minimum
- **Warning** (Yellow): Current ≤ 1.5 × Minimum
- **In Stock** (Green): Current > 1.5 × Minimum

### **Messaging System**

#### Chat Features
- Real-time messaging between users
- Message search functionality
- File attachments (documents)
- Image attachments (auto-send on selection)
- Reply to messages
- Delete own messages
- Read/unread status
- Message timestamps
- User avatars and online status
- Dark mode compatible

#### Chat Input Actions
- File icon: Attach documents
- Image icon: Attach images (auto-sends)
- Send icon: Send message
- Grouped beside text input

### **User Profile & Settings**

#### Profile Management
- Profile photo upload
- Edit mode toggle
- Editable fields: Name, email, phone, gender
- Role display (non-editable)
- Password change (optional with toggle)
- Success notifications

#### Preferences
- Email alerts toggle
- Push notifications toggle
- Auto backup (doctors only)
- Dark mode toggle
- Role-based options

### **User Management (Admin Only)**

#### User Administration
- View all users in table
- Create new users
- Edit existing users
- Delete users (with confirmation)
- Assign roles (Admin, Doctor, Assistant)
- Set user status (Active/Inactive)
- Reset passwords

#### Activity Monitoring
- View all system activities
- Filter by user, action, date range
- Activity details and timestamps
- Export activity logs
- Audit trail for compliance

### **Dark Mode**

#### Theme Features
- System-wide dark theme
- Toggle in settings
- Persistent across sessions
- All components themed:
  - Authentication screens
  - Dashboard and navigation
  - Forms and inputs
  - Tables and cards
  - Modals and dialogs
  - Chat interface
  - Inventory screens
- Pleasant color schemes
- Proper contrast ratios
- Smooth transitions

---

## 🗄️ Database Schema

### **Core Tables**

```sql
-- Users with role-based authentication
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'doctor', 'assistant')),
    phone TEXT,
    gender TEXT,
    profile_photo TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Patient records
CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    dob DATE,
    gender TEXT CHECK (gender IN ('male', 'female', 'other')),
    contact TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Visual field test results
CREATE TABLE tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    eye TEXT CHECK (eye IN ('left', 'right', 'both')),
    machine_type TEXT,
    raw_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Inventory management
CREATE TABLE inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_code TEXT UNIQUE NOT NULL,
    item_name TEXT NOT NULL,
    category TEXT,
    description TEXT,
    current_quantity INTEGER DEFAULT 0,
    min_quantity INTEGER DEFAULT 0,
    max_quantity INTEGER,
    unit_cost REAL,
    unit_of_measure TEXT,
    manufacturer TEXT,
    model_number TEXT,
    serial_number TEXT,
    supplier_name TEXT,
    supplier_contact TEXT,
    purchase_date DATE,
    expiry_date DATE,
    location TEXT,
    status TEXT DEFAULT 'active',
    notes TEXT,
    image_path TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    action TEXT NOT NULL,
    details TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Chat messages
CREATE TABLE chat (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    message_text TEXT NOT NULL,
    attachment TEXT,
    reply_to_id INTEGER,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
    FOREIGN KEY (sender_id) REFERENCES users (id),
    FOREIGN KEY (receiver_id) REFERENCES users (id),
    FOREIGN KEY (reply_to_id) REFERENCES chat (id)
);

-- Reports
CREATE TABLE reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    report_file BLOB,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients (id)
);

-- Settings
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
- **🔐 Password Security**: bcrypt hashing with 10 salt rounds
- **🛡️ Context Isolation**: Electron renderer process isolation
- **🔌 Secure IPC**: Controlled main-renderer communication
- **📊 Local Data**: No cloud dependency for sensitive information
- **🎭 Role-Based Access**: Admin, Doctor, and Assistant permission levels
- **🔍 Input Validation**: Client and server-side data validation
- **📝 Activity Logging**: Comprehensive audit trails
- **🔒 Password Visibility**: Toggle for user convenience

### **IPC API Security**
All database operations go through secure IPC channels:
- `auth:*` - Authentication operations
- `patients:*` - Patient management
- `inventory:*` - Inventory operations
- `admin:*` - User and activity management
- `chat:*` - Messaging operations
- `file:*` - File operations

---

## 🎨 UI/UX Design

### **Design System**
- **Color Palette**:
  - Light Mode: Blue gradients, white backgrounds
  - Dark Mode: Dark grays, blue accents
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Components**: Reusable buttons, forms, cards
- **Icons**: Custom SVG icon library

### **Dark Mode**
- Toggle in settings
- Persistent preference
- All components themed
- Proper contrast ratios
- Smooth transitions

### **Accessibility**
- Keyboard navigation
- Screen reader support
- WCAG AA compliance
- Focus indicators
- Color contrast

---

## 🚨 Troubleshooting

### **Application won't start**
```bash
# Check Node.js version
node --version  # Should be v16.0.0+

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Electron cache
npm run clean
```

### **Database errors**
```bash
# Check database location
# Windows: %APPDATA%/eye-clinic/
# macOS: ~/Library/Application Support/eye-clinic/
# Linux: ~/.config/eye-clinic/

# Reset database (WARNING: Deletes all data)
# Delete eye_clinic.db file and restart
npm run dev
```

### **Build failures**
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
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following coding standards
4. Add tests for new functionality
5. Commit using conventional commits
6. Push to your branch
7. Open a Pull Request

### **Commit Message Format**
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

<div align="center">
  <h3>🏥 Built with ❤️ for Medical Professionals</h3>
  <p>Empowering eye clinics with modern technology for better patient care</p>
  
  **Version**: 2.0.0 | **Last Updated**: December 2024
  
  <a href="#top">⬆️ Back to Top</a>
</div>
