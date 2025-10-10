import { useState, useEffect, useCallback } from 'react'

const useUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize user from storage or electron API
  useEffect(() => {
    const initializeUser = async () => {
      try {
        setLoading(true)
        
        // Try to get user from electron API first
        if (window.electronAPI?.getCurrentUser) {
          const currentUser = await window.electronAPI.getCurrentUser()
          if (currentUser) {
            setUser(currentUser)
            setLoading(false)
            return
          }
        }
        
        // Fallback to localStorage
        const storedUser = localStorage.getItem('currentUser')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (err) {
        setError(err.message)
        console.error('Error initializing user:', err)
      } finally {
        setLoading(false)
      }
    }

    initializeUser()
  }, [])

  // Login user
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true)
      setError(null)

      let userData
      if (window.electronAPI?.login) {
        userData = await window.electronAPI.login(credentials)
      } else {
        // Mock login for development
        userData = {
          id: Date.now(),
          name: credentials.name || 'Dr. John Doe',
          email: credentials.email,
          role: credentials.role || 'doctor',
          avatar: null,
          createdAt: new Date().toISOString()
        }
      }

      setUser(userData)
      localStorage.setItem('currentUser', JSON.stringify(userData))
      return userData
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  // Logout user
  const logout = useCallback(async () => {
    try {
      setLoading(true)
      
      if (window.electronAPI?.logout) {
        await window.electronAPI.logout()
      }
      
      setUser(null)
      localStorage.removeItem('currentUser')
    } catch (err) {
      setError(err.message)
      console.error('Logout error:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Update user profile
  const updateProfile = useCallback(async (updates) => {
    try {
      setLoading(true)
      setError(null)

      let updatedUser
      if (window.electronAPI?.updateUser) {
        updatedUser = await window.electronAPI.updateUser(user.id, updates)
      } else {
        updatedUser = { ...user, ...updates }
      }

      setUser(updatedUser)
      localStorage.setItem('currentUser', JSON.stringify(updatedUser))
      return updatedUser
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [user])

  // Check if user has specific role
  const hasRole = useCallback((role) => {
    return user?.role === role
  }, [user])

  // Check if user has permission
  const hasPermission = useCallback((permission) => {
    if (!user) return false
    
    const rolePermissions = {
      admin: ['read', 'write', 'delete', 'manage_users', 'manage_settings'],
      doctor: ['read', 'write', 'manage_patients', 'generate_reports'],
      assistant: ['read', 'write', 'manage_patients'],
      viewer: ['read']
    }
    
    return rolePermissions[user.role]?.includes(permission) || false
  }, [user])

  return {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    hasRole,
    hasPermission,
    isAuthenticated: !!user
  }
}

export default useUser