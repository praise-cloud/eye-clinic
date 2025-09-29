import React, { useState, useEffect } from 'react'
import { EyeIcon, UsersIcon, ChartIcon, DocumentIcon, ChatIcon, InventoryIcon, AdminIcon } from './Icons'
import AddPatientModal from './modals/AddPatientModal'
import UploadTestModal from './modals/UploadTestModal'
import GenerateReportModal from './modals/GenerateReportModal'
import NewMessageModal from './modals/NewMessageModal'

const MainApp = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeSection, setActiveSection] = useState('dashboard')
  
  // Modal states for different actions
  const [showAddPatientModal, setShowAddPatientModal] = useState(false)
  const [showUploadTestModal, setShowUploadTestModal] = useState(false)
  const [showGenerateReportModal, setShowGenerateReportModal] = useState(false)
  const [showNewMessageModal, setShowNewMessageModal] = useState(false)

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
  
  // Handle action button clicks
  const handleActionClick = () => {
    switch (activeSection) {
      case 'patients':
        setShowAddPatientModal(true)
        break
      case 'tests':
        setShowUploadTestModal(true)
        break
      case 'reports':
        setShowGenerateReportModal(true)
        break
      case 'chat':
        setShowNewMessageModal(true)
        break
      case 'activity':
        handleExportActivityLogs()
        break
      default:
        console.log('Quick action clicked for:', activeSection)
    }
  }
  
  const handleExportActivityLogs = async () => {
    try {
      const result = await window.electronAPI?.getActivityLogs({})
      if (result?.success) {
        const csvContent = generateCSVFromActivityLogs(result.logs)
        const blob = new Blob([csvContent], { type: 'text/csv' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `activity_logs_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.error('Error exporting activity logs:', error)
      alert('Failed to export activity logs')
    }
  }
  
  const generateCSVFromActivityLogs = (logs) => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Entity Type', 'Entity ID', 'Description']
    const rows = logs.map(log => [
      new Date(log.timestamp).toLocaleString(),
      log.user_name || 'Unknown',
      log.user_role || '',
      log.action_type,
      log.entity_type,
      log.entity_id || '',
      log.description
    ])
    
    const csvContent = [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n')
    
    return csvContent
  }

  // Navigation items based on user role
  const baseNavigation = [
    { id: 'dashboard', name: 'Dashboard', icon: <ChartIcon className="w-5 h-5" />, current: activeSection === 'dashboard' },
    { id: 'patients', name: 'Patients', icon: <UsersIcon className="w-5 h-5" />, current: activeSection === 'patients' },
    { id: 'tests', name: 'Tests/Results', icon: <DocumentIcon className="w-5 h-5" />, current: activeSection === 'tests' },
    { id: 'reports', name: 'Reports', icon: <DocumentIcon className="w-5 h-5" />, current: activeSection === 'reports' },
    { id: 'chat', name: 'Chat', icon: <ChatIcon className="w-5 h-5" />, current: activeSection === 'chat' },
  ]

  // Create navigation based on user role
  let navigation = [...baseNavigation]
  
  // Add inventory for assistants
  if (currentUser?.role === 'assistant') {
    navigation = [
      ...baseNavigation.slice(0, 4), // Dashboard, Patients, Tests, Reports
      { id: 'inventory', name: 'Inventory', icon: <InventoryIcon className="w-5 h-5" />, current: activeSection === 'inventory' },
      baseNavigation[4] // Chat
    ]
  }
  
  // Add admin section for admins
  if (currentUser?.role === 'admin') {
    navigation = [
      baseNavigation[0], // Dashboard
      { id: 'users', name: 'User Management', icon: <AdminIcon className="w-5 h-5" />, current: activeSection === 'users' },
      { id: 'activity', name: 'Activity Logs', icon: <ChartIcon className="w-5 h-5" />, current: activeSection === 'activity' },
      ...baseNavigation.slice(1) // Patients, Tests, Reports, Chat
    ]
  }

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
                  {activeSection === 'inventory' && 'Manage medical supplies and equipment'}
                  {activeSection === 'users' && 'Manage system users and permissions'}
                  {activeSection === 'activity' && 'View system activity and audit logs'}
                  {activeSection === 'chat' && 'Communicate with your team'}
                </p>
              </div>
              
              <div className="flex items-center space-x-4">
                <button className="btn btn-primary" onClick={handleActionClick}>
                  {activeSection === 'patients' && '+ New Patient'}
                  {activeSection === 'tests' && '+ Upload Test'}
                  {activeSection === 'reports' && '+ Generate Report'}
                  {activeSection === 'inventory' && '+ Add Item'}
                  {activeSection === 'users' && '+ Add User'}
                  {activeSection === 'activity' && '+ Export Logs'}
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
          {activeSection === 'inventory' && <InventoryContent />}
          {activeSection === 'users' && <UserManagementContent />}
          {activeSection === 'activity' && <ActivityLogsContent />}
          {activeSection === 'chat' && <ChatContent />}
        </main>
      </div>
      
      {/* Modals */}
      {showAddPatientModal && (
        <AddPatientModal
          onClose={() => setShowAddPatientModal(false)}
          currentUser={currentUser}
        />
      )}
      
      {showUploadTestModal && (
        <UploadTestModal
          onClose={() => setShowUploadTestModal(false)}
          currentUser={currentUser}
        />
      )}
      
      {showGenerateReportModal && (
        <GenerateReportModal
          onClose={() => setShowGenerateReportModal(false)}
          currentUser={currentUser}
        />
      )}
      
      {showNewMessageModal && (
        <NewMessageModal
          onClose={() => setShowNewMessageModal(false)}
          currentUser={currentUser}
        />
      )}
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

// Inventory Content Component
const InventoryContent = () => {
  const [inventoryItems, setInventoryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [inventoryStats, setInventoryStats] = useState({})

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'equipment', label: 'Equipment' },
    { value: 'supplies', label: 'Supplies' },
    { value: 'medication', label: 'Medication' },
    { value: 'consumables', label: 'Consumables' },
    { value: 'other', label: 'Other' }
  ]

  useEffect(() => {
    loadInventoryData()
    loadInventoryStats()
  }, [selectedCategory, searchTerm])

  const loadInventoryData = async () => {
    try {
      setLoading(true)
      const filters = {}
      if (selectedCategory !== 'all') {
        filters.category = selectedCategory
      }
      if (searchTerm) {
        filters.search = searchTerm
      }
      
      const result = await window.electronAPI?.getInventoryItems(filters)
      if (result?.success) {
        setInventoryItems(result.items || [])
      }
    } catch (error) {
      console.error('Error loading inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadInventoryStats = async () => {
    try {
      const result = await window.electronAPI?.getInventoryStatistics()
      if (result?.success) {
        setInventoryStats(result.stats || {})
      }
    } catch (error) {
      console.error('Error loading inventory stats:', error)
    }
  }

  const getStockStatusColor = (item) => {
    if (item.current_quantity <= item.minimum_quantity) {
      return 'text-red-600 bg-red-100'
    } else if (item.current_quantity <= item.minimum_quantity * 1.5) {
      return 'text-yellow-600 bg-yellow-100'
    }
    return 'text-green-600 bg-green-100'
  }

  const getStockStatusText = (item) => {
    if (item.current_quantity <= item.minimum_quantity) {
      return 'Low Stock'
    } else if (item.current_quantity <= item.minimum_quantity * 1.5) {
      return 'Medium Stock'
    }
    return 'In Stock'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="space-y-6">
      {/* Inventory Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <InventoryIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.totalItems || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100 text-red-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5C3.312 20.333 4.274 22 5.814 22z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.lowStockItems || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-gray-900">{inventoryStats.expiringSoon || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(inventoryStats.totalValue)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search items..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                className="input"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Add Item Button */}
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              + Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Inventory Items</h3>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading inventory...</span>
            </div>
          ) : inventoryItems.length === 0 ? (
            <div className="text-center py-12">
              <InventoryIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Items Found</h3>
              <p className="text-gray-500">No inventory items match your search criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expiry</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {inventoryItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                          <div className="text-sm text-gray-500">{item.item_code}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {item.current_quantity} {item.unit_of_measure}
                        </div>
                        <div className="text-xs text-gray-500">
                          Min: {item.minimum_quantity} | Max: {item.maximum_quantity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStockStatusColor(item)}`}>
                          {getStockStatusText(item)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatCurrency(item.current_quantity * item.unit_cost)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(item.expiry_date)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                          <button className="text-green-600 hover:text-green-900">Update Qty</button>
                          <button className="text-red-600 hover:text-red-900">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Low Stock Alerts</h3>
          </div>
          <div className="card-body">
            <p className="text-gray-500 text-center py-8">{inventoryStats.lowStockItems || 0} items need restocking</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-gray-900">Expiring Items</h3>
          </div>
          <div className="card-body">
            <p className="text-gray-500 text-center py-8">{inventoryStats.expiringSoon || 0} items expiring in 30 days</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// User Management Content Component
const UserManagementContent = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    loadUsers()
    getCurrentUser()
  }, [])

  const getCurrentUser = async () => {
    try {
      const user = await window.electronAPI?.getCurrentUser()
      setCurrentUser(user)
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  const loadUsers = async () => {
    try {
      setLoading(true)
      const result = await window.electronAPI?.getAllUsersDetailed()
      if (result?.success) {
        setUsers(result.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateUser = async (userData) => {
    try {
      const result = await window.electronAPI?.createUserAdmin(userData, currentUser?.id)
      if (result?.success) {
        setShowAddUserModal(false)
        loadUsers() // Refresh the list
        alert('User created successfully!')
      } else {
        alert(result?.error || 'Failed to create user')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Error creating user: ' + error.message)
    }
  }

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const result = await window.electronAPI?.updateUserStatus(userId, !isActive, currentUser?.id)
      if (result?.success) {
        loadUsers()
        alert(`User ${!isActive ? 'activated' : 'deactivated'} successfully!`)
      } else {
        alert(result?.error || 'Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      alert('Error updating user status: ' + error.message)
    }
  }

  const handleDeleteUser = async (userId, userName) => {
    if (userId === currentUser?.id) {
      alert('You cannot delete your own account!')
      return
    }

    if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      try {
        const result = await window.electronAPI?.deleteUser(userId, currentUser?.id)
        if (result?.success) {
          loadUsers()
          alert('User deleted successfully!')
        } else {
          alert(result?.error || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user: ' + error.message)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString()
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'doctor': return 'bg-blue-100 text-blue-800'
      case 'assistant': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusBadgeColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      {/* User Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <UsersIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <AdminIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.status === 'active').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <DocumentIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doctors</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'doctor').length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <InventoryIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assistants</p>
                <p className="text-2xl font-bold text-gray-900">{users.filter(u => u.role === 'assistant').length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">System Users</h3>
            <button
              className="btn btn-primary"
              onClick={() => setShowAddUserModal(true)}
            >
              + Add New User
            </button>
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Users Found</h3>
              <p className="text-gray-500">Start by adding the first user to the system.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)}`}>
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div>Activities: {user.total_activities || 0}</div>
                          <div className="text-xs text-gray-500">
                            Patients: {user.patients_managed || 0} | Tests: {user.tests_conducted || 0}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDate(user.last_activity)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleToggleUserStatus(user.id, user.status === 'active')}
                            className={user.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {user.status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="text-red-600 hover:text-red-900"
                            disabled={user.id === currentUser?.id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSubmit={handleCreateUser}
        />
      )}
    </div>
  )
}

// Add User Modal Component
const AddUserModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'assistant'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Add New User</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="assistant">Assistant</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Activity Logs Content Component
const ActivityLogsContent = () => {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    userId: '',
    actionType: '',
    entityType: '',
    dateFrom: '',
    dateTo: ''
  })
  const [users, setUsers] = useState([])
  const [stats, setStats] = useState({})

  useEffect(() => {
    loadActivityLogs()
    loadUsers()
    loadActivityStats()
  }, [filters])

  const loadActivityLogs = async () => {
    try {
      setLoading(true)
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
      const result = await window.electronAPI?.getActivityLogs(cleanFilters)
      if (result?.success) {
        setLogs(result.logs || [])
      }
    } catch (error) {
      console.error('Error loading activity logs:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    try {
      const result = await window.electronAPI?.getAllUsersDetailed()
      if (result?.success) {
        setUsers(result.users || [])
      }
    } catch (error) {
      console.error('Error loading users:', error)
    }
  }

  const loadActivityStats = async () => {
    try {
      const result = await window.electronAPI?.getActivityStatistics()
      if (result?.success) {
        setStats(result.stats || {})
      }
    } catch (error) {
      console.error('Error loading activity stats:', error)
    }
  }

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    })
  }

  const clearFilters = () => {
    setFilters({
      userId: '',
      actionType: '',
      entityType: '',
      dateFrom: '',
      dateTo: ''
    })
  }

  const getActionBadgeColor = (action) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800'
      case 'update': return 'bg-blue-100 text-blue-800'
      case 'delete': return 'bg-red-100 text-red-800'
      case 'view': return 'bg-gray-100 text-gray-800'
      case 'login': return 'bg-purple-100 text-purple-800'
      case 'logout': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  return (
    <div className="space-y-6">
      {/* Activity Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <ChartIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalActivities || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <DocumentIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayActivities || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <UsersIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.topUsers?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <AdminIcon className="w-8 h-8" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Entity Types</p>
                <p className="text-2xl font-bold text-gray-900">{stats.entityBreakdown?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">User</label>
              <select
                name="userId"
                value={filters.userId}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Users</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Action</label>
              <select
                name="actionType"
                value={filters.actionType}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Actions</option>
                <option value="create">Create</option>
                <option value="update">Update</option>
                <option value="delete">Delete</option>
                <option value="view">View</option>
                <option value="login">Login</option>
                <option value="logout">Logout</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type</label>
              <select
                name="entityType"
                value={filters.entityType}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Types</option>
                <option value="patient">Patient</option>
                <option value="test">Test</option>
                <option value="report">Report</option>
                <option value="inventory">Inventory</option>
                <option value="user">User</option>
                <option value="system">System</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
              <input
                type="date"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
              <input
                type="date"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="btn btn-outline w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Logs Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-gray-900">Activity Logs</h3>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading activity logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12">
              <ChartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Activity Found</h3>
              <p className="text-gray-500">No activity logs match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{log.user_name || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">{log.user_role}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionBadgeColor(log.action_type)}`}>
                          {log.action_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{log.entity_type}</div>
                        {log.entity_id && <div className="text-sm text-gray-500">ID: {log.entity_id}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{log.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {formatDateTime(log.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MainApp
