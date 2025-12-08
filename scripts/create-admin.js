const Database = require('../database/database.js');
const { app } = require('electron');

async function createAdmin() {
  const db = new Database();
  await db.initialize();

  try {
    const existing = await db.get('SELECT * FROM users WHERE email = ?', ['admin@clinic.com']);
    
    if (existing) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    const adminUser = await db.createUser({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@clinic.com',
      password: 'admin123',
      gender: 'other',
      role: 'admin',
      phone_number: null
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@clinic.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

// Mock app.getPath for standalone script
if (!app || !app.getPath) {
  const path = require('path');
  global.app = {
    getPath: () => path.join(__dirname, '..')
  };
}

createAdmin();
