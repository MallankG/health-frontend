// src/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="px-4 py-5 my-5 text-center bg-primary text-white">
        <img className="d-block mx-auto mb-4" src="/vite.svg" alt="Logo" width="72" height="72" />
        <h1 className="display-5 fw-bold">Patient Health Management</h1>
        <div className="col-lg-6 mx-auto">
          <p className="lead mb-4">A secure, modern web platform to manage your health records, appointments, and connect with your doctor—all in one place. For web browsers only.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
            <Link to="/register" className="btn btn-light btn-lg px-4 gap-3 fw-bold">Get Started</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4">Login</Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-icon bg-primary bg-gradient text-white rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <i className="bi bi-file-earmark-medical fs-2"></i>
            </div>
            <h3 className="fs-4">Manage Reports</h3>
            <p>Upload, view, and organize your medical reports and diagnostics securely. Access your health history anytime, anywhere.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-info bg-gradient text-white rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <i className="bi bi-calendar-check fs-2"></i>
            </div>
            <h3 className="fs-4">Book Appointments</h3>
            <p>Easily schedule, view, and manage appointments with your doctor. Get reminders and avoid waiting in queues.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-success bg-gradient text-white rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <i className="bi bi-chat-dots fs-2"></i>
            </div>
            <h3 className="fs-4">Chat with Doctors</h3>
            <p>Message your healthcare provider directly for quick follow-ups, clarifications, and support—secure and real-time.</p>
          </div>
        </div>
        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="feature-icon bg-warning bg-gradient text-white rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <i className="bi bi-bar-chart-line fs-2"></i>
            </div>
            <h3 className="fs-4">Track Health</h3>
            <p>Log your sleep, exercise, and vitals. Visualize trends and take charge of your well-being with actionable insights.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-danger bg-gradient text-white rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <i className="bi bi-bell fs-2"></i>
            </div>
            <h3 className="fs-4">Get Notified</h3>
            <p>Receive instant notifications for new messages, appointment reminders, and report uploads—never miss an update.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-secondary bg-gradient text-white rounded-3 mb-3 d-flex align-items-center justify-content-center" style={{width: 56, height: 56}}>
              <i className="bi bi-shield-lock fs-2"></i>
            </div>
            <h3 className="fs-4">Secure & Private</h3>
            <p>Your data is protected with robust security and privacy controls. Only you and your care team can access your records.</p>
          </div>
        </div>
      </section>

      {/* Testimonial/Info Section */}
      <section className="bg-white py-5 border-top">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8 text-center">
              <figure>
                <blockquote className="blockquote">
                  <p className="fs-4 fst-italic">“This platform has made managing my health so much easier. I can access my reports, book appointments, and chat with my doctor—all from my laptop!”</p>
                </blockquote>
                <figcaption className="blockquote-footer mt-2">
                  A real patient, <cite title="Source Title">April 2025</cite>
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-primary text-white text-center mt-auto">
        <div>&copy; {new Date().getFullYear()} Patient Health Management. All rights reserved.</div>
        <div className="small">For web browsers only. Not available as a mobile app.</div>
      </footer>
    </>
  );
}
