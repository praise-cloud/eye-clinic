import React, { useState, useRef, useEffect, useCallback } from 'react';
import ChatInputActions from './ChatInputActions';
import useUser from '../../hooks/useUser';

const electronAPI = window.electronAPI;

const MessagesContent = () => {
  const { user: currentUser } = useUser();
  const [otherUser, setOtherUser] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [attachedFile, setAttachedFile] = useState(null); // ← renamed to avoid confusion
  const [replyTo, setReplyTo] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const chatEndRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentUserName = currentUser
    ? (currentUser.name || `${currentUser.first_name || ''} ${currentUser.last_name || ''}`.trim() || 'Me')
    : 'Me';

  const otherUserName = otherUser
    ? (otherUser.name || `${otherUser.first_name || ''} ${otherUser.last_name || ''}`.trim() || 'Staff')
    : '';

  // Load users + unread badges
  useEffect(() => {
    if (!currentUser || !electronAPI) return;

    const load = async () => {
      try {
        const res = await electronAPI.getAllUsers();
        if (res?.success) {
          const others = res.users.filter(u => u.id !== currentUser.id);
          setAvailableUsers(others);

          // calculate unread count per user (using existing IPC methods only)
          const counts = {};
          for (const u of others) {
            const msgRes = await electronAPI.getMessages({
              userId: currentUser.id,
              otherUserId: u.id,
              limit: 50,
              offset: 0,
            });
            if (msgRes.success) {
              const unread = msgRes.messages.filter(
                m => m.receiver_id === currentUser.id && m.status !== 'read'
              ).length;
              if (unread > 0) counts[u.id] = unread;
            }
          }
          setUnreadCounts(counts);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [currentUser?.id]);

  // Presence
  useEffect(() => {
    if (!electronAPI) return;
    const off = electronAPI.onIpcEvent('presence-update', ids => {
      setOnlineUsers(ids.map(String));
    });
    return () => off && off();
  }, []);

  // Real-time messages
  useEffect(() => {
    if (!electronAPI || !currentUser) return;

    const handler = msg => {
      const inThisChat =
        (msg.sender_id === currentUser.id && msg.receiver_id === otherUser?.id) ||
        (msg.sender_id === otherUser?.id && msg.receiver_id === currentUser.id);

      if (inThisChat) {
        setMessages(prev => (prev.some(m => m.id === msg.id) ? prev : [...prev, msg]));
        if (msg.receiver_id === currentUser.id && msg.status !== 'read') {
          electronAPI.markMessageRead({ messageId: msg.id, userId: currentUser.id });
        }
      } else if (msg.receiver_id === currentUser.id) {
        setUnreadCounts(p => ({ ...p, [msg.sender_id]: (p[msg.sender_id] || 0) + 1 }));
      }
    };

    const off = electronAPI.onIpcEvent('new-message', handler);
    return () => off && off();
  }, [currentUser?.id, otherUser?.id]);

  // Load messages when chat selected
  const loadMessages = useCallback(async () => {
    if (!otherUser) {
      setMessages([]);
      return;
    }
    try {
      const res = await electronAPI.getMessages({
        userId: currentUser.id,
        otherUserId: otherUser.id,
        limit: 500,
        offset: 0,
      });
      if (res.success) {
        setMessages(res.messages.reverse());
        setUnreadCounts(p => ({ ...p, [otherUser.id]: 0 }));
        await electronAPI.markAllAsRead?.(currentUser.id, otherUser.id);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser?.id, otherUser?.id]);

  useEffect(() => { loadMessages(); }, [otherUser, loadMessages]);

  // Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async (attachment = null) => {
    if (!input.trim() && !attachment) return;

    const text = input.trim() || (attachment ? 'Photo' : '');
    const replyToId = replyTo?.id || null;

    try {
      const res = await electronAPI.sendMessage({
        senderId: currentUser.id,
        receiverId: otherUser.id,
        messageText: text,
        attachment: attachment ? JSON.stringify(attachment) : null,
        replyToId,
      });

      if (res.success) {
        setMessages(p => [...p, res.message]);
        setInput('');
        setReplyTo(null);
        setAttachedFile(null);
      }
    } catch (e) {
      alert('Message failed to send');
    }
  };

  // File / Image picker
  const handleFile = (e, isImage = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = ev => {
      const attachment = {
        name: file.name,
        type: file.type,
        data: ev.target.result,
      };

      if (isImage) {
        sendMessage(attachment);           // auto-send images
      } else {
        setAttachedFile(attachment);      // show preview for other files
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!currentUser) return <div className="p-8 text-center text-gray-500">Loading…</div>;

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Users sidebar */}
      <div className={`${otherUser ? 'hidden md:block w-80' : 'w-full md:w-80'} border-r border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800`}>
        <div className="p-4 border-b dark:border-gray-700">
          <h2 className="font-bold text-lg">Staff Chat</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Hi, {currentUserName}</p>
        </div>
        <div className="overflow-y-auto">
          {availableUsers.map(u => {
            const name = u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || 'Staff';
            const online = onlineUsers.includes(String(u.id));
            const unread = unreadCounts[u.id] || 0;

            return (
              <div
                key={u.id}
                onClick={() => setOtherUser(u)}
                className={`p-4 flex items-center justify-between cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${otherUser?.id === u.id ? 'bg-blue-50 dark:bg-gray-700' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {name.split(' ').map(c => c[0]).join('').toUpperCase()}
                    </div>
                    {online && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
                  </div>
                  <div>
                    <div className="font-medium">{name}</div>
                    <div className="text-xs text-gray-500">{u.role || 'staff'}</div>
                  </div>
                </div>
                {!!unread && <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">{unread}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      {otherUser ? (
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center gap-3">
            <button onClick={() => setOtherUser(null)} className="md:hidden mr-3">Back</button>
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex-center text-white font-bold">
                {otherUserName.split(' ').map(c => c[0]).join('').toUpperCase()}
              </div>
              {onlineUsers.includes(String(otherUser.id)) && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <div className="font-semibold">{otherUserName}</div>
              <div className="text-sm text-gray-500">
                {onlineUsers.includes(String(otherUser.id)) ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map(msg => {
              const mine = msg.sender_id === currentUser.id;
              const att = msg.attachment ? JSON.parse(msg.attachment) : null;
              return (
                <div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${mine ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                    {msg.message_text && msg.message_text !== 'Photo' && <p>{msg.message_text}</p>}
                    {att && (
                      att.type.startsWith('image/') ?
                        <img src={att.data} alt="" className="rounded max-w-full" /> :
                        <a href={att.data} download={att.name} className="text-blue-200 underline">{att.name}</a>
                    )}
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Reply preview */}
          {replyTo && (
            <div className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-sm flex justify-between">
              <span>Replying: {replyTo.message_text || 'Photo'}</span>
              <button onClick={() => setReplyTo(null)} className="text-red-600">×</button>
            </div>
          )}

          {/* Input */}
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="p-4 bg-white dark:bg-gray-800 border-t">
            {attachedFile && (
              <div className="mb-2 text-sm">
                Attached: {attachedFile.name}{' '}
                <button type="button" onClick={() => setAttachedFile(null)} className="text-red-600">Remove</button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 rounded-full border dark:border-gray-600 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              />
              <input type="file" ref={imageInputRef} onChange={e => handleFile(e, true)} accept="image/*" className="hidden" />
              <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" />
              <ChatInputActions
                onImageSelect={() => imageInputRef.current.click()}
                onFileSelect={() => fileInputRef.current.click()}
                onSend={() => sendMessage()}
                disabled={!input.trim() && !attachedFile}
              />
            </div>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <div className="text-6xl mb-4">Chat</div>
            <p>Select a staff member to start chatting</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesContent;