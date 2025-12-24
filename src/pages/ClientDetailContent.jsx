<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon } from '../components/Icons';
import TestResultsContent from './TestResultsContent';
import TestsContent from './TestsContent';
import useTests from '../hooks/useTests';
=======
import React, { useState } from 'react';
import { ArrowLeftIcon } from '../components/Icons';
import TestResultsContent from './TestResultsContent';
import TestsContent from './TestsContent';
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9

const ClientDetailContent = ({ client, onBack, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [sharedTests, setSharedTests] = useState([]);
<<<<<<< HEAD
  const [testHistory, setTestHistory] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    testType: '',
    scheduledDate: '',
    notes: ''
  });

  const { tests: dbTests, fetchTests } = useTests();

=======
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
  const [formData, setFormData] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    case: client?.case || '',
    date: client?.date || ''
  });

<<<<<<< HEAD
  // Load test history for this patient
  useEffect(() => {
    const loadTestHistory = async () => {
      if (client?.id) {
        try {
          const result = await window.electronAPI.getTestsByPatient(client.id);
          if (result.success) {
            const formattedTests = result.tests.map(test => ({
              id: test.id,
              date: test.test_date ? new Date(test.test_date).toLocaleDateString() : 'N/A',
              case: `${test.machine_type || 'Unknown'} Test - ${test.eye || 'Both'} eye`,
              status: 'Completed'
            }));
            setTestHistory(formattedTests);
          }
        } catch (error) {
          console.error('Error loading test history:', error);
        }
      }
    };

    loadTestHistory();
  }, [client?.id]);
=======
  // Mock other cases for this client
  const otherCases = [
    { id: 1, date: '20/01/2024', case: 'Regular checkup', status: 'Completed' },
    { id: 2, date: '15/01/2024', case: 'Eye strain consultation', status: 'Completed' },
    { id: 3, date: '10/01/2024', case: 'Vision test', status: 'In Progress' }
  ];
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9

  const handleSave = () => {
    // Pass updated data back to parent
    if (onSave) {
      onSave(formData);
    }
    console.log('Saving client data:', formData);
    setEditMode(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

<<<<<<< HEAD
  const handleScheduleInputChange = (field, value) => {
    setScheduleFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleTest = async () => {
    try {
      // Here you would typically save the scheduled test to database
      // For now, we'll just add it to the sharedTests array
      const scheduledTest = {
        id: Date.now(),
        patientName: formData.name,
        testType: scheduleFormData.testType,
        result: 'Scheduled',
        date: scheduleFormData.scheduledDate,
        notes: `Scheduled: ${scheduleFormData.notes || 'No notes'}`,
        status: 'Scheduled'
      };

      setSharedTests(prev => [...prev, scheduledTest]);
      setShowScheduleModal(false);
      setScheduleFormData({ testType: '', scheduledDate: '', notes: '' });
    } catch (error) {
      console.error('Error scheduling test:', error);
    }
  };

=======
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100';
      case 'In Progress': return 'text-yellow-600 bg-yellow-100';
      case 'Pending': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="flex flex-col w-full p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
<<<<<<< HEAD
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:hover:text-white"
=======
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Tab Navigation */}
<<<<<<< HEAD
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-6">
=======
      <div className="bg-white rounded-lg shadow mb-6">
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('details')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'details'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Client Details
            </button>
            <button
              onClick={() => setActiveTab('tests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'tests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Test Results
            </button>
            <button
              onClick={() => setActiveTab('scheduled')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'scheduled'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Scheduled Tests
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <>
          {/* Client Information Card */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Client Details</h2>
          <div className="flex gap-2">
            {editMode ? (
              <>
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Edit Information
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            {editMode ? (
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-900">{formData.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            {editMode ? (
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-900">{formData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            {editMode ? (
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-900">{formData.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            {editMode ? (
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            ) : (
              <p className="text-gray-900">{formData.date}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Case</label>
            {editMode ? (
              <textarea
                value={formData.case}
                onChange={(e) => handleInputChange('case', e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2 h-20"
              />
            ) : (
              <p className="text-gray-900">{formData.case}</p>
            )}
          </div>
        </div>
      </div>

<<<<<<< HEAD
          {/* Case History & Schedule Test */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Test History</h3>
              <button
                onClick={() => setShowScheduleModal(true)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Schedule Test
              </button>
            </div>
=======
          {/* Other Cases */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Case History</h3>
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
<<<<<<< HEAD
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Description</th>
=======
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Description</th>
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
<<<<<<< HEAD
                  {testHistory.length > 0 ? testHistory.map((testItem) => (
                    <tr key={testItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{testItem.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{testItem.case}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(testItem.status)}`}>
                          {testItem.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">
                        No test history available for this patient.
                      </td>
                    </tr>
                  )}
=======
                  {otherCases.map((caseItem) => (
                    <tr key={caseItem.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{caseItem.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{caseItem.case}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                      </td>
                    </tr>
                  ))}
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Test Results Tab */}
      {activeTab === 'tests' && (
        <div className="bg-white rounded-lg shadow">
          <TestResultsContent
            clientName={formData.name}
            onTestCreate={(newTest) => {
              const scheduledTest = {
                id: Date.now(),
                patient: newTest.patientName,
                type: newTest.testType,
                date: newTest.date,
                status: 'Completed'
              };
              setSharedTests(prev => [...prev, scheduledTest]);
            }}
          />
        </div>
      )}

      {/* Scheduled Tests Tab */}
      {activeTab === 'scheduled' && (
        <div className="bg-white rounded-lg shadow">
          <TestsContent
            clientName={formData.name}
            additionalTests={sharedTests}
          />
        </div>
      )}
<<<<<<< HEAD

      {/* Schedule Test Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Schedule Test for {formData.name}</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                <select
                  value={scheduleFormData.testType}
                  onChange={(e) => handleScheduleInputChange('testType', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="">Select test type</option>
                  <option value="Vision Test">Vision Test</option>
                  <option value="Eye Pressure">Eye Pressure</option>
                  <option value="Retinal Scan">Retinal Scan</option>
                  <option value="Color Blindness">Color Blindness</option>
                  <option value="Field Test">Field Test</option>
                  <option value="OCT Scan">OCT Scan</option>
                  <option value="Fundus Photography">Fundus Photography</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date & Time</label>
                <input
                  type="datetime-local"
                  value={scheduleFormData.scheduledDate}
                  onChange={(e) => handleScheduleInputChange('scheduledDate', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={scheduleFormData.notes}
                  onChange={(e) => handleScheduleInputChange('notes', e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 h-20"
                  placeholder="Additional notes or instructions..."
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowScheduleModal(false);
                  setScheduleFormData({ testType: '', scheduledDate: '', notes: '' });
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleTest}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Schedule Test
              </button>
            </div>
          </div>
        </div>
      )}
=======
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
    </div>
  );
};

<<<<<<< HEAD
export default ClientDetailContent;
=======
export default ClientDetailContent;
>>>>>>> d7adb94f093a3e0b1314671557a7ee3c3ed7e9e9
