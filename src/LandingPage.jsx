// src/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  // Trusted companies logos
  const trustedLogos = [
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png',
      alt: 'Google',
    },
    {
      src: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg',
      alt: 'Facebook',
    },
    
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="saas-hero position-relative px-4 py-5 text-center bg-primary text-white overflow-hidden">
        <div className="saas-hero-bg position-absolute top-0 start-0 w-100 h-100"></div>
        <div className="position-relative" style={{zIndex:2}}>
          {/* Only render logo if src is present */}
          <img className="d-block mx-auto mb-4 saas-hero-logo" src="src/assets/react.svg" alt="Logo" width="80" height="80" />
          <h1 className="display-4 fw-bold mb-3">Patient Health Management</h1>
          <p className="lead mb-4">A secure, modern SaaS platform to manage your health records, appointments, and connect with your doctor—all in one place.</p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mb-4">
            <Link to="/register" className="btn btn-light btn-lg px-4 gap-3 fw-bold shadow-sm">Get Started</Link>
            <Link to="/login" className="btn btn-outline-light btn-lg px-4 shadow-sm">Login</Link>
          </div>
          <div className="saas-trusted-bar bg-white rounded-pill d-inline-flex align-items-center px-4 py-2 shadow-sm mt-3">
            <span className="text-primary fw-semibold me-3">Trusted by:</span>
            {trustedLogos.map(logo => logo.src && (
              <img key={logo.alt} src={logo.src} alt={logo.alt} height="24" className="mx-2 opacity-75" />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5">
        <h2 className="text-center mb-5 fw-bold">Everything you need for modern healthcare</h2>
        <div className="row g-4">
          <div className="col-md-4">
            <div className="feature-icon bg-primary bg-gradient text-white rounded-4 mb-3 d-flex align-items-center justify-content-center saas-feature-icon">
              <i className="bi bi-file-earmark-medical fs-2"></i>
            </div>
            <h3 className="fs-4">Manage Reports</h3>
            <p>Upload, view, and organize your medical reports and diagnostics securely. Access your health history anytime, anywhere.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-info bg-gradient text-white rounded-4 mb-3 d-flex align-items-center justify-content-center saas-feature-icon">
              <i className="bi bi-calendar-check fs-2"></i>
            </div>
            <h3 className="fs-4">Book Appointments</h3>
            <p>Easily schedule, view, and manage appointments with your doctor. Get reminders and avoid waiting in queues.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-success bg-gradient text-white rounded-4 mb-3 d-flex align-items-center justify-content-center saas-feature-icon">
              <i className="bi bi-chat-dots fs-2"></i>
            </div>
            <h3 className="fs-4">Chat with Doctors</h3>
            <p>Message your healthcare provider directly for quick follow-ups, clarifications, and support—secure and real-time.</p>
          </div>
        </div>
        <div className="row g-4 mt-2">
          <div className="col-md-4">
            <div className="feature-icon bg-warning bg-gradient text-white rounded-4 mb-3 d-flex align-items-center justify-content-center saas-feature-icon">
              <i className="bi bi-bar-chart-line fs-2"></i>
            </div>
            <h3 className="fs-4">Track Health</h3>
            <p>Log your sleep, exercise, and vitals. Visualize trends and take charge of your well-being with actionable insights.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-danger bg-gradient text-white rounded-4 mb-3 d-flex align-items-center justify-content-center saas-feature-icon">
              <i className="bi bi-bell fs-2"></i>
            </div>
            <h3 className="fs-4">Get Notified</h3>
            <p>Receive instant notifications for new messages, appointment reminders, and report uploads—never miss an update.</p>
          </div>
          <div className="col-md-4">
            <div className="feature-icon bg-secondary bg-gradient text-white rounded-4 mb-3 d-flex align-items-center justify-content-center saas-feature-icon">
              <i className="bi bi-shield-lock fs-2"></i>
            </div>
            <h3 className="fs-4">Secure & Private</h3>
            <p>Your data is protected with robust security and privacy controls. Only you and your care team can access your records.</p>
          </div>
        </div>
        <div className="text-center mt-5">
          <Link to="/register" className="btn btn-primary btn-lg px-5 fw-bold shadow">Start Free Trial</Link>
        </div>
      </section>

      {/* Testimonial/Info Section */}
      <section className="bg-white py-5 border-top" style={{background: 'linear-gradient(135deg, #f8fafc 60%, #e0e7ff 100%)'}}>
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

      {/* How It Works Section */}
      <section className="bg-light py-5 border-top">
        <div className="container">
          <h2 className="text-center mb-5 fw-bold">How It Works</h2>
          <div className="row g-4 justify-content-center">
            <div className="col-md-4 text-center">
              <div className="saas-feature-icon bg-primary bg-gradient text-white rounded-4 mb-3 mx-auto"><i className="bi bi-person-plus fs-2"></i></div>
              <h4 className="fw-semibold">1. Create Your Account</h4>
              <p>Sign up in seconds and set up your secure health profile. All your data is encrypted and private.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="saas-feature-icon bg-info bg-gradient text-white rounded-4 mb-3 mx-auto"><i className="bi bi-cloud-arrow-up fs-2"></i></div>
              <h4 className="fw-semibold">2. Upload & Connect</h4>
              <p>Upload reports, log health data, and connect with your doctor for appointments and chat.</p>
            </div>
            <div className="col-md-4 text-center">
              <div className="saas-feature-icon bg-success bg-gradient text-white rounded-4 mb-3 mx-auto"><i className="bi bi-graph-up-arrow fs-2"></i></div>
              <h4 className="fw-semibold">3. Track & Improve</h4>
              <p>Monitor your health trends, receive reminders, and get the most from your care team.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container py-5" style={{background: 'linear-gradient(120deg, #f1f5f9 60%, #e0e7ff 100%)', borderRadius: '1.5rem', boxShadow: '0 4px 32px #2563eb11', marginTop: '2rem', marginBottom: '2rem'}}>
        <h2 className="text-center mb-5 fw-bold">Frequently Asked Questions</h2>
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="accordion" id="faqAccordion">              <div className="accordion-item mb-3 border rounded-3 shadow-sm">
                <h2 className="accordion-header" id="heading1">
                  <button 
                    className="accordion-button rounded-3" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse1" 
                    aria-expanded="true" 
                    aria-controls="collapse1"
                  >
                    Is my health data secure?
                  </button>
                </h2>
                <div 
                  id="collapse1" 
                  className="accordion-collapse collapse show" 
                  aria-labelledby="heading1"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    Yes! We use industry-standard encryption and privacy controls. Only you and your authorized care team can access your records.
                  </div>
                </div>
              </div>
                <div className="accordion-item mb-3 border rounded-3 shadow-sm">
                <h2 className="accordion-header" id="heading2">
                  <button 
                    className="accordion-button collapsed rounded-3" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse2" 
                    aria-expanded="false" 
                    aria-controls="collapse2"
                  >
                    Can I use this on my phone?
                  </button>
                </h2>
                <div 
                  id="collapse2" 
                  className="accordion-collapse collapse" 
                  aria-labelledby="heading2"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    The platform is optimized for web browsers on desktop and tablet. Mobile app support is coming soon!
                  </div>
                </div>
              </div>
                <div className="accordion-item mb-3 border rounded-3 shadow-sm">
                <h2 className="accordion-header" id="heading3">
                  <button 
                    className="accordion-button collapsed rounded-3" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#collapse3" 
                    aria-expanded="false" 
                    aria-controls="collapse3"
                  >
                    How much does it cost?
                  </button>
                </h2>
                <div 
                  id="collapse3" 
                  className="accordion-collapse collapse" 
                  aria-labelledby="heading3"
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    You can get started for free! Premium features for clinics and advanced analytics are available with a subscription.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-4 bg-white text-secondary text-center border-top mt-auto saas-footer">
        <div>&copy; {new Date().getFullYear()} Patient Health Management. All rights reserved.</div>
        <div className="small">For web browsers only. Not available as a mobile app.</div>
      </footer>
    </>
  );
}
