import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Lottie from 'lottie-react';

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  useEffect(() => {
    const t = setTimeout(() => navigate('/orders'), 3000);
    return () => clearTimeout(t);
  }, [navigate]);

  // Lottie animation data will be fetched from the URL
  const [animationData, setAnimationData] = React.useState(null);

  useEffect(() => {
    fetch('https://lottie.host/72ec0d8f-a88c-4e20-b050-8653b305a8a5/g7LKryEfU5.lottie')
      .then(res => res.json())
      .then(data => setAnimationData(data))
      .catch(err => console.error('Failed to load animation:', err));
  }, []);

  return (
    <div className="success-page" style={{ maxWidth: 640, margin: '60px auto', textAlign: 'center', padding: '24px' }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'inline-block', position: 'relative' }} aria-hidden>
          <svg width="120" height="120" viewBox="0 0 120 120" role="img" aria-label="Order successful" style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>
            <defs>
              <linearGradient id="checkGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#34d399" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="60" r="54" fill="#ecfdf5" stroke="url(#checkGradient)" strokeWidth="4" />
            <path d="M40 62 L54 76 L82 48" fill="none" stroke="url(#checkGradient)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        {animationData && (
          <Lottie 
            animationData={animationData} 
            loop={true}
            autoplay={true}
            style={{ width: '200px', height: '200px', margin: '0 auto' }}
          />
        )}
      </div>
      <h1 style={{ fontSize: 32, marginBottom: 12, color: '#10b981' }}>Order Successful!</h1>
      <p style={{ fontSize: 18, marginBottom: 10, color: '#6b7280' }}>Your order has been placed successfully.</p>
      {orderId && <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 10 }}>Order #{orderId}</p>}
      <p style={{ fontSize: 14, color: '#9ca3af' }}>Redirecting to Orders in 3 seconds...</p>
    </div>
  );
};

export default OrderSuccess;
