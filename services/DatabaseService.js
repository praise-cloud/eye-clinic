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

// class DatabaseService {
//   constructor(db) {
//     this.db = db;
//   }

  async isFirstRun() {
    // Check if "users" table has any data
    const row = await this.db.get("SELECT COUNT(*) as count FROM users");
    return row.count === 0;  // true = no users, so first run
  }

//   async getUserByUsername(username) {
//     return await this.db.get("SELECT * FROM users WHERE username = ?", [username]);
//   }
// }


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
    async getMessages(userId, otherUserId = null, search = '') {
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
        if (search) {
            query += ` AND c.message_text LIKE ?`;
            params.push(`%${search}%`);
        }
        query += ` ORDER BY c.timestamp DESC LIMIT 100`;
        return await db.all(query, params);
    }

    async sendMessage(senderId, receiverId, messageText, attachment = null) {
        const db = await this.getDatabase();
        const query = `
            INSERT INTO chat (sender_id, receiver_id, message_text, attachment)
            VALUES (?, ?, ?, ?)
        `;
        const result = await db.run(query, [senderId, receiverId, messageText, attachment]);
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

    async deleteMessage(messageId, userId) {
        const db = await this.getDatabase();
        // Only allow sender or receiver to delete
        const message = await db.get('SELECT * FROM chat WHERE id = ?', [messageId]);
        if (!message || (message.sender_id !== userId && message.receiver_id !== userId)) {
            return { error: 'Not authorized to delete this message' };
        }
        const result = await db.run('DELETE FROM chat WHERE id = ?', [messageId]);
        return { success: result.changes > 0 };
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

    // Report Operations
    async getAllReports(filters = {}) {
        const db = await this.getDatabase();
        let query = `
            SELECT r.*, p.first_name, p.last_name, p.patient_id as patient_identifier
            FROM reports r
            LEFT JOIN patients p ON r.patient_id = p.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.patientId) {
            query += ` AND r.patient_id = ?`;
            params.push(filters.patientId);
        }

        if (filters.dateFrom) {
            query += ` AND r.report_date >= ?`;
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ` AND r.report_date <= ?`;
            params.push(filters.dateTo);
        }

        query += ` ORDER BY r.report_date DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
        }

        return await db.all(query, params);
    }

    async getReportById(id) {
        const db = await this.getDatabase();
        return await db.get(`
            SELECT r.*, p.first_name, p.last_name, p.patient_id as patient_identifier
            FROM reports r
            LEFT JOIN patients p ON r.patient_id = p.id
            WHERE r.id = ?
        `, [id]);
    }

    async createReport(reportData) {
        const db = await this.getDatabase();
        const { patient_id, report_file, report_date, report_type, title } = reportData;

        const query = `
            INSERT INTO reports (patient_id, report_file, report_date, report_type, title, created_at)
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const result = await db.run(query, [
            patient_id,
            report_file, // This will be binary PDF data
            report_date || new Date().toISOString(),
            report_type || 'visual_field_report',
            title
        ]);

        return await this.getReportById(result.lastID);
    }

    async updateReport(id, reportData) {
        const db = await this.getDatabase();
        const { report_file, report_type, title } = reportData;

        const query = `
            UPDATE reports
            SET report_file = ?, report_type = ?, title = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await db.run(query, [report_file, report_type, title, id]);
        return await this.getReportById(id);
    }

    async deleteReport(id) {
        const db = await this.getDatabase();
        const result = await db.run('DELETE FROM reports WHERE id = ?', [id]);
        return { success: result.changes > 0, deletedCount: result.changes };
    }

    // Inventory Operations
    async getAllInventoryItems(filters = {}) {
        const db = await this.getDatabase();
        let query = `
            SELECT i.*, u.name as last_updated_by_name
            FROM inventory i
            LEFT JOIN users u ON i.last_updated_by = u.id
            WHERE 1=1
        `;
        const params = [];

        // Search filter
        if (filters.search) {
            query += ` AND (i.item_name LIKE ? OR i.item_code LIKE ? OR i.description LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        // Category filter
        if (filters.category) {
            query += ` AND i.category = ?`;
            params.push(filters.category);
        }

        // Status filter
        if (filters.status) {
            query += ` AND i.status = ?`;
            params.push(filters.status);
        }

        // Low stock filter
        if (filters.lowStock) {
            query += ` AND i.current_quantity <= i.minimum_quantity`;
        }

        // Expiring soon filter (within 30 days)
        if (filters.expiringSoon) {
            query += ` AND i.expiry_date IS NOT NULL AND i.expiry_date <= date('now', '+30 days')`;
        }

        // Location filter
        if (filters.location) {
            query += ` AND i.location LIKE ?`;
            params.push(`%${filters.location}%`);
        }

        // Sorting
        const sortBy = filters.sortBy || 'item_name';
        const sortOrder = filters.sortOrder || 'ASC';
        query += ` ORDER BY i.${sortBy} ${sortOrder}`;

        // Pagination
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

    async getInventoryItemById(id) {
        const db = await this.getDatabase();
        return await db.get(`
            SELECT i.*, u.name as last_updated_by_name
            FROM inventory i
            LEFT JOIN users u ON i.last_updated_by = u.id
            WHERE i.id = ?
        `, [id]);
    }

    async getInventoryItemByCode(itemCode) {
        const db = await this.getDatabase();
        return await db.get(`
            SELECT i.*, u.name as last_updated_by_name
            FROM inventory i
            LEFT JOIN users u ON i.last_updated_by = u.id
            WHERE i.item_code = ?
        `, [itemCode]);
    }

    async createInventoryItem(itemData) {
        const db = await this.getDatabase();
        const {
            item_code, item_name, category, description, manufacturer,
            model_number, serial_number, current_quantity, minimum_quantity,
            maximum_quantity, unit_of_measure, unit_cost, supplier_name,
            supplier_contact, purchase_date, expiry_date, location,
            status, last_updated_by, notes
        } = itemData;

        const query = `
            INSERT INTO inventory (
                item_code, item_name, category, description, manufacturer,
                model_number, serial_number, current_quantity, minimum_quantity,
                maximum_quantity, unit_of_measure, unit_cost, supplier_name,
                supplier_contact, purchase_date, expiry_date, location,
                status, last_updated_by, notes, updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `;

        const result = await db.run(query, [
            item_code, item_name, category, description, manufacturer,
            model_number, serial_number, current_quantity || 0, minimum_quantity || 0,
            maximum_quantity || 100, unit_of_measure || 'pieces', unit_cost || 0,
            supplier_name, supplier_contact, purchase_date, expiry_date, location,
            status || 'active', last_updated_by, notes
        ]);

        return await this.getInventoryItemById(result.lastID);
    }

    async updateInventoryItem(id, itemData) {
        const db = await this.getDatabase();
        const {
            item_name, category, description, manufacturer, model_number,
            serial_number, current_quantity, minimum_quantity, maximum_quantity,
            unit_of_measure, unit_cost, supplier_name, supplier_contact,
            purchase_date, expiry_date, location, status, last_updated_by, notes
        } = itemData;

        const query = `
            UPDATE inventory SET
                item_name = ?, category = ?, description = ?, manufacturer = ?,
                model_number = ?, serial_number = ?, current_quantity = ?,
                minimum_quantity = ?, maximum_quantity = ?, unit_of_measure = ?,
                unit_cost = ?, supplier_name = ?, supplier_contact = ?,
                purchase_date = ?, expiry_date = ?, location = ?, status = ?,
                last_updated_by = ?, notes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await db.run(query, [
            item_name, category, description, manufacturer, model_number,
            serial_number, current_quantity, minimum_quantity, maximum_quantity,
            unit_of_measure, unit_cost, supplier_name, supplier_contact,
            purchase_date, expiry_date, location, status, last_updated_by, notes, id
        ]);

        return await this.getInventoryItemById(id);
    }

    async updateInventoryQuantity(id, newQuantity, userId, notes = null) {
        const db = await this.getDatabase();

        const query = `
            UPDATE inventory SET
                current_quantity = ?,
                last_updated_by = ?,
                notes = CASE WHEN ? IS NOT NULL THEN ? ELSE notes END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await db.run(query, [newQuantity, userId, notes, notes, id]);
        return await this.getInventoryItemById(id);
    }

    async deleteInventoryItem(id) {
        const db = await this.getDatabase();
        const result = await db.run('DELETE FROM inventory WHERE id = ?', [id]);
        return { success: result.changes > 0, deletedCount: result.changes };
    }

    async getInventoryStatistics() {
        const db = await this.getDatabase();

        const [totalItems, lowStockItems, expiringSoon, totalValue, categories] = await Promise.all([
            db.get('SELECT COUNT(*) as count FROM inventory WHERE status = "active"'),
            db.get('SELECT COUNT(*) as count FROM inventory WHERE status = "active" AND current_quantity <= minimum_quantity'),
            db.get('SELECT COUNT(*) as count FROM inventory WHERE status = "active" AND expiry_date IS NOT NULL AND expiry_date <= date("now", "+30 days")'),
            db.get('SELECT SUM(current_quantity * unit_cost) as total FROM inventory WHERE status = "active"'),
            db.all('SELECT category, COUNT(*) as count FROM inventory WHERE status = "active" GROUP BY category')
        ]);

        return {
            totalItems: totalItems.count || 0,
            lowStockItems: lowStockItems.count || 0,
            expiringSoon: expiringSoon.count || 0,
            totalValue: totalValue.total || 0,
            categoryCounts: categories
        };
    }

    async getLowStockItems() {
        const db = await this.getDatabase();
        return await db.all(`
            SELECT i.*, u.name as last_updated_by_name
            FROM inventory i
            LEFT JOIN users u ON i.last_updated_by = u.id
            WHERE i.status = 'active' AND i.current_quantity <= i.minimum_quantity
            ORDER BY (i.current_quantity - i.minimum_quantity) ASC
        `);
    }

    async getExpiringItems(days = 30) {
        const db = await this.getDatabase();
        return await db.all(`
            SELECT i.*, u.name as last_updated_by_name
            FROM inventory i
            LEFT JOIN users u ON i.last_updated_by = u.id
            WHERE i.status = 'active'
                AND i.expiry_date IS NOT NULL
                AND i.expiry_date <= date('now', '+' || ? || ' days')
            ORDER BY i.expiry_date ASC
        `, [days]);
    }

    // Activity Logging
    async logActivity(userId, actionType, entityType, entityId, description, ipAddress = null, userAgent = null) {
        const db = await this.getDatabase();

        const query = `
            INSERT INTO activity_logs (
                user_id, action_type, entity_type, entity_id,
                description, ip_address, user_agent
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        try {
            await db.run(query, [userId, actionType, entityType, entityId, description, ipAddress, userAgent]);
        } catch (error) {
            console.error('Error logging activity:', error);
            // Don't throw error to avoid breaking main operations
        }
    }

    async getActivityLogs(filters = {}) {
        const db = await this.getDatabase();
        let query = `
            SELECT a.*, u.name as user_name, u.role as user_role
            FROM activity_logs a
            LEFT JOIN users u ON a.user_id = u.id
            WHERE 1=1
        `;
        const params = [];

        if (filters.userId) {
            query += ` AND a.user_id = ?`;
            params.push(filters.userId);
        }

        if (filters.actionType) {
            query += ` AND a.action_type = ?`;
            params.push(filters.actionType);
        }

        if (filters.entityType) {
            query += ` AND a.entity_type = ?`;
            params.push(filters.entityType);
        }

        if (filters.dateFrom) {
            query += ` AND DATE(a.timestamp) >= DATE(?)`;
            params.push(filters.dateFrom);
        }

        if (filters.dateTo) {
            query += ` AND DATE(a.timestamp) <= DATE(?)`;
            params.push(filters.dateTo);
        }

        query += ` ORDER BY a.timestamp DESC`;

        if (filters.limit) {
            query += ` LIMIT ?`;
            params.push(parseInt(filters.limit));
        }

        return await db.all(query, params);
    }

    async getActivityStatistics() {
        const db = await this.getDatabase();

        const [totalActivities, todayActivities, userActivity, entityActivity] = await Promise.all([
            db.get('SELECT COUNT(*) as count FROM activity_logs'),
            db.get('SELECT COUNT(*) as count FROM activity_logs WHERE DATE(timestamp) = DATE("now")'),
            db.all('SELECT u.name, u.role, COUNT(*) as activity_count FROM activity_logs a LEFT JOIN users u ON a.user_id = u.id GROUP BY a.user_id ORDER BY activity_count DESC LIMIT 5'),
            db.all('SELECT entity_type, COUNT(*) as count FROM activity_logs GROUP BY entity_type ORDER BY count DESC')
        ]);

        return {
            totalActivities: totalActivities.count || 0,
            todayActivities: todayActivities.count || 0,
            topUsers: userActivity,
            entityBreakdown: entityActivity
        };
    }

    // User Management (Admin functions)
    async getAllUsersDetailed() {
        const db = await this.getDatabase();
        return await db.all(`
            SELECT
                u.*,
                COUNT(DISTINCT p.id) as patients_managed,
                COUNT(DISTINCT t.id) as tests_conducted,
                COUNT(DISTINCT r.id) as reports_generated,
                COUNT(DISTINCT a.id) as total_activities,
                MAX(a.timestamp) as last_activity
            FROM users u
            LEFT JOIN patients p ON (u.role = 'assistant' AND p.id IS NOT NULL)
            LEFT JOIN tests t ON (u.role IN ('doctor', 'assistant', 'admin') AND t.id IS NOT NULL)
            LEFT JOIN reports r ON (u.role = 'doctor' AND r.id IS NOT NULL)
            LEFT JOIN activity_logs a ON u.id = a.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
    }

    async getUserStatistics(userId) {
        const db = await this.getDatabase();

        const [userInfo, activities, recentActivity] = await Promise.all([
            db.get('SELECT * FROM users WHERE id = ?', [userId]),
            db.all('SELECT action_type, COUNT(*) as count FROM activity_logs WHERE user_id = ? GROUP BY action_type', [userId]),
            db.all('SELECT * FROM activity_logs WHERE user_id = ? ORDER BY timestamp DESC LIMIT 10', [userId])
        ]);

        return {
            user: userInfo,
            activityBreakdown: activities,
            recentActivities: recentActivity
        };
    }

    async updateUserStatus(userId, isActive, updatedBy) {
        const db = await this.getDatabase();

        const status = isActive ? 'active' : 'inactive';
        const query = `
            UPDATE users
            SET status = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `;

        await db.run(query, [status, userId]);

        // Log the activity
        await this.logActivity(
            updatedBy,
            'update',
            'user',
            userId,
            `User status changed to ${status}`
        );

        return await db.get('SELECT id, name, email, role, status FROM users WHERE id = ?', [userId]);
    }

    async deleteUser(userId, deletedBy) {
        const db = await this.getDatabase();

        // Get user info before deletion
        const user = await db.get('SELECT * FROM users WHERE id = ?', [userId]);

        if (!user) {
            throw new Error('User not found');
        }

        // Log the activity before deletion
        await this.logActivity(
            deletedBy,
            'delete',
            'user',
            userId,
            `Deleted user: ${user.name} (${user.email})`
        );

        const result = await db.run('DELETE FROM users WHERE id = ?', [userId]);
        return { success: result.changes > 0, deletedUser: user.name };
    }

    // Database Management
    async backupDatabase() {
        const fs = require('fs-extra');
        const path = require('path');
        const { app } = require('electron');

        try {
            const db = await this.getDatabase();
            const sourceDb = db.dbPath || path.join(app.getPath('userData'), 'eye_clinic.db');
            const backupDir = path.join(app.getPath('userData'), 'backups');

            // Ensure backup directory exists
            await fs.ensureDir(backupDir);

            // Create backup filename with timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const backupPath = path.join(backupDir, `eye_clinic_backup_${timestamp}.db`);

            // Copy database file
            await fs.copy(sourceDb, backupPath);

            return {
                success: true,
                message: 'Database backup created successfully',
                backupPath: backupPath
            };
        } catch (error) {
            console.error('Backup error:', error);
            return {
                success: false,
                message: `Backup failed: ${error.message}`
            };
        }
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