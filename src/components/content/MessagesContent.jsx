import React, { useState, useEffect } from 'react'

const MessagesContent = () => {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    // Mock data - replace with actual API call
    setMessages([
      { id: 1, from: 'Dr. Smith', subject: 'Patient consultation needed', date: '2024-01-15', read: false },
      { id: 2, from: 'Lab Results', subject: 'Test results available', date: '2024-01-14', read: true },
      { id: 3, from: 'Admin', subject: 'Schedule update', date: '2024-01-13', read: false }
    ])
  }, [])

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Messages</h2>
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`p-4 border rounded-lg ${message.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${message.read ? 'bg-gray-300' : 'bg-blue-500'}`}></div>
                  <div>
                    <p className="font-medium text-gray-900">{message.from}</p>
                    <p className="text-sm text-gray-600">{message.subject}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {message.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MessagesContent