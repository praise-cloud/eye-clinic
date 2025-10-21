
import React, { useState, useRef, useEffect } from 'react';

const mockUser = {
  doctor: { name: 'Dr. Smith', role: 'doctor' },
  assistant: { name: 'Assistant Jane', role: 'assistant' }
};

const initialMessages = [
  { id: 1, sender: 'doctor', text: 'Hello Jane, can you send me the latest patient report?', time: '09:00' },
  { id: 2, sender: 'assistant', text: 'Sure, Dr. Smith! I will upload it shortly.', time: '09:01' },
  { id: 3, sender: 'doctor', text: 'Thank you!', time: '09:02' }
];

const MessagesContent = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [currentUser, setCurrentUser] = useState(mockUser.doctor); // Replace with real user context
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((msgs) => [
      ...msgs,
      {
        id: msgs.length + 1,
        sender: currentUser.role,
        text: input,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor & Assistant Chat</h2>
      <div className="flex-1 overflow-y-auto mb-4 px-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex mb-2 ${msg.sender === currentUser.role ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm ${
                msg.sender === currentUser.role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <span className="block font-bold mb-1">
                {msg.sender === 'doctor' ? mockUser.doctor.name : mockUser.assistant.name}
              </span>
              <span>{msg.text}</span>
              <span className="block text-xs text-right mt-1 opacity-70">{msg.time}</span>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default MessagesContent;