import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../api/products';
import { cartAPI } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await productsAPI.getProduct(id);
      setProduct(data);
    } catch (err) {
      setError('Product not found');
      console.error('Error loading product:', err);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await cartAPI.addToCart(product.id, quantity);
      alert('Product added to cart!');
    } catch (err) {
      alert('Failed to add product to cart');
      console.error('Error adding to cart:', err);
    }
  };

  if (loading) return <div className="loading">Loading product...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return <div className="error">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="product-images">
        <img 
          src={(product.images && product.images[0]?.url) || '/placeholder-image.jpg'} 
          alt={product.name}
        />
      </div>
      
      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="description">{product.description}</p>
        
        <div className="pricing">
          <span className="price">${product.price}</span>
          {product.discount_price && (
            <span className="discount-price">${product.discount_price}</span>
          )}
        </div>
        
        <div className="quantity-selector">
          <label>Quantity:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>
        
        <button onClick={addToCart} className="add-to-cart-btn">
          Add to Cart
        </button>
        
        <div className="product-meta">
          <p><strong>Category:</strong> {product.category_name || 'Uncategorized'}</p>
          <p><strong>Stock:</strong> {product.stock || 'Available'}</p>
        </div>
        {product.images && product.images.length > 1 && (
          <div className="image-thumbs">
            {product.images.slice(1).map(img => (
              <img key={img.id} src={img.url} alt={product.name} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;