import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { cartAPI } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fix: Wrap loadProduct in useCallback
  const loadProduct = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getProduct(id);
      setProduct(data);
      setError('');
    } catch (err) {
      setError('Product not found');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (product?.stock === 0) {
      showToast('Out of stock', 'error');
      return;
    }

    try {
      setAddingToCart(true);
      await cartAPI.addToCart(product.id, quantity);
      showToast('Item added in cart', 'success');
    } catch (err) {
      const message = err?.response?.data?.detail || err?.message || 'Failed to add product to cart';
      const isStockIssue = /stock/i.test(message || '');
      showToast(isStockIssue ? 'Out of stock' : message, 'error');
      console.error('Error adding to cart:', err);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value >= 1 && value <= 10) {
      setQuantity(value);
    }
  };

  const incrementQuantity = () => {
    if (quantity < 10) setQuantity(quantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>{error}</h2>
        <button onClick={() => navigate(-1)} className="back-btn">
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <div className="error-icon">🔍</div>
        <h2>Product not found</h2>
        <button onClick={() => navigate('/')} className="back-btn">
          Back to Shop
        </button>
      </div>
    );
  }

  const productImages = product.images && product.images.length > 0 
    ? product.images 
    : [{ id: 'placeholder', url: '/placeholder-image.jpg' }];

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Image Gallery Section */}
        <div className="product-gallery">
          <div className="main-image">
            <img 
              src={productImages[selectedImage]?.url || '/placeholder-image.jpg'} 
              alt={product.name}
            />
          </div>
          
          {productImages.length > 1 && (
            <div className="image-thumbnails">
              {productImages.map((img, index) => (
                <div 
                  key={img.id || index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img.url} alt={`${product.name} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info Section */}
        <div className="product-info-section">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            {product.category_name && (
              <span className="product-category">{product.category_name}</span>
            )}
          </div>

          {/* Pricing */}
          <div className="product-pricing">
            <span className="current-price">${product.price}</span>
            {product.discount_price && (
              <>
                <span className="original-price">${product.discount_price}</span>
                <span className="discount-badge">
                  {Math.round(((product.discount_price - product.price) / product.discount_price) * 100)}% OFF
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="product-description">
              <h3>Description</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* Stock Status */}
          <div className="stock-status">
            <span className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.stock > 0 ? '✓ In Stock' : '✗ Out of Stock'}
            </span>
          </div>

          {/* Quantity Selector */}
          <div className="quantity-section">
            <label className="quantity-label">Quantity:</label>
            <div className="quantity-controls">
              <button 
                className="qty-btn" 
                onClick={decrementQuantity}
                disabled={quantity <= 1}
              >
                −
              </button>
              <input
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={handleQuantityChange}
                className="quantity-input"
              />
              <button 
                className="qty-btn" 
                onClick={incrementQuantity}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="product-actions">
            <button 
              onClick={addToCart} 
              className="add-to-cart-button"
              disabled={addingToCart || product.stock === 0}
            >
              {addingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              onClick={() => navigate(-1)} 
              className="back-button"
            >
              ← Back
            </button>
          </div>

          {/* Product Meta */}
          <div className="product-meta">
            {product.type && (
              <div className="meta-item">
                <span className="meta-label">Type:</span>
                <span className="meta-value">{product.type}</span>
              </div>
            )}
            {product.stock && (
              <div className="meta-item">
                <span className="meta-label">Available:</span>
                <span className="meta-value">{product.stock} units</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;