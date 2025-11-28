import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cartAPI } from '../api/cart';
import { ordersAPI } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [recentItems, setRecentItems] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
      loadRecentPurchases();
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      const data = await cartAPI.getCart();
      setCart(data);
    } catch (err) {
      setError('Failed to load cart');
      console.error('Error loading cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      await cartAPI.updateCartItem(productId, newQuantity);
      loadCart(); // Reload cart
    } catch (err) {
      alert('Failed to update cart');
      console.error('Error updating cart:', err);
    }
  };

  const loadRecentPurchases = async () => {
    try {
      const data = await ordersAPI.getOrders();
      const orders = data.results || data || [];
      const items = [];
      for (const o of orders) {
        const createdAt = o.created_at;
        const orderItems = o.items || [];
        for (const it of orderItems) {
          if (it && it.product) {
            items.push({ product: it.product, created_at: createdAt });
          }
        }
      }
      items.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      const seen = new Set();
      const unique = [];
      for (const it of items) {
        const pid = it.product.id || it.product.pk || it.product.slug || JSON.stringify(it.product);
        if (!seen.has(pid)) {
          seen.add(pid);
          unique.push(it.product);
        }
        if (unique.length >= 8) break;
      }
      setRecentItems(unique);
    } catch (e) {
      console.error('Failed to load recent purchases:', e);
    }
  };

  const removeItem = async (productId) => {
    try {
      await cartAPI.removeFromCart(productId);
      loadCart(); // Reload cart
    } catch (err) {
      alert('Failed to remove item');
      console.error('Error removing item:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        <div className="login-prompt">
          <p>Please log in to view your cart.</p>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </div>
    );
  }

  if (loading) return <div className="loading">Loading cart...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="cart-page">
      <h1>Shopping Cart</h1>
      
      {!cart || !cart.items || cart.items.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty..</p>
          <Link to="/shop" className="shop-btn">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.items.map(item => (
              <div key={item.id} className="cart-item">
                <img 
                  src={item.product.image || '/placeholder-image.jpg'} 
                  alt={item.product.name}
                />
                
                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="price">${item.product.price}</p>
                </div>
                
                <div className="quantity-controls">
                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>

                  <span className="qty-num">{item.quantity}</span>

                  <button 
                    className="qty-btn"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    +
                  </button>

                </div>
                
                <div className="item-total">
                  ${item.total_price}
                </div>
                
                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${cart.total}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$5.00</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>${cart.total + 5}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}

      {recentItems && recentItems.length > 0 && (
        <div className="recent-purchases">
          <h3>Recently Purchased</h3>
          <div className="recent-grid">
            {recentItems.map((p) => (
              <Link key={p.id || p.slug} to={`/product/${p.id || p.slug}`} className="recent-card">
                <img src={(p.images && p.images[0]?.url) || p.image || '/images/blank_image.png'} alt={p.name} />
                <div className="recent-info">
                  <div className="recent-name">{p.name}</div>
                  <div className="recent-price">${Number(p.price).toFixed(2)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;

