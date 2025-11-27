import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../api/cart';
import { productsAPI } from '../api/products';
import './Shop.css';
import './Home.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();
  const [visibleCount, setVisibleCount] = useState(5);

  // Extract unique categories and types from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const types = ['all', ...new Set(products.map(p => p.type).filter(Boolean))];

  useEffect(() => {
    loadProducts();
  }, []);


  useEffect(() => {
    setVisibleCount(5);
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const loadProducts = async () => {
    try {
      const data = await productsAPI.getProducts();
      setProducts(data.results || data);
      setFilteredProducts(data.results || data);
    } catch (err) {
      setError('Failed to load products');
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortProducts = useCallback(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(product => product.type === selectedType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);
        case 'newest':
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategory, selectedType, sortBy]);

  useEffect(() => {
    filterAndSortProducts();
  }, [filterAndSortProducts]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('name-asc');
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-page">
      <h1>Our Products</h1>
      
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-sort-container">
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="category-filter">Category:</label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="type-filter">Type:</label>
            <select
              id="type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="filter-select"
            >
              {types.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sort-select">Sort By:</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>

          <button onClick={handleResetFilters} className="reset-btn">
            Reset Filters
          </button>
        </div>

        <div className="results-count">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-results">No products found matching your filters</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.slice(0, visibleCount).map(product => (
            <div key={product.id} className="product-gradient">
              <div className="product-media">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={(product.images && product.images[0]?.url) || '/images/blank_image.png'}
                    alt={product.name}
                    className="product-img"
                  />
                </Link>
              </div>
              <div className="product-info">
                <Link to={`/product/${product.id}`} className="product-title-link">
                  <h3>{product.name}</h3>
                </Link>
                <Link to={`/product/${product.id}`} className="product-price-link">
                  <p>${Number(product.price).toFixed(2)}</p>
                </Link>
                {product.discount_price && (
                  <p className="discount-price">${Number(product.discount_price).toFixed(2)}</p>
                )}
                <div className="card-actions">
                  <Link to={`/product/${product.id}`} className="view-btn">View Product</Link>
                  <button
                    type="button"
                    className="add-to-cart-btn"
                    onClick={async () => {
                      if (!isAuthenticated) {
                        window.location.href = '/login';
                        return;
                      }
                      try {
                        await cartAPI.addToCart(product.id, 1);
                      } catch (err) {
                        alert(err?.message || 'Failed to add to cart');
                      }
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {visibleCount < filteredProducts.length && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button
            type="button"
            className="show-more-btn"
            onClick={() => setVisibleCount(filteredProducts.length)}
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;