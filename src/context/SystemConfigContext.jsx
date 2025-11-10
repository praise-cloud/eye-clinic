import React, { createContext, useContext, useState, useEffect } from 'react';

const SystemConfigContext = createContext();

export const useSystemConfig = () => {
  const context = useContext(SystemConfigContext);
  if (!context) {
    throw new Error('useSystemConfig must be used within SystemConfigProvider');
  }
  return context;
};

export const SystemConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('systemConfig');
    return saved ? JSON.parse(saved) : {
      autoBackups: true,
      emailNotifications: true,
      twoFactorAuth: false,
      backupTime: '02:00',
      sessionTimeout: 30,
      maxLoginAttempts: 3
    };
  });

  useEffect(() => {
    localStorage.setItem('systemConfig', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('systemConfigChanged', { detail: config }));
  }, [config]);

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleConfig = (key) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <SystemConfigContext.Provider value={{ config, updateConfig, toggleConfig }}>
      {children}
    </SystemConfigContext.Provider>
  );
};
