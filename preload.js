const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Authentication APIs
    isFirstRun: () => ipcRenderer.invoke('auth:isFirstRun'),
    login: (email, password) => ipcRenderer.invoke('auth:login', { email, password }),
    logout: () => ipcRenderer.invoke('auth:logout'),
    createUser: (userData) => ipcRenderer.invoke('auth:createUser', userData),
    completeSetup: (clinicData, adminData) => ipcRenderer.invoke('auth:completeSetup', { clinicData, adminData }),
    
    // Window management
    openMainWindow: () => ipcRenderer.invoke('window:openMain'),
    closeAuthWindow: () => ipcRenderer.invoke('window:closeAuth'),
    
    // Database APIs
    getSettings: () => ipcRenderer.invoke('db:getSettings'),
    setSetting: (key, value) => ipcRenderer.invoke('db:setSetting', { key, value }),
    
    // Patient APIs
    getPatients: (filters) => ipcRenderer.invoke('patients:getAll', filters),
    getPatient: (id) => ipcRenderer.invoke('patients:getById', id),
    createPatient: (patientData) => ipcRenderer.invoke('patients:create', patientData),
    updatePatient: (id, patientData) => ipcRenderer.invoke('patients:update', { id, patientData }),
    deletePatient: (id) => ipcRenderer.invoke('patients:delete', id),
    
    // Test APIs
    getTests: (filters) => ipcRenderer.invoke('tests:getAll', filters),
    getTest: (id) => ipcRenderer.invoke('tests:getById', id),
    createTest: (testData) => ipcRenderer.invoke('tests:create', testData),
    updateTest: (id, testData) => ipcRenderer.invoke('tests:update', { id, testData }),
    deleteTest: (id) => ipcRenderer.invoke('tests:delete', id),
    
    // Report APIs
    getReports: (filters) => ipcRenderer.invoke('reports:getAll', filters),
    generateReport: (patientId, testIds) => ipcRenderer.invoke('reports:generate', { patientId, testIds }),
    exportReport: (reportId, format) => ipcRenderer.invoke('reports:export', { reportId, format }),
    
    // Chat APIs
    getMessages: (userId) => ipcRenderer.invoke('chat:getMessages', userId),
    sendMessage: (receiverId, message) => ipcRenderer.invoke('chat:sendMessage', { receiverId, message }),
    markMessageRead: (messageId) => ipcRenderer.invoke('chat:markRead', messageId),
    
    // File APIs
    selectFile: (options) => ipcRenderer.invoke('file:select', options),
    saveFile: (options) => ipcRenderer.invoke('file:save', options),
    
    // Utility APIs
    getCurrentUser: () => ipcRenderer.invoke('auth:getCurrentUser'),
    checkUpdate: () => ipcRenderer.invoke('app:checkUpdate'),
    
    // Event listeners
    onMessage: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('chat:newMessage', subscription);
        return () => ipcRenderer.removeListener('chat:newMessage', subscription);
    },
    
    onUserUpdate: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('auth:userUpdate', subscription);
        return () => ipcRenderer.removeListener('auth:userUpdate', subscription);
    },
    
    onTestImported: (callback) => {
        const subscription = (event, data) => callback(data);
        ipcRenderer.on('tests:imported', subscription);
        return () => ipcRenderer.removeListener('tests:imported', subscription);
    }
});

// Listen for preload events
window.addEventListener('DOMContentLoaded', () => {
    console.log('Preload script loaded successfully');
});