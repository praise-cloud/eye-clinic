import React, { useState } from 'react'
import Layout from './layout/Layout'
import DashboardContent from './content/DashboardContent'
import MessagesContent from './content/MessagesContent'
import PatientsContent from './content/PatientsContent'
import TestsContent from './content/TestsContent'
import ReportsContent from './content/ReportsContent'
import InventoryContent from './content/InventoryContent'
import SettingsContent from './content/SettingsContent'
import AddPatientModal from './modals/AddPatientModal'
import UploadTestModal from './modals/UploadTestModal'
import GenerateReportModal from './modals/GenerateReportModal'
import NewMessageModal from './modals/NewMessageModal'
import useUser from '../hooks/useUser'
import DoctorsDashboard from '../pages/DoctorsDashboard'


const MainApp = () => {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [modals, setModals] = useState({
    addPatient: false,
    uploadTest: false,
    generateReport: false,
    newMessage: false
  });

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

  // Conditional dashboard rendering
  if (user?.role === 'doctor') {
    return <DoctorsDashboard />;
  }

  const renderContent = () => {
    const contentMap = {
      dashboard: <DashboardContent />,
      messages: <MessagesContent />,
      patients: <PatientsContent searchTerm={searchTerm} />,
      tests: <TestsContent />,
      reports: <ReportsContent />,
      inventory: <InventoryContent />,
      settings: <SettingsContent />
    };
    return contentMap[activeSection] || <div>Section not found</div>;
  };

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