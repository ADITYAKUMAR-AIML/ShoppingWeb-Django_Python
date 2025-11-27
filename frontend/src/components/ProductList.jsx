// frontend/src/components/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { productsAPI } from '../api/products';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getProducts();
      setProducts(data.results || data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <img src={(product.images && product.images[0]?.url) || '/images/blank_image.png'} alt={product.name} />
          <h3>{product.name}</h3>
          <p>${product.price}</p>
          <p>{product.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;