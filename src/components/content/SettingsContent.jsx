import React, { useState } from 'react'

const SettingsContent = () => {
  const [settings, setSettings] = useState({
    clinicName: 'Eye Care Clinic',
    address: '123 Medical Center Dr',
    phone: '555-0123',
    email: 'info@eyecareclinic.com',
    notifications: true,
    autoBackup: true,
    theme: 'light'
  })

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Clinic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clinic Name</label>
            <input
              type="text"
              value={settings.clinicName}
              onChange={(e) => handleInputChange('clinicName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              value={settings.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">System Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications about appointments and reports</p>
            </div>
            <button
              onClick={() => handleInputChange('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Auto Backup</h3>
              <p className="text-sm text-gray-500">Automatically backup data daily</p>
            </div>
            <button
              onClick={() => handleInputChange('autoBackup', !settings.autoBackup)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoBackup ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Data Management</h2>
        <div className="space-y-3">
          <button className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Export Data
          </button>
          <button className="w-full md:w-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 md:ml-3">
            Backup Now
          </button>
          <button className="w-full md:w-auto px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 md:ml-3">
            Import Data
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default SettingsContent