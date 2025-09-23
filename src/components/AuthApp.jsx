import React, { useState, useEffect } from 'react'
import WelcomeScreen from './WelcomeScreen'
import SetupScreen from './SetupScreen'
import LoginScreen from './LoginScreen'
import LoadingScreen from './LoadingScreen'
import { EyeIcon } from './Icons'

const AuthApp = () => {
  const [currentScreen, setCurrentScreen] = useState('loading')
  const [isFirstRun, setIsFirstRun] = useState(true)
  const [loading, setLoading] = useState(true)
  const [loadingMessage, setLoadingMessage] = useState('Initializing...')

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
    try {
      handleScreenChange('loading', 'Setting up your clinic...')
      
      const result = await window.electronAPI?.completeSetup(clinicData, adminData)
      
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
      
      {currentScreen === 'setup' && (
        <SetupScreen 
          onComplete={handleSetupComplete}
          onBack={() => setCurrentScreen('welcome')}
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