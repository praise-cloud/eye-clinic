

import React, { useState, useRef, useEffect } from 'react';

// Use window.electronAPI for all IPC calls
const electronAPI = window.electronAPI;

// Accept user context via props (fallback to mock if not provided)
const defaultCurrentUser = { id: 1, name: 'Dr. Smith', role: 'doctor' };
const defaultOtherUser = { id: 2, name: 'Assistant Jane', role: 'assistant' };


const MessagesContent = ({ currentUser = defaultCurrentUser, otherUser = defaultOtherUser }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [file, setFile] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notification, setNotification] = useState('');
  const chatEndRef = useRef(null);

  // Fetch messages from backend
  const fetchMessages = async (searchTerm = '') => {
    if (!electronAPI) return;
    setLoading(true);
    try {
      const res = await electronAPI.getMessages({ userId: currentUser.id, otherUserId: otherUser.id, search: searchTerm });
      if (res.success) {
        // Notification for new incoming messages
        if (messages.length > 0 && res.messages.length > messages.length) {
          const newMsgs = res.messages.filter(m => m.receiver_id === currentUser.id && m.status !== 'read');
          if (newMsgs.length > 0) {
            setNotification('New message received!');
            setTimeout(() => setNotification(''), 2000);
          }
        }
        setMessages(res.messages.reverse()); // Show oldest first
        // Mark unread messages as read
        const unread = res.messages.filter(m => m.receiver_id === currentUser.id && m.status !== 'read');
        for (const msg of unread) {
          await electronAPI.markMessageRead({ messageId: msg.id, userId: currentUser.id });
        }
      }
    } catch (err) {
      // Handle error
    }
    setLoading(false);
    fetchUnreadCount();
  };
  // Delete a message
  const handleDelete = async (msgId) => {
    if (!electronAPI) return;
    try {
      const res = await electronAPI.deleteMessage({ messageId: msgId, userId: currentUser.id });
      if (res.success) {
        setMessages((msgs) => msgs.filter((m) => m.id !== msgId));
      }
    } catch (err) {
      // Handle error
    }
  };

  // Fetch unread count
  const fetchUnreadCount = async () => {
    if (!electronAPI) return;
    try {
      const res = await electronAPI.getUnreadCount(currentUser.id);
      if (res.success) setUnreadCount(res.count);
    } catch {}
  };

  useEffect(() => {
    fetchMessages();
    // Optionally poll for new messages every few seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle file upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Send message (with optional file)
  const handleSend = async (e) => {
    e.preventDefault();
    if ((!input.trim() && !file) || !ipcRenderer) return;
    let attachment = null;
    if (file) {
      // Read file as base64
      const reader = new FileReader();
      reader.onload = async (ev) => {
        attachment = {
          name: file.name,
          type: file.type,
          data: ev.target.result
        };
        await sendMessage(attachment);
      };
      reader.readAsDataURL(file);
      setFile(null);
      setInput('');
      return;
    }
    await sendMessage();
    setInput('');
  };

  const sendMessage = async (attachment = null) => {
    try {
      const res = await electronAPI.sendMessage(currentUser.id, otherUser.id, input, attachment);
      if (res.success) {
        setMessages((msgs) => [...msgs, res.message]);
      }
    } catch (err) {
      // Handle error
    }
  };

  // Search messages
  const handleSearch = async (e) => {
    e.preventDefault();
    await fetchMessages(search);
  };

  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex">
        <div className="flex items-center gap-6 p-6 bg-white rounded-lg shadow mb-5 w-full">
          {/* Doctor avatar and status */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 font-bold text-lg">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </span>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" title="Online"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{currentUser.name}</span>
              <span className="text-xs text-green-500">Online</span>
              {unreadCount > 0 && (
                <span className="text-xs text-red-500">Unread: {unreadCount}</span>
              )}
            </div>
          </div>
          <span className="text-gray-300 text-2xl">|</span>
          {/* Assistant avatar and status */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-pink-100 text-pink-700 font-bold text-lg">
                {otherUser.name.split(' ').map(n => n[0]).join('')}
              </span>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white bg-green-400" title="Online"></span>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{otherUser.name}</span>
              <span className="text-xs text-green-500">Online</span>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <h2 className="text-xl font-semibold text-gray-900">Doctor & Assistant Chat</h2>
          </div>
        </div>
      </div>
      {/* Search bar */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 mb-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
        >
          Search
        </button>
      </form>
      <div className="flex-1 overflow-y-auto mb-4 px-2">
        {notification && (
          <div className="text-center text-green-600 font-semibold mb-2">{notification}</div>
        )}
        {loading ? (
          <div className="text-center text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-400">No messages yet.</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-2 ${msg.sender_id === currentUser.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg shadow text-sm relative ${
                  msg.sender_id === currentUser.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <span className="block font-bold mb-1">
                  {msg.sender_id === currentUser.id ? currentUser.name : otherUser.name}
                </span>
                <span>{msg.message_text}</span>
                {msg.attachment && (
                  <div className="mt-2">
                    <a
                      href={msg.attachment.data}
                      download={msg.attachment.name}
                      className="text-xs text-blue-500 underline"
                      target="_blank" rel="noopener noreferrer"
                    >
                      {msg.attachment.name}
                    </a>
                  </div>
                )}
                <span className="block text-xs text-right mt-1 opacity-70">
                  {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  {msg.status === 'unread' && msg.receiver_id === currentUser.id && (
                    <span className="ml-2 text-red-500">● Unread</span>
                  )}
                </span>
                {/* Delete button for own messages */}
                {msg.sender_id === currentUser.id && (
                  <button
                    onClick={() => handleDelete(msg.id)}
                    className="absolute top-1 right-1 text-xs text-red-400 hover:text-red-600"
                    title="Delete message"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))
        )}
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
        <input
          type="file"
          className="hidden"
          id="chat-file-upload"
          onChange={handleFileChange}
        />
        <label htmlFor="chat-file-upload" className="bg-gray-200 text-gray-700 px-3 py-2 rounded cursor-pointer hover:bg-gray-300 transition">
          📎
        </label>
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