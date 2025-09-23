const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

class Database {
    constructor(dbPath = null) {
        // Use app data directory for database storage
        const { app } = require('electron');
        const userDataPath = app.getPath('userData');
        
        // Ensure directory exists
        if (!fs.existsSync(userDataPath)) {
            fs.mkdirSync(userDataPath, { recursive: true });
        }
        
        this.dbPath = dbPath || path.join(userDataPath, 'eye_clinic.db');
        this.db = null;
    }

    // Initialize database connection and create tables
    async initialize() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('Error opening database:', err);
                    reject(err);
                    return;
                }
                
                console.log('Connected to SQLite database at:', this.dbPath);
                this.createTables()
                    .then(resolve)
                    .catch(reject);
            });
        });
    }

    // Create all required tables
    async createTables() {
        const queries = [
            // Users table
            `CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                role TEXT NOT NULL CHECK (role IN ('doctor', 'assistant')),
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // Patients table
            `CREATE TABLE IF NOT EXISTS patients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id TEXT UNIQUE NOT NULL,
                first_name TEXT NOT NULL,
                last_name TEXT NOT NULL,
                dob DATE,
                gender TEXT CHECK (gender IN ('male', 'female', 'other')),
                contact TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            
            // Tests table
            `CREATE TABLE IF NOT EXISTS tests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                test_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                eye TEXT CHECK (eye IN ('left', 'right', 'both')),
                machine_type TEXT,
                raw_data TEXT, -- JSON string
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients (id)
            )`,
            
            // Reports table
            `CREATE TABLE IF NOT EXISTS reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                patient_id INTEGER NOT NULL,
                report_date DATETIME DEFAULT CURRENT_TIMESTAMP,
                report_file BLOB, -- PDF file data
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (patient_id) REFERENCES patients (id)
            )`,
            
            // Chat table
            `CREATE TABLE IF NOT EXISTS chat (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                sender_id INTEGER NOT NULL,
                receiver_id INTEGER NOT NULL,
                message_text TEXT NOT NULL,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                status TEXT DEFAULT 'unread' CHECK (status IN ('read', 'unread')),
                FOREIGN KEY (sender_id) REFERENCES users (id),
                FOREIGN KEY (receiver_id) REFERENCES users (id)
            )`,

            // Settings table for application configuration
            `CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                value TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const query of queries) {
            await this.run(query);
        }
        
        console.log('Database tables created successfully');
    }

    // Check if this is the first run (no users exist)
    async isFirstRun() {
        try {
            const users = await this.all('SELECT COUNT(*) as count FROM users');
            return users[0].count === 0;
        } catch (error) {
            console.error('Error checking first run:', error);
            return true; // Assume first run on error
        }
    }

    // User Management
    async createUser(userData) {
        const { name, email, password, role } = userData;
        
        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        const query = `
            INSERT INTO users (name, email, password_hash, role, updated_at)
            VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        try {
            const result = await this.run(query, [name, email, passwordHash, role]);
            console.log('User created successfully:', email);
            return { id: result.lastID, name, email, role };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async authenticateUser(email, password) {
        const query = 'SELECT * FROM users WHERE email = ?';
        
        try {
            const users = await this.all(query, [email]);
            
            if (users.length === 0) {
                return null; // User not found
            }
            
            const user = users[0];
            const isValid = await bcrypt.compare(password, user.password_hash);
            
            if (isValid) {
                // Don't return password hash
                const { password_hash, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }
            
            return null; // Invalid password
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw error;
        }
    }

    async getAllUsers() {
        const query = 'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC';
        return await this.all(query);
    }

    // Settings Management
    async getSetting(key) {
        const query = 'SELECT value FROM settings WHERE key = ?';
        const rows = await this.all(query, [key]);
        return rows.length > 0 ? rows[0].value : null;
    }

    async setSetting(key, value) {
        const query = `
            INSERT INTO settings (key, value, updated_at) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET 
                value = excluded.value,
                updated_at = CURRENT_TIMESTAMP
        `;
        return await this.run(query, [key, value]);
    }

    // Generic database operations
    async run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async all(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }

    async get(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }

    // Close database connection
    close() {
        if (this.db) {
            this.db.close((err) => {
                if (err) {
                    console.error('Error closing database:', err);
                } else {
                    console.log('Database connection closed.');
                }
            });
        }
    }
}

module.exports = Database;