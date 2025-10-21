import React from 'react'

const DashboardContent = ({activeSection}) => {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [customDate, setCustomDate] = React.useState('');
  return (
    <div className="flex flex-col mx-auto justify-center w-full">
        <div className="space-y-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Total Patients</h3>
            <p className="text-3xl font-bold text-blue-600">1,234</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Tests Today</h3>
            <p className="text-3xl font-bold text-green-600">45</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Pending Report</h3>
            <p className="text-3xl font-bold text-yellow-600">12</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900">Messages</h3>
            <p className="text-3xl font-bold text-purple-600">8</p>
          </div>
        </div> */}
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

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span>New patient registered: John Doe</span>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span>Test completed: Visual Field Analysis</span>
              <span className="text-sm text-gray-500">4 hours ago</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span>Report generated for Patient #1234</span>
              <span className="text-sm text-gray-500">6 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default DashboardContent