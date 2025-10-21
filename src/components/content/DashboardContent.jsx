import React, { useState, useEffect } from 'react'
import { CLIENT_DATA } from '../../utils/constants'

const DashboardContent = ({activeSection}) => {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [customDate, setCustomDate] = React.useState('');
  // Use client data from constants
  const clients = [
    { name: 'Dr. Ammar', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ammar@gmail.com' },
    { name: 'Dr. Khan', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'khan@gmail.com' },
    { name: 'Dr. Abdullah', date: '24/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'abdullah@gmail.com' },
    { name: 'Dr. Alia', date: '13/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ali@gmail.com' },
    { name: 'Dr. Ammar', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ammar@gmail.com' },
    { name: 'Dr. Khan', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'khan@gmail.com' },
    { name: 'Dr. Abdullah', date: '24/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'abdullah@gmail.com' },
    { name: 'Dr. Alia', date: '13/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ali@gmail.com' },
    { name: 'Dr. Ammar', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ammar@gmail.com' },
    { name: 'Dr. Khan', date: '25/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'khan@gmail.com' },
    { name: 'Dr. Abdullah', date: '24/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'abdullah@gmail.com' },
    { name: 'Dr. Alia', date: '13/01/2024', case: 'Some pain in the eye ...', phone: '+0123456789', email: 'ali@gmail.com' },
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const totalPages = Math.ceil(clients.length / rowsPerPage);
  const paginatedClients = clients.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Reset to first page if rowsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [rowsPerPage]);

    const getStatusColor = (status) => {
      switch (status) {
        case 'Completed': return 'text-green-600 bg-green-100'
        case 'In Progress': return 'text-yellow-600 bg-yellow-100'
        case 'Pending': return 'text-red-600 bg-red-100'
        default: return 'text-gray-600 bg-gray-100'
      }
    }
  return(
    <div className="flex flex-col mx-auto justify-center w-full">
        <div className="space-y-6">
          <div className="flex my-4">
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
        </div>

        {/* Client table or empty message */}
        {clients.length > 0 ? (
          <div className="overflow-x-auto mt-4">

            <table className="min-w-full bg-white border border-gray-200 rounded-md divide-y divide-gray-200 ">
              <thead>
                <tr className="bg-gray-50 py-2">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Case</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Phone Number</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedClients.map((client, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="px-6 py-3 text-sm text-gray-800">{client.name}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{client.date}</td>
                    <td className="px-6 py-3 text-sm text-gray-800 truncate max-w-xs">{client.case}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{client.phone}</td>
                    <td className="px-6 py-3 text-sm text-gray-800">{client.email}</td>
                    <td className="px-6 py-3 text-sm flex gap-2">
                      <button className="text-red-500 hover:text-red-700" title="Delete"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                      <button className="text-green-500 hover:text-green-700" title="Edit"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1 0v14m-7-7h14" /></svg></button>
                      <button className="text-blue-500 hover:text-blue-700" title="View"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between mt-4">
                  {/* Rows per page selector */}
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
        ) : (
          <div className="flex flex-col items-center justify-center py-12">
            <span className="text-gray-400 text-lg font-semibold opacity-60">No Client Yet</span>
          </div>
        )}
      </div>
    </div>

  )
}

export default DashboardContent