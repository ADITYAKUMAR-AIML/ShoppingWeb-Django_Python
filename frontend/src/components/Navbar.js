import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const displayName = (user?.email || user?.username || 'User').split('@')[0];

  return (
    <nav className="navbar">
      <div className="nav-brand size-5xl">
        <Link to="/" className="gradient-text">ShopEase</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="gradient-text">Home</Link>
        <Link to="/shop" className="gradient-text">Shop</Link>
        <Link to="/cart" className="gradient-text">Cart</Link>
        <Link to="/settings" className="gradient-text">Settings</Link>
        {isAuthenticated && (
          <Link to="/add-product" className="gradient-text">Add Product</Link>
        )}
        {isAuthenticated && (
          <Link to="/admin" className="gradient-text">Admin</Link>
        )}
        
        {isAuthenticated ? (
          <div className="nav-auth">
            <button
              className="hello-btn"
              onClick={() => setOpen(true)}
              style={{ background: 'transparent', border: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>Hello, {displayName}</span>
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
              </svg>
            </button>
            <button onClick={logout} className="logout-btn">Logout</button>
          </div>
        ) : (
          <div className="nav-auth">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>
        )}
      </div>

      {isAuthenticated && (
        <>
          {open && (
            <div
              className="overlay"
              onClick={() => setOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)' }}
            />
          )}
          <div
            className="sidebar"
            style={{
              position: 'fixed',
              top: 0,
              right: open ? 0 : -280,
              width: 280,
              height: '100vh',
              background: '#fff',
              boxShadow: '0 0 20px rgba(0,0,0,0.15)',
              transition: 'right 240ms ease',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ padding: 16, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 600 }}>Hello, {displayName}</div>
              <button onClick={() => setOpen(false)} className="sidebar-close-btn">✕</button>
            </div>
            <div style={{ padding: 12, display: 'grid', gap: 8 }}>
              <button
                onClick={() => { setOpen(false); navigate('/orders'); }}
                style={{ textAlign: 'left', padding: '12px 10px', borderRadius: 8, border: '1px solid #eee', background: '#f9fafb'}}
              >
                <span style={{
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #E63946 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>Orders</span>
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/settings'); }}
                style={{ textAlign: 'left', padding: '12px 10px', borderRadius: 8, border: '1px solid #eee', background: '#f9fafb'}}
              >
                <span style={{
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #E63946 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>Settings</span>
              </button>
              <button
                onClick={() => { setOpen(false); navigate('/admin'); }}
                style={{ textAlign: 'left', padding: '12px 10px', borderRadius: 8, border: '1px solid #eee', background: '#f9fafb'}}
              >
                <span style={{
                  background: 'linear-gradient(135deg, #FF8C42 0%, #FF6B35 50%, #E63946 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  color: 'transparent'
                }}>Admin</span>
              </button>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
