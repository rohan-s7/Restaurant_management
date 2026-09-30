import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { demoCredentials } from '../../data/initialUserData';
import { LogIn, User, ChefHat, Shield, Lock, Mail, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('Please enter both email and password', 'warning');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password);
      addToast(`Welcome back, ${user.name}!`, 'success');

      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'STAFF') navigate('/staff');
      else navigate('/customer');
    } catch (err) {
      addToast('Invalid credentials. Please try again or use demo accounts.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick 1-click demo filler
  const handleFillDemo = async (roleKey) => {
    const creds = demoCredentials[roleKey];
    setEmail(creds.email);
    setPassword(creds.password);
    
    setLoading(true);
    const user = await login(creds.email, creds.password);
    addToast(`Logged in as ${user.role}: ${user.name}`, 'success');

    if (user.role === 'ADMIN') navigate('/admin');
    else if (user.role === 'STAFF') navigate('/staff');
    else navigate('/customer');
    setLoading(false);
  };

  return (
    <div style={{ padding: '4rem 0 6rem', backgroundColor: 'var(--color-bg-light)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: '520px' }}>
        <div className="card" style={{ padding: '2.5rem', boxShadow: 'var(--shadow-xl)' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: 'var(--color-primary-light)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}
            >
              <LogIn size={26} />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '0.4rem', color: 'var(--color-text-main)' }}>
              Sign In to RMS
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
              Access your customer account, kitchen portal, or admin panel
            </p>
          </div>

          {/* Demo Account Quick Switcher Helper Banner */}
          <div
            style={{
              background: 'var(--color-bg-subtle)',
              border: '1.5px dashed var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.75rem'
            }}
          >
            <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-primary)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              ⚡ 1-Click Demo Accounts (College Evaluation)
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <User size={14} color="var(--color-primary)" />
                <span>Customer</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('staff')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <ChefHat size={14} color="var(--color-primary)" />
                <span>Staff</span>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.4rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
              >
                <Shield size={14} color="var(--color-primary)" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="email"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast('For demo accounts, use customer123 / staff123 / admin123', 'info');
                  }}
                  style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
                <input
                  type="password"
                  className="form-control"
                  style={{ paddingLeft: '38px' }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: '0.5rem' }}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--color-border-light)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--color-primary)', fontWeight: 700 }}>
              Create Customer Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
