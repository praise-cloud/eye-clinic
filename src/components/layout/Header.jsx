import React, { useState, useRef, useEffect } from 'react'

const Header = ({ activeSection, onActionClick, currentUser, searchTerm, onSearchChange }) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')  // For date picker state

  const filterRef = useRef()
  const dateRef = useRef()
  const userRef = useRef()

  const toggleUserDropdown = () => setShowUserDropdown(!showUserDropdown)
  const closeDropdowns = () => {
    setShowUserDropdown(false)
    setFilterOpen(false)
    setDateOpen(false)
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) setFilterOpen(false)
      if (dateRef.current && !dateRef.current.contains(event.target)) setDateOpen(false)
      if (userRef.current && !userRef.current.contains(event.target)) setShowUserDropdown(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const userMenuItems = [
    { label: 'Profile', icon: 'user' },
    { label: 'Settings', icon: 'cog' },
    { label: 'Logout', icon: 'log-out', onClick: async () => {
      try {
        await window.electronAPI?.logout()
        window.location.reload()  // Redirect to auth
      } catch (error) {
        console.error('Logout error:', error)
      }
    } }
  ]

  const getActionLabel = () => {
    switch (activeSection) {
      case 'patients': return '+ New Patient'
      case 'tests': return '+ Upload Test'
      case 'reports': return '+ Generate Report'
      case 'messages': return '+ New Message'
      case 'inventory': return '+ Add Item'
      default: return '+ Action'
    }
  }

  const handleUserMenuClick = (item) => {
    if (item.onClick) item.onClick()
    closeDropdowns()
  }

  const dateOptions = ['Today', 'Yesterday', 'This Week', 'This Month', 'Custom']

  const handleDateSelect = (dateOption) => {
    setSelectedDate(dateOption)
    setDateOpen(false)
    // Trigger search with date filter via onSearchChange or parent callback
    // e.g., onSearchChange(`${searchTerm} date:${dateOption.toLowerCase()}`)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 capitalize">
              {activeSection === 'dashboard' ? 'Dashboard' : activeSection === 'messages' ? 'Messages' : activeSection === 'patients' ? 'Patients' : activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            <p className="text-sm text-gray-600">Good day, {currentUser?.name || 'Doctor John Dee'}</p>
          </div>

          <div className="flex items-center space-x-4 ml-8 flex-1 max-w-md">
            <div className="relative flex-1" ref={filterRef}>
              <input
                type="text"
                placeholder={activeSection === 'patients' ? "Patient's of the day name or cases..." : "Search..."}
                className="input pl-10 pr-10 w-full"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={closeDropdowns}
              />
              <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button
                className="absolute right-20 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                onClick={() => setFilterOpen(!filterOpen)}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </button>
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                onClick={() => setDateOpen(!dateOpen)}
                ref={dateRef}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {filterOpen && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">All Items</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Active</button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Inactive</button>
                  </div>
                </div>
              )}

              {dateOpen && (
                <div className="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {dateOptions.map((option) => (
                      <button
                        key={option}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => handleDateSelect(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onActionClick}
              className="btn-primary flex items-center space-x-2"
            >
              <span>{getActionLabel()}</span>
            </button>

            <div className="relative" ref={userRef}>
              <button
                onClick={toggleUserDropdown}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {currentUser?.name?.charAt(0) || 'D'}
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    {userMenuItems.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleUserMenuClick(item)}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <span className="mr-3">
                          {item.icon === 'user' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                          {item.icon === 'cog' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {item.icon === 'log-out' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          )}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          )}
                          {item.icon === 'log-out' && (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                          )}
                        </span>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header