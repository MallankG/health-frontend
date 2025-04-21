import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isAuthenticated, showSidebar = false, children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="container-fluid min-vh-100 bg-light d-flex flex-column">
      {/* Topbar */}
      <header className="navbar navbar-expand-lg navbar-light bg-white shadow-sm px-3">
        <Link to="/dashboard" className="navbar-brand fw-bold text-primary">Patient Health</Link>
        <div className="ms-auto d-flex align-items-center gap-3">
          {isAuthenticated && (
            <span className="fw-semibold text-secondary">{user?.name} ({user?.role})</span>
          )}
          {isAuthenticated && (
            <>
              <Link to="/notifications" className="btn btn-light border rounded-circle" title="Notifications"><i className="bi bi-bell"></i></Link>
              <Link to="/chat" className="btn btn-light border rounded-circle" title="Chat"><i className="bi bi-chat"></i></Link>
              <button onClick={handleLogout} className="btn btn-outline-danger ms-2">Logout</button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link className="btn btn-outline-primary me-2" to="/login">Login</Link>
              <Link className="btn btn-primary" to="/register">Register</Link>
            </>
          )}
        </div>
      </header>
      <div className="row flex-grow-1" style={{minHeight: 0}}>
        {showSidebar && isAuthenticated && (
          <nav className="col-md-3 col-lg-2 d-md-block bg-white sidebar shadow-sm p-0 pt-4 d-none d-md-block">
            <ul className="nav flex-column gap-2">
              <li className="nav-item"><Link to="/dashboard" className="nav-link"><i className="bi bi-house-door me-2"></i>Home</Link></li>
              <li className="nav-item"><Link to="/reports" className="nav-link"><i className="bi bi-file-earmark-medical me-2"></i>Reports</Link></li>
              <li className="nav-item"><Link to="/appointments" className="nav-link"><i className="bi bi-calendar-check me-2"></i>Appointments</Link></li>
              <li className="nav-item"><Link to="/healthlogs" className="nav-link"><i className="bi bi-bar-chart-line me-2"></i>Health Logs</Link></li>
              <li className="nav-item"><Link to="/vitals" className="nav-link"><i className="bi bi-heart-pulse me-2"></i>Vitals</Link></li>
              <li className="nav-item"><Link to="/chat" className="nav-link"><i className="bi bi-chat-dots me-2"></i>Chat</Link></li>
              <li className="nav-item"><Link to="/notifications" className="nav-link"><i className="bi bi-bell me-2"></i>Notifications</Link></li>
            </ul>
          </nav>
        )}
        <main className={showSidebar && isAuthenticated ? "col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4 flex-grow-1 overflow-auto" : "flex-grow-1 w-100"}>
          {children}
        </main>
      </div>
      <footer className="bg-white text-center text-secondary py-3 border-top small mt-auto">
        &copy; {new Date().getFullYear()} Patient Health Management
      </footer>
    </div>
  );
};

export default Navbar;
