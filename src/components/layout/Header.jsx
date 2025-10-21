import React, { useState, useRef } from 'react';

const Header = ({ activeSection, currentUser, searchTerm, onSearchChange }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const userRef = useRef();

  const userMenuItems = [
    { label: 'Profile' },
    { label: 'Settings' },
    { label: 'Logout', onClick: async () => {
      try {
        await window.electronAPI?.logout();
        window.location.reload();
      } catch (error) {
        console.error('Logout error:', error);
      }
    } }
  ];

  const handleUserMenuClick = (item) => {
    if (item.onClick) item.onClick();
    setShowUserDropdown(false);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="w-full px-6 py-4 flex items-center justify-end">
        {/* Left: Greeting and Section Title */}
        {/* <div className="flex flex-col">
          <span className="text-lg font-bold text-gray-900">Good day</span>
          <span className="text-base text-gray-700">{currentUser?.name || 'John Doe'}</span>
          {activeSection === 'dashboard' && (
            <div className="mt-4">
              <span className="font-semibold">Patient's of the day</span>
            </div>
          )}
        </div> */}

        {/* Center: Search, Filter, Date (dashboard only) */}
        {/* {activeSection === 'dashboard' && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={searchTerm}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="name or cases..."
              className="border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
              style={{ minWidth: 180 }}
            />
            {/* <button className="px-3 py-2 border rounded text-sm bg-gray-50 hover:bg-gray-100">Filter</button>
            <button className="px-3 py-2 border rounded text-sm bg-gray-50 hover:bg-gray-100">Date</button> */}
          {/* </div> */}
        {/* )} */}

        {/* Right: User Info Dropdown */}
        <div className="relative" ref={userRef}>
          <button
            className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-100"
            onClick={() => setShowUserDropdown(!showUserDropdown)}
          >
            <img
              src={currentUser?.avatar || 'https://ui-avatars.com/api/?name=' + (currentUser?.name || 'User')}
              alt="avatar"
              className="w-8 h-8 rounded-full border ml-2"
            />
            <span className="font-medium text-gray-700">{currentUser?.role === 'admin' ? 'Admin' : currentUser?.name || 'Doctor'}</span>
            <svg className="w-4 h-4 ml-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </button>
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
              {userMenuItems.map((item) => (
                <button
                  key={item.label}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                  onClick={() => handleUserMenuClick(item)}
                >
                  <span className="mr-2">{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};


export default Header