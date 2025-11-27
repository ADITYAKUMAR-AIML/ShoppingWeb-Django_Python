import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../api/products';
import './Shop.css';

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProducts();
  }, [slug]);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getProductsByCategory(slug);
      setProducts(data.results || data);
      setFilteredProducts(data.results || data);
    } catch (err) {
      setError('Failed to load category products');
      console.error('Category load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-page">
      <h1 style={{ textTransform: 'capitalize' }}>{slug} Products</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-results">
          {searchQuery ? `No products found matching "${searchQuery}"` : 'No products in this category'}
        </p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => {
            return (
              <div key={product.id} className="product-gradient">
                <div className="product-media">
                  <img 
                    src={(product.images && product.images[0]?.url) || '/placeholder-image.jpg'} 
                    alt={product.name}
                  />
                </div>
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  {product.discount_price && (
                    <p className="discount-price">${product.discount_price}</p>
                  )}
                  <Link to={`/product/${product.id}`} className="view-btn">
                    View Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Category;