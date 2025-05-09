// src/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';
import api from './api';
import DashboardLayout from './DashboardLayout';
import './Chat.css';

export default function Chat() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [chatUsers, setChatUsers] = useState([]); // List of users to chat with
  const [selectedUser, setSelectedUser] = useState(null); // The user we are chatting with
  const [messages, setMessages] = useState([]); // Messages with selected user
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch all users we have chatted with (or can chat with)
  const fetchChatUsers = async () => {
    try {
      // Get all messages involving this user
      const res = await api.get(`/chat?userId=${user.id}`);
      // Extract unique user IDs (other than self)
      const userIds = Array.from(new Set(res.data.flatMap(m => [m.sender, m.receiver]).filter(id => id !== user.id)));
      // Fetch user details for these IDs
      if (userIds.length === 0) return setChatUsers([]);
      const usersRes = await api.get(`/users/search?q=`); // Get all users
      const users = usersRes.data.filter(u => userIds.includes(u._id));
      setChatUsers(users);
      // Optionally auto-select the first user
      if (!selectedUser && users.length > 0) setSelectedUser(users[0]);
    } catch {
      setChatUsers([]);
    }
  };

  // Fetch messages with selected user
  const fetchMessagesWith = async (otherUserId) => {
    try {
      const res = await api.get(`/chat?userId=${user.id}`);
      // Only messages between user and selectedUser
      setMessages(res.data.filter(m => (m.sender === user.id && m.receiver === otherUserId) || (m.sender === otherUserId && m.receiver === user.id)));
    } catch {
      setMessages([]);
    }
  };

  useEffect(() => {
    socket.connect();
    fetchChatUsers();
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (selectedUser) fetchMessagesWith(selectedUser._id);
    // eslint-disable-next-line
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Listen for new messages
  useEffect(() => {
    const handler = (msg) => {
      if (
        selectedUser &&
        ((msg.sender === user.id && msg.receiver === selectedUser._id) ||
         (msg.sender === selectedUser._id && msg.receiver === user.id))
      ) {
        setMessages((prev) => [...prev, msg]);
      }
      // If new chat partner, refresh chat user list
      fetchChatUsers();
    };
    socket.on('chatMessage', handler);
    return () => socket.off('chatMessage', handler);
    // eslint-disable-next-line
  }, [selectedUser]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!selectedUser || !message) return;
    const msg = {
      sender: user.id,
      receiver: selectedUser._id,
      message,
      sentAt: new Date(),
    };
    socket.emit('chatMessage', msg);
    setMessage('');
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', height: '70vh', background: '#ece5dd', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        {/* Sidebar with chat users */}
        <div style={{ width: 240, background: '#fff', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #eee', fontWeight: 600, fontSize: 18 }}>Chats</div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {chatUsers.length === 0 && <div className="text-muted text-center mt-4">No chats yet</div>}
            {chatUsers.map(u => (
              <div
                key={u._id}
                onClick={() => setSelectedUser(u)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  background: selectedUser && selectedUser._id === u._id ? '#e6f7ff' : 'transparent',
                  borderBottom: '1px solid #f0f0f0',
                  fontWeight: selectedUser && selectedUser._id === u._id ? 600 : 400
                }}
              >
                <span>{u.name}</span>
                <div className="small text-muted">{u.email}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, background: '#075e54', color: '#fff', borderBottom: '1px solid #ddd', minHeight: 56, display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 600, fontSize: 18 }}>{selectedUser ? selectedUser.name : 'Select a chat'}</span>
            {selectedUser && <span className="ms-2 small">({selectedUser.email})</span>}
          </div>
          <div className="chat-body" style={{ flex: 1, overflowY: 'auto', background: '#ece5dd', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!selectedUser && <div className="text-center text-muted mt-4">Select a user to start chatting</div>}
            {selectedUser && messages.length === 0 && <div className="text-center text-muted">No messages yet. Start a conversation!</div>}
            {selectedUser && messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-message ${msg.sender === user.id ? 'sent' : 'received'}`}
              >
                <div className="chat-bubble">
                  <span>{msg.message}</span>
                  <div className="chat-meta">{new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Input bar */}
          <form onSubmit={handleSend} className="chat-input-bar" style={{ background: '#f7f7f7', borderTop: '1px solid #ddd', padding: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              type="text"
              placeholder={selectedUser ? 'Type a message...' : 'Select a user to chat'}
              className="form-control chat-message-input"
              value={message}
              onChange={e => setMessage(e.target.value)}
              disabled={!selectedUser}
            />
            <button type="submit" className="btn btn-primary chat-send-btn" disabled={!selectedUser || !message}>
              <i className="bi bi-send"></i>
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
