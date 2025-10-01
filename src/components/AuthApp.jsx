import React, { useState, useEffect } from 'react'
import WelcomeScreen from '../screens/WelcomeScreen'
import SetupScreen from '../screens/SetupScreen'
import LoginScreen from '../screens/LoginScreen'
import LoadingScreen from './LoadingScreen'
import SignupScreen from '../screens/SigupScreen'

const AuthApp = () => {
  const [currentScreen, setCurrentScreen] = useState('loading')
  const [isFirstRun, setIsFirstRun] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    initializeApp()
  }, [])

  const initializeApp = async () => {
    try {
      setLoadingMessage('Checking system status...')

      // Check if this is first run
      const firstRun = await window.electronAPI?.isFirstRun()
      setIsFirstRun(firstRun)

      setTimeout(() => {
        setLoading(false)
        if (firstRun) {
          setCurrentScreen('welcome')
        } else {
          setCurrentScreen('login')
        }
      }, 1500)

    } catch (error) {
      console.error('Error initializing app:', error)
      setLoading(false)
      setCurrentScreen('welcome') // Fallback to welcome
    }
  }

  const handleScreenChange = (screen, message = 'Loading...') => {
    if (screen === 'loading') {
      setLoadingMessage(message)
      setLoading(true)
      setCurrentScreen('loading')
    } else {
      setLoading(false)
      setCurrentScreen(screen)
    }
  }

 const handleSetupComplete = async (clinicData, adminData) => {
  if (!window.electronAPI) {
    console.error('Electron API not available');
    return;
  }

  // Add the selected role to adminData (already there)
  adminData.role = selectedRole;

  try {
    handleScreenChange('loading', 'Setting up your clinic...')

    const result = await window.electronAPI.completeSetup(clinicData, adminData);  // Now uses new handler

    if (result?.success) {
      setLoadingMessage('Setup completed successfully!')
      setTimeout(() => {
        window.electronAPI?.openMainWindow()
      }, 1500)
    } else {
      throw new Error(result?.message || 'Setup failed')
    }
  } catch (error) {
    console.error('Setup error:', error)
    alert(error.message || 'Setup failed. Please try again.')
    setCurrentScreen('setup')
  }
}

  const handleLogin = async (email, password) => {
    //API check
    if (!window.electronAPI) {
    console.error('Electron API not available');
    return;
  }

    try {
      handleScreenChange('loading', 'Signing you in...')

      const result = await window.electronAPI?.login(email, password)

      if (result?.success) {
        setLoadingMessage('Login successful!')
        setTimeout(() => {
          window.electronAPI?.openMainWindow()
        }, 1000)
      } else {
        throw new Error(result?.message || 'Login failed')
      }
    } catch (error) {
      console.error('Login error:', error)
      alert(error.message || 'Login failed. Please check your credentials.')
      setCurrentScreen('login')
    }
  }

  if (loading) {
    return <LoadingScreen message={loadingMessage} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {currentScreen === 'welcome' && (
        <WelcomeScreen onGetStarted={() => setCurrentScreen('setup')} />
      )}

      {/* Role Selection and Signup Flow */}
      {currentScreen === 'setup' && !selectedRole && (
        <SetupScreen
          onSelectRole={(role) => setSelectedRole(role)}
          onBack={() => setCurrentScreen('welcome')}
        />
      )}

      {currentScreen === 'setup' && selectedRole && (
        <SignupScreen
          selectedRole={selectedRole}
          onComplete={handleSetupComplete}
          onBack={() => setSelectedRole(null)} // Go back to role selection
        />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onAddUser={() => alert('Add user functionality coming soon!')}
        />
      )}
    </div>
  )
}

export default AuthApp