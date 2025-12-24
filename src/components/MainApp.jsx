import React, { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
<<<<<<< HEAD
import DoctorsDashboard from '../pages/dashboard/DoctorsDashboard'
import AssistantDashboardScreen from '../pages/dashboard/AssistantDashboardScreen'
import AdminDashboard from '../pages/dashboard/AdminDashboard'
=======
import DoctorsDashboard from '../pages/DoctorsDashboard'
import AssistantDashboardScreen from '../pages/AssistantDashboardScreen'
import AdminDashboard from '../pages/AdminDashboard'
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
import CreateInventoryItemScreen from '../pages/CreateInventoryItemScreen'
import ViewInventoryItemScreen from '../pages/ViewInventoryItemScreen'


const MainApp = () => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [modals, setModals] = useState({
    addPatient: false,
    uploadTest: false,
    generateReport: false,
    newMessage: false
  });

  // Determine active section from route
  const getActiveSection = () => {
    const path = location.pathname;
    if (path.startsWith('/inventory')) return 'inventory';
    if (path.startsWith('/patients')) return 'patients';
    if (path.startsWith('/messages')) return 'messages';
    if (path.startsWith('/tests')) return 'tests';
    if (path.startsWith('/reports')) return 'reports';
    if (path.startsWith('/settings')) return 'settings';
    return 'dashboard';
  };

  const activeSection = getActiveSection();

  // Keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: 'l',
      ctrlKey: true,
      shiftKey: true,
<<<<<<< HEAD
      callback: async () => {
        if (window.confirm('Are you sure you want to logout?')) {
          try {
            await logout();
          } catch (error) {
            console.error('Logout error:', error);
            alert('Failed to logout. Please try again.');
          }
=======
      callback: () => {
        if (window.confirm('Are you sure you want to logout?')) {
          logout();
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        }
      }
    }
  ]);

  const handleSectionClick = (section) => {
    setSearchTerm('');
    navigate(`/${section === 'dashboard' ? '' : section}`);
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
    return (
      <Routes>
        <Route path="/" element={user?.role === 'doctor' ? <DoctorsDashboard /> : <DashboardContent />} />
        <Route path="/messages" element={<MessagesContent />} />
        <Route path="/patients" element={<PatientsContent searchTerm={searchTerm} />} />
        <Route path="/tests" element={<TestsContent />} />
        <Route path="/reports" element={<ReportsContent />} />
        <Route path="/inventory" element={<InventoryContent />} />
        <Route path="/inventory/create" element={<CreateInventoryItemScreen />} />
        <Route path="/inventory/edit/:id" element={<CreateInventoryItemScreen />} />
        <Route path="/inventory/view/:id" element={<ViewInventoryItemScreen />} />
        <Route path="/settings" element={<SettingsContent />} />
      </Routes>
    );
  };

  // Conditional dashboard rendering based on user role
  if (user?.role === 'admin') {
    console.log('Rendering AdminDashboard');
    return <AdminDashboard />;
  }

  // Default layout for all roles
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

<<<<<<< HEAD
export default MainApp
=======
export default MainApp
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
