import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../api/cart';
import { ordersAPI } from '../api/orders';
import './Checkout.css'

const Checkout = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [shipping, setShipping] = useState('');
  const [payment, setPayment] = useState('card');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const load = async () => {
      try {
        const data = await cartAPI.getCart();
        setCart(data);
      } catch (err) {
        setError('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAuthenticated, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }
    setError('');
    setProcessing(true);
    try {
      await new Promise(res => setTimeout(res, 1200));
      const order = await ordersAPI.createOrder({
        shipping_address: shipping,
        payment_method: payment
      });
      navigate(`/order-success?orderId=${order.id}`);
    } catch (err) {
      setError(err?.message || 'Checkout failed');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="loading">Loading checkout...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="checkout-page" style={{ maxWidth: 800, margin: '20px auto', padding: 16 }}>
      <h1>Checkout</h1>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label>Shipping Address</label>
            <textarea value={shipping} onChange={(e) => setShipping(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Payment Method</label>
            <select value={payment} onChange={(e) => setPayment(e.target.value)}>
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          {payment === 'card' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <input placeholder="Card Number" required />
              <input placeholder="Name on Card" required />
              <input placeholder="MM/YY" required />
              <input placeholder="CVV" required />
            </div>
          )}
          {payment === 'upi' && (
            <div>
              <input placeholder="UPI ID" required />
            </div>
          )}
          <button type="submit" className="checkout-btn" disabled={processing}>
            {processing ? 'Processing...' : 'Pay Now'}
          </button>
        </form>
        <div className="order-summary">
          <h3>Order Summary</h3>
          <div>
            {(cart.items || []).map(it => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{it.product.name} x {it.quantity}</span>
                <span>${Number(it.total_price).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 8 }}>
              <span>Subtotal</span>
              <span>${Number(cart.total).toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Shipping</span>
              <span>$5.00</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>${(Number(cart.total) + 5).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;