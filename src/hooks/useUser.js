import { useState, useEffect, useCallback } from 'react'

const useUser = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize user from storage
  useEffect(() => {
<<<<<<< HEAD
    const initializeUser = async () => {
      setLoading(true);
      let storedUser = null;
      let mainProcessUser = null;

      try {
        // 1. Try to load from localStorage
        const storedUserString = localStorage.getItem('currentUser');
        if (storedUserString) {
          storedUser = JSON.parse(storedUserString);
        }
      } catch (err) {
        console.error('Error loading user from localStorage:', err);
        storedUser = null; // In case of parsing error
      }

      try {
        // 2. Get user from main process (Electron)
        if (window.electronAPI?.getCurrentUser) {
          const result = await window.electronAPI.getCurrentUser();
          if (result?.success && result?.user) {
            mainProcessUser = result.user;
          }
        }
      } catch (err) {
        console.error('Error getting user from main process:', err);
        mainProcessUser = null;
      }

      // 3. Reconcile states
      if (mainProcessUser) {
        // Main process has a user, ensure frontend is in sync
        if (!storedUser || storedUser.id !== mainProcessUser.id) {
          console.log('Reconciling: Main process user found, updating localStorage and frontend state.');
          setUser(mainProcessUser);
          localStorage.setItem('currentUser', JSON.stringify(mainProcessUser));
        } else {
          // Both have same user, good to go
          setUser(storedUser);
        }
      } else {
        // Main process has no user
        if (storedUser) {
          // Frontend has a stale user, clear it
          console.log('Reconciling: Main process has no user, clearing stale localStorage and frontend state.');
          localStorage.removeItem('currentUser');
          setUser(null);
        } else {
          // Neither has a user, as expected
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeUser();
  }, []);

  // Login user
  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    
    try {
=======
    setLoading(true)
    
    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    } catch (err) {
      console.error('Error loading user:', err)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Login user
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true)
      setError(null)

>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
      let result
      if (window.electronAPI?.login) {
        result = await window.electronAPI.login(credentials.email, credentials.password)
        console.log('Login result:', result)
<<<<<<< HEAD

=======
        
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        if (result?.success && result?.user) {
          const userData = result.user
          setUser(userData)
          localStorage.setItem('currentUser', JSON.stringify(userData))
<<<<<<< HEAD

=======
          
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
          // Dispatch login event for admin dashboard
          window.dispatchEvent(new CustomEvent('userLogin', {
            detail: {
              userName: userData.name,
              timestamp: new Date().toLocaleString(),
              status: 'success'
            }
          }));
          
<<<<<<< HEAD
          setLoading(false)
          return userData
        } else {
          setLoading(false)
          const error = new Error(result?.error || 'Login failed')
          setError(error.message)
          throw error
=======
          return userData
        } else {
          throw new Error(result?.error || 'Login failed')
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        }
      } else {
        // Mock login for development
        const userData = {
          id: Date.now(),
          name: credentials.name || credentials.firstName + ' ' + credentials.lastName || 'User',
          email: credentials.email,
          role: credentials.role || 'admin',
          avatar: null,
          createdAt: new Date().toISOString()
        }
        setUser(userData)
        localStorage.setItem('currentUser', JSON.stringify(userData))
<<<<<<< HEAD

=======
        
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        // Dispatch login event for admin dashboard
        window.dispatchEvent(new CustomEvent('userLogin', {
          detail: {
            userName: userData.name,
            timestamp: new Date().toLocaleString(),
            status: 'success'
          }
        }));
<<<<<<< HEAD

=======
        
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        return userData
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.message)
<<<<<<< HEAD
      setLoading(false)
      throw err
=======
      throw err
    } finally {
      setLoading(false)
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
    }
  }, [])

  // Logout user
<<<<<<< HEAD
  const logout = useCallback(async (data = {}) => {
    console.log('Logout called')

    try {
      // Call backend logout to clear main process state and log activity
      if (window.electronAPI?.logout) {
        await window.electronAPI.logout(data)
      }
    } catch (error) {
      console.error('Backend logout error:', error)
      // Continue with frontend cleanup even if backend fails
    }

    // Clear frontend state
    localStorage.removeItem('currentUser')
    setUser(null)

    // Rely on router guard to redirect to login
=======
  const logout = useCallback(() => {
    console.log('Logout called')
    
    // Clear all storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Set user to null
    setUser(null)
    
    // Redirect to login immediately
    window.location.href = '/login'
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
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

<<<<<<< HEAD
export default useUser
=======
export default useUser
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
