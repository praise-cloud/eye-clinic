import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainApp from './components/MainApp';
import LoginScreen from './pages/LoginScreen';
import SetupScreen from './pages/SetupScreen';
import LoadingScreen from './components/LoadingScreen';
import useUser from './hooks/useUser';

const App = () => {
  const { user, login, loading } = useUser();
  const [showSetup, setShowSetup] = useState(false);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <LoginScreen onLogin={login} onAddUser={() => setShowSetup(true)} />
        }
      />
      <Route
        path="/setup"
        element={<SetupScreen onComplete={() => setShowSetup(false)} />}
      />
      <Route
        path="/*"
        element={
          user ? <MainApp /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

export default App;