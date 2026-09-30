import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const ContactPage = () => {
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      addToast('Please complete all required fields', 'warning');
      return;
    }

    setIsSent(true);
    addToast('Thank you! Your message has been sent to our management.', 'success');
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <div style={{ padding: '3.5rem 0 5rem', backgroundColor: 'var(--color-bg-light)', minHeight: '80vh' }}>
      <div className="container">
        <div className="section-header" style={{ marginBottom: '3rem' }}>
          <span className="section-subtitle">Get In Touch</span>
          <h1 className="section-title" style={{ fontSize: '3rem' }}>Contact & Find Us</h1>
          <p className="section-description">
            Have a question about our menu, special catering, or private events? Reach out to our hospitality team.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          {/* Contact Form */}
          <div className="card" style={{ padding: '2.5rem' }}>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '1.5rem' }}>Send Us a Message</h3>

            {isSent ? (
              <div style={{ background: 'var(--color-success-bg)', padding: '2rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                <CheckCircle size={40} color="var(--color-success)" style={{ margin: '0 auto 1rem' }} />
                <h4 style={{ color: 'var(--color-success)', marginBottom: '0.5rem' }}>Message Received!</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                  Our hospitality manager will get back to you within 24 hours.
                </p>
                <button onClick={() => setIsSent(false)} className="btn btn-secondary btn-sm">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rahul@example.com"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Your Message *</label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="How can we assist your dining experience today?"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Send size={18} />
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Our Location</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  100 Feet Road, 12th Main, Indiranagar, Bengaluru, Karnataka 560038
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Phone & Reservations</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  +91 98765 00112 / +91 80 2525 9090
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Email Enquiries</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  contact@grandtable.com / events@grandtable.com
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: '1.75rem', display: 'flex', alignItems: 'flex-start', gap: '1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'var(--color-primary-light)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Clock size={24} />
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Dining Hours</h4>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
                  Monday - Sunday: 11:00 AM - 11:30 PM (Continuous Dining)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder Card */}
        <div className="card" style={{ padding: '2rem', textAlign: 'center', background: '#F5EFEB', border: '1px dashed var(--color-border)' }}>
          <MapPin size={36} color="var(--color-primary)" style={{ margin: '0 auto 0.75rem' }} />
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.35rem' }}>Interactive Location Map</h4>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
            Centrally located in Indiranagar, Bengaluru. Valet parking available on premises for all dining guests.
          </p>
          <div style={{ background: '#E3DBD1', height: '200px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.95rem' }}>
            📍 Bengaluru, Indiranagar • The Grand Table Landmark
          </div>
        </div>
      </div>
    </div>
  );
};
