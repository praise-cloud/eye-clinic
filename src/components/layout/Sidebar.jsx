import React, { useState } from 'react'
import { EyeIcon, ChartIcon, ChatIcon, UsersIcon, DocumentIcon, InventoryIcon, LogoutIcon} from '../Icons'
import useUser from '../../hooks/useUser'
import LogoutModal from '../modals/LogoutModal'

const Sidebar = ({ activeSection, onSectionClick, currentUser }) => {
  const { user, logout, loading } = useUser();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };
  
  const allSidebarItems = [
    { id: 'dashboard', name: 'Dashboard', icon: <ChartIcon className="w-5 h-5" /> },
    { id: 'messages', name: 'Messages', icon: <ChatIcon className="w-5 h-5" /> },
    { id: 'tests', name: 'Test', icon: <DocumentIcon className="w-5 h-5" /> },
    { id: 'inventory', name: 'Inventory', icon: <InventoryIcon className="w-5 h-5" />, roles: ['admin', 'assistant'] },
    { id: 'settings', name: 'Settings', icon: <DocumentIcon className="w-5 h-5" /> },
    { id: 'logout', name: 'Logout', icon: <LogoutIcon className="w-5 h-5" /> },
  ];
  
  const sidebarItems = allSidebarItems.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  )

  return (
    <div className="flex flex-col w-64 bg-white shadow-lg h-screen">
      {/* Logo */}
      <div className="flex items-center justify-center h-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex items-center">
          <EyeIcon className="w-8 h-8 text-white mr-3" />
          <span className="text-xl font-bold text-white">KORENYE CLINIC NIG. LTD.</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'logout') {
                setShowLogoutModal(true);
              } else {
                onSectionClick(item.id);
              }
            }}
            className={`${
              activeSection === item.id
                ? 'bg-blue-100 border-r-2 border-blue-600 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            } group flex items-center px-4 py-2 text-sm font-medium rounded-md w-full text-left transition-colors duration-200`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </button>
        ))}
      </nav>
      
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        loading={false}
      />
    </div>
  )
}

export default Sidebar