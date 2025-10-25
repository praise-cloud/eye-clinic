import React, { useState } from 'react';
import { ArrowLeftIcon } from '../Icons';
import TestResultsContent from './TestResultsContent';
import TestsContent from './TestsContent';

const ClientDetailContent = ({ client, onBack, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [sharedTests, setSharedTests] = useState([]);
  const [formData, setFormData] = useState({
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    case: client?.case || '',
    date: client?.date || ''
  });

  // Mock other cases for this client
  const otherCases = [
    { id: 1, date: '20/01/2024', case: 'Regular checkup', status: 'Completed' },
    { id: 2, date: '15/01/2024', case: 'Eye strain consultation', status: 'Completed' },
    { id: 3, date: '10/01/2024', case: 'Vision test', status: 'In Progress' }
  ];

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
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Dashboard
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow mb-6">
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

          {/* Other Cases */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Case History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Case Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
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
    </div>
  );
};

export default ClientDetailContent;