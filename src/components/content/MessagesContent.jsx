
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
    <div className="flex flex-col h-full  p-6">
        <div className="flex">
          <div className="flex items-center gap-6 p-6 bg-white rounded-lg shadow mb-5 w-full">
            {/* Doctor avatar and status */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                  {mockUser.doctor.name.split(' ').map(n => n[0]).join('')}
                </span>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" title="Online"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{mockUser.doctor.name}</span>
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>
            <span className="text-gray-300 text-2xl">|</span>
            {/* Assistant avatar and status */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-700 font-bold text-lg">
                  {mockUser.assistant.name.split(' ').map(n => n[0]).join('')}
                </span>
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" title="Online"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{mockUser.assistant.name}</span>
                <span className="text-xs text-green-500">Online</span>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <h2 className="text-xl font-semibold text-gray-900">Doctor & Assistant Chat</h2>
            </div>
          </div>
        </div>
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