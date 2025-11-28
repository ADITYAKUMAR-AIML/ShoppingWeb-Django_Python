import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../api/orders';
import './Orders.css'
const Orders = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const data = await ordersAPI.getOrders();
        setOrders(data.results || data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="orders-page" style={{ maxWidth: 900, margin: '20px auto', padding: 16 }}>
      <h1>Your Orders</h1>
      {(!orders || orders.length === 0) ? (
        <div className="empty-orders">No orders yet</div>
      ) : (
        <div className="orders-list" style={{ display: 'grid', gap: 12 }}>
          {orders.map(order => (
            <div key={order.id} className="order-card" style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>Order #{order.id}</div>
                <div>${Number(order.total_amount).toFixed(2)}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <div>Status: {order.status}</div>
                <div>{new Date(order.created_at).toLocaleString()}</div>
              </div>
              <div style={{ marginTop: 8 }}>
                {(order.items || []).map(it => (
                  <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{it.product.name} x {it.quantity}</span>
                    <span>${Number(it.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;