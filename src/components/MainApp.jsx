import React, { useState } from 'react'
import Layout from './layout/Layout'
import DashboardContent from './content/DashboardContent'
import MessagesContent from './content/MessagesContent'
import PatientsContent from './content/PatientsContent'
import TestsContent from '../pages/TestsContent'
import ReportsContent from './content/ReportsContent'
import InventoryContent from './content/InventoryContent'
import SettingsContent from './content/SettingsContent'
import AddPatientModal from './modals/AddPatientModal'
import UploadTestModal from './modals/UploadTestModal'
import GenerateReportModal from './modals/GenerateReportModal'
import NewMessageModal from './modals/NewMessageModal'
import useUser from '../hooks/useUser'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts'
import DoctorsDashboard from '../pages/DoctorsDashboard'
import AssistantDashboardScreen from '../pages/AssistantDashboardScreen'
import AdminDashboard from '../pages/AdminDashboard'


const MainApp = () => {
  const { user, logout } = useUser();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [modals, setModals] = useState({
    addPatient: false,
    uploadTest: false,
    generateReport: false,
    newMessage: false
  });

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'l',
      ctrlKey: true,
      shiftKey: true,
      callback: () => {
        if (window.confirm('Are you sure you want to logout?')) {
          logout();
        }
      }
    }
  ]);

  const handleSectionClick = (section) => {
    setActiveSection(section);
    setSearchTerm('');
  };

  const handleActionClick = () => {
    const modalMap = {
      patients: 'addPatient',
      tests: 'uploadTest',
      reports: 'generateReport',
      messages: 'newMessage'
    };
    const modalKey = modalMap[activeSection];
    if (modalKey) {
      setModals((prev) => ({ ...prev, [modalKey]: true }));
    }
  };

  const closeModal = (modalKey) => {
    setModals((prev) => ({ ...prev, [modalKey]: false }));
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };

  // Debug: Log user role for troubleshooting
  console.log('MainApp - Current user:', user);
  console.log('MainApp - User role:', user?.role);

  const renderContent = () => {
    const contentMap = {
      dashboard: user?.role === 'doctor' ? <DoctorsDashboard /> : <DashboardContent />,
      messages: <MessagesContent />,
      patients: <PatientsContent searchTerm={searchTerm} />,
      tests: <TestsContent />,
      reports: <ReportsContent />,
      inventory: <InventoryContent />,
      settings: <SettingsContent />
    };
    return contentMap[activeSection] || <div>Section not found</div>;
  };

  // Conditional dashboard rendering based on user role
  if (user?.role === 'doctor') {
    console.log('Rendering DoctorsDashboard');
    return (
      <>
        <Layout
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onActionClick={handleActionClick}
        >
          {renderContent()}
        </Layout>

        {modals.addPatient && <AddPatientModal onClose={() => closeModal('addPatient')} />}
        {modals.uploadTest && <UploadTestModal onClose={() => closeModal('uploadTest')} />}
        {modals.generateReport && <GenerateReportModal onClose={() => closeModal('generateReport')} />}
        {modals.newMessage && <NewMessageModal onClose={() => closeModal('newMessage')} />}
      </>
    );
  }

  if (user?.role === 'assistant') {
    console.log('Rendering AssistantDashboardScreen');
    return (
      <>
        <Layout
          activeSection={activeSection}
          onSectionClick={handleSectionClick}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onActionClick={handleActionClick}
        >
          {activeSection === 'dashboard' ? <AssistantDashboardScreen /> : renderContent()}
        </Layout>

        {modals.addPatient && <AddPatientModal onClose={() => closeModal('addPatient')} />}
        {modals.uploadTest && <UploadTestModal onClose={() => closeModal('uploadTest')} />}
        {modals.generateReport && <GenerateReportModal onClose={() => closeModal('generateReport')} />}
        {modals.newMessage && <NewMessageModal onClose={() => closeModal('newMessage')} />}
      </>
    );
  }

  if (user?.role === 'admin') {
    console.log('Rendering AdminDashboard');
    return <AdminDashboard />;
  }

  console.log('Rendering default layout for role:', user?.role);

  // Default layout for admin and other roles
  return (
    <>
      <Layout
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onActionClick={handleActionClick}
      >
        {renderContent()}
      </Layout>

      {/* Modals */}
      {modals.addPatient && <AddPatientModal onClose={() => closeModal('addPatient')} />}
      {modals.uploadTest && <UploadTestModal onClose={() => closeModal('uploadTest')} />}
      {modals.generateReport && <GenerateReportModal onClose={() => closeModal('generateReport')} />}
      {modals.newMessage && <NewMessageModal onClose={() => closeModal('newMessage')} />}
    </>
  );
}

export default MainApp