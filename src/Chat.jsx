// src/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';
import api from './api';
import DashboardLayout from './DashboardLayout';
import './Chat.css';

export default function Chat() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [message, setMessage] = useState('');
  const [userOptions, setUserOptions] = useState([]);
  const messagesEndRef = useRef(null);

  // Fetch chat history (all messages sent or received by this user)
  const fetchMessages = async () => {
    try {
      const res = await api.get(`/chat?userId=${user.id}`);
      setMessages(res.data);
    } catch {
      // Do not show error to user
    }
  };

  useEffect(() => {
    socket.connect();
    fetchMessages();
    socket.on('chatMessage', (msg) => {
      if (msg.sender === user.id || msg.receiver === user.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => {
      socket.off('chatMessage');
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // User search for receiver
  const handleUserSearch = async (e) => {
    const q = e.target.value;
    setReceiverName(q);
    if (q.length < 2) {
      setUserOptions([]);
      return;
    }
    try {
      const res = await api.get(`/users/search?q=${encodeURIComponent(q)}`);
      setUserOptions(res.data.filter(u => u._id !== user.id));
    } catch {
      setUserOptions([]);
    }
  };

  const handleSelectUser = (u) => {
    setReceiver(u._id);
    setReceiverName(u.name);
    setUserOptions([]);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!receiver || !message) return;
    const msg = {
      sender: user.id,
      receiver,
      message,
      sentAt: new Date(),
    };
    socket.emit('chatMessage', msg);
    setMessage('');
  };

  return (
    <DashboardLayout>
      <div className="chat-wrapper">
        <div className="chat-header">
          <h2 className="fw-bold mb-0"><i className="bi bi-chat-dots me-2 text-primary"></i>Chat</h2>
        </div>
        <div className="chat-body">
          {messages.length === 0 && <div className="text-center text-muted">No messages yet. Start a conversation!</div>}
          {messages.map((msg, i) => (
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
        <form onSubmit={handleSend} className="chat-input-bar">
          <div className="chat-user-search">
            <input
              type="text"
              placeholder="Search name..."
              className="form-control"
              value={receiverName}
              onChange={handleUserSearch}
              autoComplete="off"
            />
            {userOptions.length > 0 && (
              <ul className="list-group position-absolute w-100" style={{ zIndex: 10, top: '100%' }}>
                {userOptions.map(u => (
                  <li
                    key={u._id}
                    className="list-group-item list-group-item-action"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectUser(u)}
                  >
                    {u.name} <span className="text-muted small">({u.email})</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <input
            type="text"
            placeholder="Message"
            className="form-control chat-message-input"
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button type="submit" className="btn btn-primary chat-send-btn">
            <i className="bi bi-send"></i>
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}
