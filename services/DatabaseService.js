const Database = require('../database');

class DatabaseService {
    constructor() {
        this.db = null;
        this.initialized = false;
    }

    async initialize() {
        if (!this.initialized) {
            this.db = new Database();
            await this.db.initialize();
            this.initialized = true;
            console.log('DatabaseService initialized successfully');
        }
        return this.db;
    }

    async getDatabase() {
        if (!this.initialized) {
            await this.initialize();
        }
        return this.db;
    }

    // Authentication Operations
    async isFirstRun() {
        const db = await this.getDatabase();
        return await db.isFirstRun();
    }

    async authenticateUser(email, password) {
        const db = await this.getDatabase();
        return await db.authenticateUser(email, password);
    }

    async createUser(userData) {
        const db = await this.getDatabase();
        return await db.createUser(userData);
    }

    async getAllUsers() {
        const db = await this.getDatabase();
        return await db.getAllUsers();
    }

    // Patient Operations
    async getAllPatients(filters = {}) {
        const db = await this.getDatabase();
        let query = `
            SELECT * FROM patients 
            WHERE 1=1
        `;
        const params = [];

        // Add search filters
        if (filters.search) {
            query += ` AND (first_name LIKE ? OR last_name LIKE ? OR patient_id LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (filters.gender) {
            query += ` AND gender = ?`;
            params.push(filters.gender);
        }

        // Add sorting
        query += ` ORDER BY created_at DESC`;

        // Add pagination
        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
            
            if (filters.offset) {
                query += ` OFFSET ?`;
                params.push(parseInt(filters.offset));
            }
        }

        return await db.all(query, params);
    }

    async getPatientById(id) {
        const db = await this.getDatabase();
        return await db.get('SELECT * FROM patients WHERE id = ?', [id]);
    }

    async createPatient(patientData) {
        const db = await this.getDatabase();
        const { patient_id, first_name, last_name, dob, gender, contact } = patientData;
        
        const query = `
            INSERT INTO patients (patient_id, first_name, last_name, dob, gender, contact, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        const result = await db.run(query, [patient_id, first_name, last_name, dob, gender, contact]);
        
        // Return the created patient
        return await this.getPatientById(result.lastID);
    }

    async updatePatient(id, patientData) {
        const db = await this.getDatabase();
        const { patient_id, first_name, last_name, dob, gender, contact } = patientData;
        
        const query = `
            UPDATE patients 
            SET patient_id = ?, first_name = ?, last_name = ?, dob = ?, 
                gender = ?, contact = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        await db.run(query, [patient_id, first_name, last_name, dob, gender, contact, id]);
        
        // Return the updated patient
        return await this.getPatientById(id);
    }

    async deletePatient(id) {
        const db = await this.getDatabase();
        const result = await db.run('DELETE FROM patients WHERE id = ?', [id]);
        return { success: result.changes > 0, deletedCount: result.changes };
    }

    // Visual Field Test Operations
    async getAllTests(filters = {}) {
        const db = await this.getDatabase();
        let query = `
            SELECT t.*, p.first_name, p.last_name, p.patient_id as patient_identifier
            FROM tests t
            LEFT JOIN patients p ON t.patient_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.patientId) {
            query += ` AND t.patient_id = ?`;
            params.push(filters.patientId);
        }

        if (filters.eye) {
            query += ` AND t.eye = ?`;
            params.push(filters.eye);
        }

        if (filters.dateFrom) {
            query += ` AND t.test_date >= ?`;
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ` AND t.test_date <= ?`;
            params.push(filters.dateTo);
        }

        query += ` ORDER BY t.test_date DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
        }

        return await db.all(query, params);
    }

    async getTestById(id) {
        const db = await this.getDatabase();
        return await db.get(`
            SELECT t.*, p.first_name, p.last_name, p.patient_id as patient_identifier
            FROM tests t
            LEFT JOIN patients p ON t.patient_id = p.id
            WHERE t.id = ?
        `, [id]);
    }

    async createTest(testData) {
        const db = await this.getDatabase();
        const { patient_id, eye, machine_type, raw_data, test_date } = testData;
        
        const query = `
            INSERT INTO tests (patient_id, eye, machine_type, raw_data, test_date, updated_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;
        
        const result = await db.run(query, [
            patient_id, 
            eye, 
            machine_type, 
            JSON.stringify(raw_data),
            test_date || new Date().toISOString()
        ]);
        
        return await this.getTestById(result.lastID);
    }

    async updateTest(id, testData) {
        const db = await this.getDatabase();
        const { eye, machine_type, raw_data, test_date } = testData;
        
        const query = `
            UPDATE tests 
            SET eye = ?, machine_type = ?, raw_data = ?, test_date = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;
        
        await db.run(query, [eye, machine_type, JSON.stringify(raw_data), test_date, id]);
        return await this.getTestById(id);
    }

    async deleteTest(id) {
        const db = await this.getDatabase();
        const result = await db.run('DELETE FROM tests WHERE id = ?', [id]);
        return { success: result.changes > 0, deletedCount: result.changes };
    }

    // Chat/Messaging Operations
    async getMessages(userId, otherUserId = null) {
        const db = await this.getDatabase();
        let query = `
            SELECT c.*, 
                   s.name as sender_name, s.role as sender_role,
                   r.name as receiver_name, r.role as receiver_role
            FROM chat c
            LEFT JOIN users s ON c.sender_id = s.id
            LEFT JOIN users r ON c.receiver_id = r.id
            WHERE (c.sender_id = ? OR c.receiver_id = ?)
        `;
        const params = [userId, userId];

        if (otherUserId) {
            query += ` AND (c.sender_id = ? OR c.receiver_id = ?)`;
            params.push(otherUserId, otherUserId);
        }

        query += ` ORDER BY c.timestamp DESC LIMIT 100`;

        return await db.all(query, params);
    }

    async sendMessage(senderId, receiverId, messageText) {
        const db = await this.getDatabase();
        const query = `
            INSERT INTO chat (sender_id, receiver_id, message_text)
            VALUES (?, ?, ?)
        `;
        
        const result = await db.run(query, [senderId, receiverId, messageText]);
        
        // Return the created message with user details
        return await db.get(`
            SELECT c.*, 
                   s.name as sender_name, s.role as sender_role,
                   r.name as receiver_name, r.role as receiver_role
            FROM chat c
            LEFT JOIN users s ON c.sender_id = s.id
            LEFT JOIN users r ON c.receiver_id = r.id
            WHERE c.id = ?
        `, [result.lastID]);
    }

    async markMessageAsRead(messageId, userId) {
        const db = await this.getDatabase();
        const query = `
            UPDATE chat 
            SET status = 'read' 
            WHERE id = ? AND receiver_id = ?
        `;
        
        const result = await db.run(query, [messageId, userId]);
        return { success: result.changes > 0 };
    }

    async getUnreadMessageCount(userId) {
        const db = await this.getDatabase();
        const result = await db.get(`
            SELECT COUNT(*) as count 
            FROM chat 
            WHERE receiver_id = ? AND status = 'unread'
        `, [userId]);
        
        return result.count || 0;
    }

    // Settings Operations
    async getSetting(key) {
        const db = await this.getDatabase();
        return await db.getSetting(key);
    }

    async setSetting(key, value) {
        const db = await this.getDatabase();
        return await db.setSetting(key, value);
    }

    async getAllSettings() {
        const db = await this.getDatabase();
        const settings = await db.all('SELECT * FROM settings ORDER BY key');
        
        // Convert to key-value object
        const settingsObj = {};
        settings.forEach(setting => {
            settingsObj[setting.key] = setting.value;
        });
        
        return settingsObj;
    }

    // Statistics and Analytics
    async getDashboardStats() {
        const db = await this.getDatabase();
        
        const [patients, tests, reports, messages] = await Promise.all([
            db.get('SELECT COUNT(*) as count FROM patients'),
            db.get('SELECT COUNT(*) as count FROM tests WHERE date(test_date) = date("now")'),
            db.get('SELECT COUNT(*) as count FROM reports WHERE date(report_date) = date("now")'),
            db.get('SELECT COUNT(*) as count FROM chat WHERE status = "unread"')
        ]);

        return {
            totalPatients: patients.count || 0,
            todaysTests: tests.count || 0,
            todaysReports: reports.count || 0,
            unreadMessages: messages.count || 0
        };
    }

    // Database Management
    async backupDatabase() {
        // This would implement database backup functionality
        const db = await this.getDatabase();
        // Implementation depends on requirements - could copy file or export data
        return { success: true, message: 'Backup functionality to be implemented' };
    }

    async closeDatabase() {
        if (this.db) {
            this.db.close();
            this.initialized = false;
        }
    }
}

// Export singleton instance
module.exports = new DatabaseService();