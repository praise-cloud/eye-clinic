import React, { useState } from 'react'
import MainApp from './components/MainApp'
import LoginScreen from './pages/LoginScreen'
import SetupScreen from './pages/SetupScreen'
import LoadingScreen from './components/LoadingScreen'
import useUser from './hooks/useUser'

const App = () => {
  const { user, login, loading } = useUser()
  const [showSetup, setShowSetup] = useState(false)

  if (loading) {
    return <LoadingScreen />
  }

  if (showSetup) {
    return <SetupScreen onComplete={() => setShowSetup(false)} />
  }

  if (!user) {
    return (
      <LoginScreen 
        onLogin={login}
        onAddUser={() => setShowSetup(true)}
      />
    )
  }

  return <MainApp />
}

export default App