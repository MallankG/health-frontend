// src/Chat.jsx
import React, { useEffect, useState, useRef } from 'react';
import socket from './socket';
import api from './api';
import DashboardLayout from './DashboardLayout';

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
      <div className="container-fluid">
        <div className="row mb-4">
          <div className="col-12 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <h2 className="fw-bold mb-0"><i className="bi bi-chat-dots me-2 text-primary"></i>Chat</h2>
            <form onSubmit={handleSend} className="d-flex flex-wrap gap-2 align-items-center" style={{maxWidth: 600}}>
              <div style={{ position: 'relative', width: 200 }}>
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
              <input type="text" placeholder="Message" className="form-control" value={message} onChange={e => setMessage(e.target.value)} />
              <button type="submit" className="btn btn-primary"><i className="bi bi-send me-1"></i>Send</button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 8, padding: 12, background: '#fff' }}>
              {messages.length === 0 && <div className="text-center text-muted">No messages yet. Start a conversation!</div>}
              {messages.map((msg, i) => (
                <div key={i} className={msg.sender === user.id ? 'text-end' : 'text-start'}>
                  <span className={msg.sender === user.id ? 'badge bg-primary' : 'badge bg-secondary'}>
                    <i className={msg.sender === user.id ? 'bi bi-person-fill' : 'bi bi-person'}></i> {msg.sender === user.id ? 'You' : msg.sender}
                  </span>
                  <span className="ms-2">{msg.message}</span>
                  <div style={{ fontSize: 10 }}>{new Date(msg.sentAt).toLocaleString()}</div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
