import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsAPI } from '../api/products';
import './Shop.css';
import '../styles/ProductCard.css';

const Category = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [typeFilter, setTypeFilter] = useState('all');

  const headerIcon = (() => {
    if (slug === 'fashion') {
      return (
        <svg className="shop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4c0-1.1.9-2 2-2s2 .9 2 2-1 2-2 2h-1l-2 2" />
          <path d="M3 18l5-6h8l5 6" />
        </svg>
      );
    }
    if (slug === 'electronics') {
      return (
        <svg className="shop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
        </svg>
      );
    }
    if (slug === 'food') {
      return (
        <svg className="shop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 8c1-2 2-3 3-3" />
          <path d="M12 7c-4 0-7 3-7 7 0 3 2 7 7 7s7-4 7-7c0-4-3-7-7-7z" />
        </svg>
      );
    }
    if (slug === 'home') {
      return (
        <svg className="shop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 10l9-7 9 7" />
          <path d="M5 10v10h14V10" />
          <path d="M10 14h4v6" />
        </svg>
      );
    }
    if (slug === 'gaming') {
      return (
        <svg className="shop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="8" width="18" height="10" rx="3" />
          <path d="M8 13h4" />
          <path d="M10 11v4" />
          <circle cx="16" cy="13" r="1" />
          <circle cx="19" cy="13" r="1" />
        </svg>
      );
    }
    return (
      <svg className="shop-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    );
  })();

  // Get unique types from products
  const productTypes = [...new Set(products.map(p => p.type).filter(Boolean))];

  const loadProducts = useCallback(async () => {
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
  }, [slug]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    filterAndSortProducts();
  }, [searchQuery, products, sortBy, typeFilter]);

  const filterAndSortProducts = () => {
    let filtered = [...products];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
      );
    }

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(product => product.type === typeFilter);
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
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSortBy('name-asc');
    setTypeFilter('all');
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-page">
      {/* Header with Icon */}
      <div className="shop-header">
        <h1>
          {headerIcon}
          <span style={{ textTransform: 'capitalize' }}>{slug} Products</span>
        </h1>
      </div>

      {/* Enhanced Search Bar */}
      <div className="search-bar">
        <div className="search-wrapper">
          <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Search for products, categories, or brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              className="clear-search" 
              onClick={handleClearSearch}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Sort Container */}
      <div className="filter-sort-container">
        <div className="filters">
          {/* Type Filter */}
          {productTypes.length > 0 && (
            <div className="filter-group">
              <label htmlFor="type-filter">Type:</label>
              <select
                id="type-filter"
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">All Types</option>
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          )}

          {/* Sort By */}
          <div className="filter-group">
            <label htmlFor="sort-select">Sort By:</label>
            <select
              id="sort-select"
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          {/* Reset Button */}
          <button className="reset-btn" onClick={handleResetFilters}>
            Reset Filters
          </button>
        </div>

        {/* Results Count */}
        <div className="results-count">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <p className="no-results">
          {searchQuery ? `No products found matching "${searchQuery}"` : 'No products in this category'}
        </p>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div key={product.id} className="product-gradient">
              <div className="product-media">
                <img 
                  src={(product.images && product.images[0]?.url) || '/placeholder-image.jpg'} 
                  alt={product.name}
                />
              </div>
              <div className="product-info">
                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p className="price">${product.price}</p>
                  {product.discount_price && (
                    <p className="discount-price">${product.discount_price}</p>
                  )}
                  <div className="card-actions">
                    <Link to={`/product/${product.id}`} className="view-btn">
                      View Product
                    </Link>
                    <button className="add-to-cart-btn">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Category;