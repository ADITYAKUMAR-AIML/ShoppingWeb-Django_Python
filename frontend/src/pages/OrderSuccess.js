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
    <div className="success-page" style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center', padding: '20px' }}>
      <div style={{ marginBottom: '30px' }}>
        {animationData && (
          <Lottie 
            animationData={animationData} 
            loop={true}
            autoplay={true}
            style={{ width: '300px', height: '300px', margin: '0 auto' }}
          />
        )}
      </div>
      <h1 style={{ fontSize: '32px', marginBottom: '16px', color: '#10b981' }}>Order Successful!</h1>
      <p style={{ fontSize: '18px', marginBottom: '12px', color: '#6b7280' }}>Your order has been placed successfully.</p>
      {orderId && <p style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>Order #{orderId}</p>}
      <p style={{ fontSize: '14px', color: '#9ca3af' }}>Redirecting to Orders in 3 seconds...</p>
    </div>
  );
};

export default OrderSuccess;