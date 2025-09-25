const { ipcMain } = require('electron');
const DatabaseService = require('./DatabaseService');

class IPCHandlers {
    constructor() {
        this.registerAuthHandlers();
        this.registerPatientHandlers();
        this.registerTestHandlers();
        this.registerChatHandlers();
        this.registerSettingsHandlers();
        this.registerSystemHandlers();
        console.log('IPC handlers registered successfully');
    }

    registerAuthHandlers() {
        // Check if this is first run
        ipcMain.handle('auth:isFirstRun', async () => {
            try {
                return await DatabaseService.isFirstRun();
            } catch (error) {
                console.error('Error checking first run:', error);
                return { error: error.message };
            }
        });

        // Login user
        ipcMain.handle('auth:login', async (event, { email, password }) => {
            try {
                if (!email || !password) {
                    return { error: 'Email and password are required' };
                }
                
                const user = await DatabaseService.authenticateUser(email, password);
                if (user) {
                    return { success: true, user };
                } else {
                    return { error: 'Invalid credentials' };
                }
            } catch (error) {
                console.error('Login error:', error);
                return { error: error.message };
            }
        });

        // Create user (setup)
        ipcMain.handle('auth:createUser', async (event, userData) => {
            try {
                const requiredFields = ['name', 'email', 'password', 'role'];
                for (const field of requiredFields) {
                    if (!userData[field]) {
                        return { error: `${field} is required` };
                    }
                }

                const user = await DatabaseService.createUser(userData);
                return { success: true, user };
            } catch (error) {
                console.error('Create user error:', error);
                return { error: error.message };
            }
        });

        // Get all users
        ipcMain.handle('auth:getAllUsers', async () => {
            try {
                const users = await DatabaseService.getAllUsers();
                return { success: true, users };
            } catch (error) {
                console.error('Get users error:', error);
                return { error: error.message };
            }
        });
    }

    registerPatientHandlers() {
        // Get all patients
        ipcMain.handle('patients:getAll', async (event, filters = {}) => {
            try {
                const patients = await DatabaseService.getAllPatients(filters);
                return { success: true, patients };
            } catch (error) {
                console.error('Get patients error:', error);
                return { error: error.message };
            }
        });

        // Get patient by ID
        ipcMain.handle('patients:getById', async (event, id) => {
            try {
                if (!id) {
                    return { error: 'Patient ID is required' };
                }

                const patient = await DatabaseService.getPatientById(id);
                if (patient) {
                    return { success: true, patient };
                } else {
                    return { error: 'Patient not found' };
                }
            } catch (error) {
                console.error('Get patient error:', error);
                return { error: error.message };
            }
        });

        // Create patient
        ipcMain.handle('patients:create', async (event, patientData) => {
            try {
                const requiredFields = ['patient_id', 'first_name', 'last_name', 'dob', 'gender'];
                for (const field of requiredFields) {
                    if (!patientData[field]) {
                        return { error: `${field} is required` };
                    }
                }

                const patient = await DatabaseService.createPatient(patientData);
                return { success: true, patient };
            } catch (error) {
                console.error('Create patient error:', error);
                return { error: error.message };
            }
        });

        // Update patient
        ipcMain.handle('patients:update', async (event, { id, patientData }) => {
            try {
                if (!id) {
                    return { error: 'Patient ID is required' };
                }

                const patient = await DatabaseService.updatePatient(id, patientData);
                return { success: true, patient };
            } catch (error) {
                console.error('Update patient error:', error);
                return { error: error.message };
            }
        });

        // Delete patient
        ipcMain.handle('patients:delete', async (event, id) => {
            try {
                if (!id) {
                    return { error: 'Patient ID is required' };
                }

                const result = await DatabaseService.deletePatient(id);
                return result;
            } catch (error) {
                console.error('Delete patient error:', error);
                return { error: error.message };
            }
        });

        // Search patients
        ipcMain.handle('patients:search', async (event, searchTerm) => {
            try {
                const patients = await DatabaseService.getAllPatients({ 
                    search: searchTerm 
                });
                return { success: true, patients };
            } catch (error) {
                console.error('Search patients error:', error);
                return { error: error.message };
            }
        });
    }

    registerTestHandlers() {
        // Get all tests
        ipcMain.handle('tests:getAll', async (event, filters = {}) => {
            try {
                const tests = await DatabaseService.getAllTests(filters);
                return { success: true, tests };
            } catch (error) {
                console.error('Get tests error:', error);
                return { error: error.message };
            }
        });

        // Get test by ID
        ipcMain.handle('tests:getById', async (event, id) => {
            try {
                if (!id) {
                    return { error: 'Test ID is required' };
                }

                const test = await DatabaseService.getTestById(id);
                if (test) {
                    // Parse raw_data if it's a JSON string
                    if (test.raw_data && typeof test.raw_data === 'string') {
                        try {
                            test.raw_data = JSON.parse(test.raw_data);
                        } catch (e) {
                            // Leave as string if parsing fails
                        }
                    }
                    return { success: true, test };
                } else {
                    return { error: 'Test not found' };
                }
            } catch (error) {
                console.error('Get test error:', error);
                return { error: error.message };
            }
        });

        // Create test
        ipcMain.handle('tests:create', async (event, testData) => {
            try {
                const requiredFields = ['patient_id', 'eye', 'machine_type', 'raw_data'];
                for (const field of requiredFields) {
                    if (!testData[field]) {
                        return { error: `${field} is required` };
                    }
                }

                const test = await DatabaseService.createTest(testData);
                return { success: true, test };
            } catch (error) {
                console.error('Create test error:', error);
                return { error: error.message };
            }
        });

        // Update test
        ipcMain.handle('tests:update', async (event, { id, testData }) => {
            try {
                if (!id) {
                    return { error: 'Test ID is required' };
                }

                const test = await DatabaseService.updateTest(id, testData);
                return { success: true, test };
            } catch (error) {
                console.error('Update test error:', error);
                return { error: error.message };
            }
        });

        // Delete test
        ipcMain.handle('tests:delete', async (event, id) => {
            try {
                if (!id) {
                    return { error: 'Test ID is required' };
                }

                const result = await DatabaseService.deleteTest(id);
                return result;
            } catch (error) {
                console.error('Delete test error:', error);
                return { error: error.message };
            }
        });

        // Get tests for patient
        ipcMain.handle('tests:getByPatient', async (event, patientId) => {
            try {
                if (!patientId) {
                    return { error: 'Patient ID is required' };
                }

                const tests = await DatabaseService.getAllTests({ patientId });
                return { success: true, tests };
            } catch (error) {
                console.error('Get patient tests error:', error);
                return { error: error.message };
            }
        });
    }

    registerChatHandlers() {
        // Get messages
        ipcMain.handle('chat:getMessages', async (event, { userId, otherUserId = null }) => {
            try {
                if (!userId) {
                    return { error: 'User ID is required' };
                }

                const messages = await DatabaseService.getMessages(userId, otherUserId);
                return { success: true, messages };
            } catch (error) {
                console.error('Get messages error:', error);
                return { error: error.message };
            }
        });

        // Send message
        ipcMain.handle('chat:sendMessage', async (event, { senderId, receiverId, messageText }) => {
            try {
                const requiredFields = ['senderId', 'receiverId', 'messageText'];
                const data = { senderId, receiverId, messageText };
                
                for (const field of requiredFields) {
                    if (!data[field]) {
                        return { error: `${field} is required` };
                    }
                }

                const message = await DatabaseService.sendMessage(senderId, receiverId, messageText);
                return { success: true, message };
            } catch (error) {
                console.error('Send message error:', error);
                return { error: error.message };
            }
        });

        // Mark message as read
        ipcMain.handle('chat:markAsRead', async (event, { messageId, userId }) => {
            try {
                if (!messageId || !userId) {
                    return { error: 'Message ID and User ID are required' };
                }

                const result = await DatabaseService.markMessageAsRead(messageId, userId);
                return result;
            } catch (error) {
                console.error('Mark message as read error:', error);
                return { error: error.message };
            }
        });

        // Get unread message count
        ipcMain.handle('chat:getUnreadCount', async (event, userId) => {
            try {
                if (!userId) {
                    return { error: 'User ID is required' };
                }

                const count = await DatabaseService.getUnreadMessageCount(userId);
                return { success: true, count };
            } catch (error) {
                console.error('Get unread count error:', error);
                return { error: error.message };
            }
        });
    }

    registerSettingsHandlers() {
        // Get setting
        ipcMain.handle('settings:get', async (event, key) => {
            try {
                if (!key) {
                    return { error: 'Setting key is required' };
                }

                const value = await DatabaseService.getSetting(key);
                return { success: true, value };
            } catch (error) {
                console.error('Get setting error:', error);
                return { error: error.message };
            }
        });

        // Set setting
        ipcMain.handle('settings:set', async (event, { key, value }) => {
            try {
                if (!key) {
                    return { error: 'Setting key is required' };
                }

                await DatabaseService.setSetting(key, value);
                return { success: true };
            } catch (error) {
                console.error('Set setting error:', error);
                return { error: error.message };
            }
        });

        // Get all settings
        ipcMain.handle('settings:getAll', async () => {
            try {
                const settings = await DatabaseService.getAllSettings();
                return { success: true, settings };
            } catch (error) {
                console.error('Get all settings error:', error);
                return { error: error.message };
            }
        });
    }

    registerSystemHandlers() {
        // Get dashboard statistics
        ipcMain.handle('system:getDashboardStats', async () => {
            try {
                const stats = await DatabaseService.getDashboardStats();
                return { success: true, stats };
            } catch (error) {
                console.error('Get dashboard stats error:', error);
                return { error: error.message };
            }
        });

        // Backup database
        ipcMain.handle('system:backup', async () => {
            try {
                const result = await DatabaseService.backupDatabase();
                return result;
            } catch (error) {
                console.error('Backup error:', error);
                return { error: error.message };
            }
        });

        // Health check
        ipcMain.handle('system:healthCheck', async () => {
            try {
                // Simple health check - try to query database
                await DatabaseService.getDashboardStats();
                return { 
                    success: true, 
                    status: 'healthy',
                    timestamp: new Date().toISOString()
                };
            } catch (error) {
                console.error('Health check error:', error);
                return { 
                    success: false, 
                    status: 'unhealthy',
                    error: error.message,
                    timestamp: new Date().toISOString()
                };
            }
        });
    }

    // Clean up handlers when app closes
    removeAllHandlers() {
        const handlers = [
            'auth:isFirstRun',
            'auth:login',
            'auth:createUser',
            'auth:getAllUsers',
            'patients:getAll',
            'patients:getById',
            'patients:create',
            'patients:update',
            'patients:delete',
            'patients:search',
            'tests:getAll',
            'tests:getById',
            'tests:create',
            'tests:update',
            'tests:delete',
            'tests:getByPatient',
            'chat:getMessages',
            'chat:sendMessage',
            'chat:markAsRead',
            'chat:getUnreadCount',
            'settings:get',
            'settings:set',
            'settings:getAll',
            'system:getDashboardStats',
            'system:backup',
            'system:healthCheck'
        ];

        handlers.forEach(handler => {
            ipcMain.removeAllListeners(handler);
        });
    }
}

module.exports = IPCHandlers;