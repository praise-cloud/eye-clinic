import React, { useState, useEffect } from 'react'

const TestsContent = () => {
  const [tests, setTests] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const totalPages = Math.ceil(tests.length / rowsPerPage);
  const paginatedTests = tests.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);
  const [selectedDate, setSelectedDate] = React.useState('');
  const [customDate, setCustomDate] = React.useState('');

  useEffect(() => {
    // Mock data - replace with actual API call
    setTests([
      { id: 1, patient: 'John Doe', type: 'Visual Field', date: '2024-01-15', status: 'Completed' },
      { id: 2, patient: 'Jane Smith', type: 'OCT Scan', date: '2024-01-14', status: 'In Progress' },
      { id: 3, patient: 'Bob Johnson', type: 'Fundus Photography', date: '2024-01-13', status: 'Pending' },
      { id: 4, patient: 'Bob Johnson', type: 'Fundus Photography', date: '2024-01-13', status: 'Pending' },
      { id: 5, patient: 'Bob Johnson', type: 'Fundus Photography', date: '2024-01-13', status: 'Pending' }
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
    <div className="">
      <div className="flex my-5">
        <div className="flex flex-col gap-4 bg-white w-full rounded-md shadow px-5 py-4">
          <div>
            <span className="text-xl font-semibold text-gray-600">Patient's of the day</span>
          </div>
          <div className="flex items-center gap-5 w-2/3">
            <input type="text" className="border border-gray-300 rounded-md p-3 w-full" placeholder="name of case or clients name..." />
            <div className="flex items-center gap-3">
              <div className="flex">
                <p>Filter</p>
              </div>
              {/* Date filter dropdown */}
              <div className="relative">
                <select
                  className="border border-gray-300 rounded-md p-2"
                  onChange={e => setSelectedDate(e.target.value)}
                  value={selectedDate || ''}
                >
                  <option value="">Date</option>
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="this_week">This Week</option>
                  <option value="this_month">This Month</option>
                  <option value="custom">Custom...</option>
                </select>
                {/* If custom, show date picker */}
                {selectedDate === 'custom' && (
                  <input
                    type="date"
                    className="absolute top-full left-0 mt-2 border border-gray-300 rounded-md p-2 bg-white z-10"
                    onChange={e => setCustomDate(e.target.value)}
                    value={customDate || ''}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Show selected date filter with close icon */}
          {selectedDate && selectedDate !== '' && (
            <div className="flex w-56 items-center justify-center gap-1 bg-blue-50 border border-blue-200 rounded px-2 py-1 text-sm">
              <span className="flex">
                {selectedDate === 'custom' && customDate ? customDate : selectedDate.replace('_', ' ')}
              </span>
              <button
                className="ml-1 text-blue-500 hover:text-blue-700"
                onClick={() => {
                  setSelectedDate('');
                  setCustomDate('');
                }}
                aria-label="Remove date filter"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
      <div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200 rounded-md">
            <thead className="bg-gray-50 py-5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Test Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTests.map((test) => (
                <tr key={test.id}>
                  <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{test.patient}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{test.type}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">{test.date}</td>
                  <td className="px-6 py-3 whitespace-nowrap">
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

          <div className="flex items-center justify-between mt-4">
            <div className="flex justify-end items-center mb-2 gap-2">
          <label htmlFor="rowsPerPage" className="text-sm text-gray-600">Rows per page:</label>
          <select
            id="rowsPerPage"
            className="border border-gray-300 rounded-md p-1 text-sm"
            value={rowsPerPage}
            onChange={e => setRowsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
            {/* Pagination controls */}
            <div className="flex justify-end items-center gap-2">
              <button
                className={`px-3 py-1 rounded border text-sm ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className={`px-3 py-1 rounded border text-sm ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div> 
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestsContent