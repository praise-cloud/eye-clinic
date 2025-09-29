// Authentication and Onboarding JavaScript

let currentStep = 0;
let isFirstRun = true;

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Authentication system loaded');
    initializeAuth();
});

async function initializeAuth() {
    // Check if this is first run by calling main process
    try {
        isFirstRun = await window.Electron.isFirstRun();
        // isFirstRun = await window.electronAPI.isFirstRun();

        if (isFirstRun) {
            showScreen('welcome-screen');
        } else {
            showScreen('login-screen');
        }

        setupEventListeners();
    } catch (error) {
        console.error('Error initializing auth:', error);
        showMessage('Failed to initialize application', 'error');
        // Fallback to welcome screen
        showScreen('welcome-screen');
        setupEventListeners();
    }
}

function setupEventListeners() {
    // Welcome screen
    const getStartedBtn = document.getElementById('getStartedBtn');
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => showScreen('setup-screen'));
    }

    // Setup form
    const completeSetupBtn = document.getElementById('completeSetupBtn');
    if (completeSetupBtn) {
        completeSetupBtn.addEventListener('click', handleSetupComplete);
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add user form
    const addUserForm = document.getElementById('addUserForm');
    if (addUserForm) {
        addUserForm.addEventListener('submit', handleAddUser);
    }

    const cancelAddUserBtn = document.getElementById('cancelAddUserBtn');
    if (cancelAddUserBtn) {
        cancelAddUserBtn.addEventListener('click', () => showScreen('login-screen'));
    }
}

// Screen management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.auth-screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }
}

function showLoading(message = 'Processing...') {
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.textContent = message;
    }
    showScreen('loading-screen');
}

// Step navigation for setup
function nextStep() {
    const clinicName = document.getElementById('clinicName').value;

    if (!clinicName.trim()) {
        showMessage('Please enter clinic name', 'error');
        return;
    }

    document.getElementById('clinic-info-step').classList.remove('active');
    document.getElementById('admin-account-step').classList.add('active');
}

function prevStep() {
    document.getElementById('admin-account-step').classList.remove('active');
    document.getElementById('clinic-info-step').classList.add('active');
}

// Setup completion
async function handleSetupComplete() {
    // Validate form
    const adminName = document.getElementById('adminName').value;
    const adminEmail = document.getElementById('adminEmail').value;
    const adminPassword = document.getElementById('adminPassword').value;
    const adminPasswordConfirm = document.getElementById('adminPasswordConfirm').value;
    const adminRole = document.getElementById('adminRole').value;

    // Client-side validation
    if (!validateSetupForm(adminName, adminEmail, adminPassword, adminPasswordConfirm, adminRole)) {
        return;
    }

    showLoading('Setting up your clinic...');

    try {
        // Collect clinic info
        const clinicData = {
            name: document.getElementById('clinicName').value,
            address: document.getElementById('clinicAddress').value,
            phone: document.getElementById('clinicPhone').value
        };

        // Collect admin user data
        const adminData = {
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: adminRole
        };

        // Call main process to complete setup
        const result = await window.electronAPI.completeSetup(clinicData, adminData);

        if (result.success) {
            showMessage('Setup completed successfully!', 'success');
            setTimeout(() => {
                window.electronAPI.openMainWindow();
            }, 1500);
        } else {
            throw new Error(result.message || 'Setup failed');
        }
    } catch (error) {
        console.error('Setup error:', error);
        showMessage(error.message || 'Setup failed. Please try again.', 'error');
        showScreen('setup-screen');
    }
}

// Login handling
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('Please enter both email and password', 'error');
        return;
    }

    showLoading('Signing in...');

    try {
        const result = await window.electronAPI.login(email, password);

        if (result.success) {
            showMessage('Login successful!', 'success');
            setTimeout(() => {
                window.electronAPI.openMainWindow();
            }, 1000);
        } else {
            throw new Error(result.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showMessage(error.message || 'Login failed. Please check your credentials.', 'error');
        showScreen('login-screen');
    }
}

// Add user handling
async function handleAddUser(event) {
    event.preventDefault();

    const name = document.getElementById('newUserName').value;
    const email = document.getElementById('newUserEmail').value;
    const password = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;

    if (!validateUserForm(name, email, password, role)) {
        return;
    }

    showLoading('Creating user account...');

    try {
        const result = await window.electronAPI.createUser({
            name,
            email,
            password,
            role
        });

        if (result.success) {
            showMessage('User created successfully!', 'success');
            // Reset form
            document.getElementById('addUserForm').reset();
            setTimeout(() => showScreen('login-screen'), 1500);
        } else {
            throw new Error(result.message || 'User creation failed');
        }
    } catch (error) {
        console.error('Create user error:', error);
        showMessage(error.message || 'Failed to create user. Please try again.', 'error');
        showScreen('add-user-screen');
    }
}

// Form validation
function validateSetupForm(name, email, password, passwordConfirm, role) {
    clearFormErrors();

    let isValid = true;

    if (!name.trim()) {
        showFieldError('adminName', 'Name is required');
        isValid = false;
    }

    if (!email.trim() || !isValidEmail(email)) {
        showFieldError('adminEmail', 'Valid email is required');
        isValid = false;
    }

    if (password.length < 6) {
        showFieldError('adminPassword', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (password !== passwordConfirm) {
        showFieldError('adminPasswordConfirm', 'Passwords do not match');
        isValid = false;
    }

    if (!role) {
        showFieldError('adminRole', 'Role is required');
        isValid = false;
    }

    return isValid;
}

function validateUserForm(name, email, password, role) {
    clearFormErrors();

    let isValid = true;

    if (!name.trim()) {
        showFieldError('newUserName', 'Name is required');
        isValid = false;
    }

    if (!email.trim() || !isValidEmail(email)) {
        showFieldError('newUserEmail', 'Valid email is required');
        isValid = false;
    }

    if (password.length < 6) {
        showFieldError('newUserPassword', 'Password must be at least 6 characters');
        isValid = false;
    }

    if (!role) {
        showFieldError('newUserRole', 'Role is required');
        isValid = false;
    }

    return isValid;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('error');

        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-text');
        if (existingError) {
            existingError.remove();
        }

        // Add new error message
        const errorElement = document.createElement('span');
        errorElement.className = 'error-text';
        errorElement.textContent = message;
        field.parentNode.appendChild(errorElement);
    }
}

function clearFormErrors() {
    // Remove error classes
    document.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
    });

    // Remove error messages
    document.querySelectorAll('.error-text').forEach(error => {
        error.remove();
    });
}

// Message system
function showMessage(message, type = 'info') {
    const messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) return;

    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;

    const iconClass = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        info: 'fas fa-info-circle'
    }[type] || 'fas fa-info-circle';

    messageElement.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${message}</span>
    `;

    messageContainer.appendChild(messageElement);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
}

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        showScreen,
        handleLogin,
        handleSetupComplete,
        validateSetupForm,
        showMessage
    };
}