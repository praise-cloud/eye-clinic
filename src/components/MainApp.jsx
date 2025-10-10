import React from 'react'
import Sidebar from './layout/Sidebar'
import Header from './layout/Header'
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

class MainApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeSection: 'dashboard',
      showAddPatientModal: false,
      showUploadTestModal: false,
      showGenerateReportModal: false,
      showNewMessageModal: false,
      searchTerm: ''
    }
  }

  componentDidMount() {
    // Load current user on mount
    this.loadCurrentUser()
  }

  loadCurrentUser = async () => {
    try {
      const user = await window.electronAPI?.getCurrentUser()
      this.setState({ currentUser: user })
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }

  handleSectionClick = (section) => {
    this.setState({ activeSection: section, searchTerm: '' })
  }

  handleActionClick = () => {
    const { activeSection } = this.state
    switch (activeSection) {
      case 'patients':
        this.setState({ showAddPatientModal: true })
        break
      case 'tests':
        this.setState({ showUploadTestModal: true })
        break
      case 'reports':
        this.setState({ showGenerateReportModal: true })
        break
      case 'messages':
        this.setState({ showNewMessageModal: true })
        break
      default:
        console.log('Action clicked for:', activeSection)
    }
  }

  handleLogout = async () => {
    try {
      await window.electronAPI?.logout()
      window.location.reload()  // Redirect to auth
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  renderContent = () => {
    const { activeSection, searchTerm } = this.state
    switch (activeSection) {
      case 'dashboard':
        return <DashboardContent />
      case 'messages':
        return <MessagesContent />
      case 'patients':
        return <PatientsContent searchTerm={searchTerm} />
      case 'tests':
        return <TestsContent />
      case 'reports':
        return <ReportsContent />
      case 'inventory':
        return <InventoryContent />
      case 'settings':
        return <SettingsContent />
      default:
        return <div>Section not found</div>
    }
  }

  render() {
    const { currentUser, activeSection, showAddPatientModal, showUploadTestModal, showGenerateReportModal, showNewMessageModal } = this.state

    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar
          activeSection={activeSection}
          onSectionClick={this.handleSectionClick}
          currentUser={currentUser}
          onLogout={this.handleLogout}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            activeSection={activeSection}
            onActionClick={this.handleActionClick}
            currentUser={currentUser}
            searchTerm={this.state.searchTerm}
            onSearchChange={(term) => this.setState({ searchTerm: term })}
          />
          <main className="flex-1 overflow-auto p-6">
            {this.renderContent()}
          </main>
        </div>

        {/* Modals */}
        {showAddPatientModal && (
          <AddPatientModal onClose={() => this.setState({ showAddPatientModal: false })} currentUser={currentUser} />
        )}
        {showUploadTestModal && (
          <UploadTestModal onClose={() => this.setState({ showUploadTestModal: false })} currentUser={currentUser} />
        )}
        {showGenerateReportModal && (
          <GenerateReportModal onClose={() => this.setState({ showGenerateReportModal: false })} currentUser={currentUser} />
        )}
        {showNewMessageModal && (
          <NewMessageModal onClose={() => this.setState({ showNewMessageModal: false })} currentUser={currentUser} />
        )}
      </div>
    )
  }
}

export default MainApp