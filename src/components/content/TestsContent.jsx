import React, { useState, useEffect } from 'react'

const TestsContent = () => {
  const [tests, setTests] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API call
    setTests([
      { id: 1, patient: 'John Doe', type: 'Visual Field', date: '2024-01-15', status: 'Completed' },
      { id: 2, patient: 'Jane Smith', type: 'OCT Scan', date: '2024-01-14', status: 'In Progress' },
      { id: 3, patient: 'Bob Johnson', type: 'Fundus Photography', date: '2024-01-13', status: 'Pending' }
    ])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-100'
      case 'In Progress': return 'text-yellow-600 bg-yellow-100'
      case 'Pending': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Eye Tests</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tests.map((test) => (
                <tr key={test.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{test.patient}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(test.status)}`}>
                      {test.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-green-600 hover:text-green-900">Results</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default TestsContent