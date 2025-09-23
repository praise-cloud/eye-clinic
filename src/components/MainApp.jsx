import React, { useState, useEffect } from 'react'
import { EyeIcon, UsersIcon, ChartIcon, DocumentIcon, ChatIcon } from './Icons'

const MainApp = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')

  useEffect(() => {
    // Get current user from Electron
    const getCurrentUser = async () => {
      try {
        const user = await window.electronAPI?.getCurrentUser()
        setCurrentUser(user)
      } catch (error) {
        console.error('Error getting current user:', error)
      }
    }
    
    getCurrentUser()
  }, [])

  const navigation = [
    { id: 'dashboard', name: 'Dashboard', icon: <ChartIcon className="w-5 h-5" />, current: activeSection === 'dashboard' },
    { id: 'patients', name: 'Patients', icon: <UsersIcon className="w-5 h-5" />, current: activeSection === 'patients' },
    { id: 'tests', name: 'Tests/Results', icon: <DocumentIcon className="w-5 h-5" />, current: activeSection === 'tests' },
    { id: 'reports', name: 'Reports', icon: <DocumentIcon className="w-5 h-5" />, current: activeSection === 'reports' },
    { id: 'chat', name: 'Chat', icon: <ChatIcon className="w-5 h-5" />, current: activeSection === 'chat' },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex flex-col w-64 bg-white shadow-lg">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center">
            <EyeIcon className="w-8 h-8 text-white mr-3" />
            <span className="text-xl font-bold text-white">Eye Clinic</span>
          </div>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {currentUser?.name || 'Loading...'}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {currentUser?.role || ''}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`${
                item.current
                  ? 'bg-blue-100 border-r-2 border-blue-600 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              } group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200`}
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200">
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeSection}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeSection === 'dashboard' && 'Overview of your clinic operations'}
                  {activeSection === 'patients' && 'Manage patient information and records'}
                  {activeSection === 'tests' && 'Upload and view visual field test results'}
                  {activeSection === 'reports' && 'Generate and export PDF reports'}
                  {activeSection === 'chat' && 'Communicate with your team'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="btn btn-primary">
                  {activeSection === 'patients' && '+ New Patient'}
                  {activeSection === 'tests' && '+ Upload Test'}
                  {activeSection === 'reports' && '+ Generate Report'}
                  {activeSection === 'dashboard' && '+ Quick Action'}
                  {activeSection === 'chat' && '+ New Message'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {activeSection === 'dashboard' && <DashboardContent />}
          {activeSection === 'patients' && <PatientsContent />}
          {activeSection === 'tests' && <TestsContent />}
          {activeSection === 'reports' && <ReportsContent />}
          {activeSection === 'chat' && <ChatContent />}
        </main>
      </div>
    </div>
  )
}

// Dashboard Content Component
const DashboardContent = () => (
  <div className="space-y-6">
    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { name: 'Total Patients', value: '0', icon: <UsersIcon className="w-8 h-8" />, color: 'blue' },
        { name: "Today's Tests", value: '0', icon: <DocumentIcon className="w-8 h-8" />, color: 'green' },
        { name: 'Pending Reports', value: '0', icon: <ChartIcon className="w-8 h-8" />, color: 'yellow' },
        { name: 'Unread Messages', value: '0', icon: <ChatIcon className="w-8 h-8" />, color: 'purple' },
      ].map((stat) => (
        <div key={stat.name} className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg bg-${stat.color}-100 text-${stat.color}-600`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Quick Actions */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </div>
        <div className="card-body">
          <div className="space-y-3">
            {[
              'Add New Patient',
              'Upload Test Results',
              'Generate Report',
              'Send Message'
            ].map((action) => (
              <button
                key={action}
                className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="card-body">
          <p className="text-gray-500 text-center py-8">No recent activity</p>
        </div>
      </div>
    </div>
  </div>
)

// Placeholder components
const PatientsContent = () => (
  <div className="text-center py-12">
    <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Management</h3>
    <p className="text-gray-500">Patient management functionality will be implemented here.</p>
  </div>
)

const TestsContent = () => (
  <div className="text-center py-12">
    <DocumentIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Test Results</h3>
    <p className="text-gray-500">Visual field test management will be implemented here.</p>
  </div>
)

const ReportsContent = () => (
  <div className="text-center py-12">
    <ChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Reports & Analytics</h3>
    <p className="text-gray-500">Report generation functionality will be implemented here.</p>
  </div>
)

const ChatContent = () => (
  <div className="text-center py-12">
    <ChatIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">Team Communication</h3>
    <p className="text-gray-500">Chat system will be implemented here.</p>
  </div>
)

export default MainApp