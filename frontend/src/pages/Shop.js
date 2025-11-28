import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { cartAPI } from '../api/cart';
import { productsAPI } from '../api/products';
import { useToast } from '../context/ToastContext';
import './Shop.css';
import './Home.css';
import '../styles/ProductCard.css';

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
  const { showToast } = useToast();
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  // Extract unique categories and types from products
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const types = ['all', ...new Set(products.map(p => p.type).filter(Boolean))];

  useEffect(() => {
    loadProducts();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Debug log
  console.log('Pagination Debug:', {
    totalProducts: filteredProducts.length,
    totalPages,
    currentPage,
    productsPerPage,
    indexOfFirstProduct,
    indexOfLastProduct,
    currentProductsCount: currentProducts.length
  });

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate range around current page
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);
      
      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push('...');
      }
      
      // Add pages around current page
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="loading">Loading products...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1>
          <svg 
            className="shop-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          Our Products
        </h1>
      </div>
      
      <div className="search-bar">
        <div className="search-wrapper">
          <svg 
            className="search-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
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
              type="button"
              className="clear-search"
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
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
          Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="no-results">No products found matching your filters</p>
      ) : (
        <>
          <div className="products-grid">
            {currentProducts.map(product => (
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
                  <div className="product-content">
                    <Link to={`/product/${product.id}`} className="product-title-link">
                      <h3>{product.name}</h3>
                    </Link>
                    <Link to={`/product/${product.id}`} className="product-price-link">
                      <p>${Number(product.price).toFixed(2)}</p>
                    </Link>
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
                          if (typeof product.stock !== 'undefined') {
                            const available = Number(product.stock) || 0;
                            if (available <= 0) {
                              showToast('Out of stock', 'error');
                              return;
                            }
                          }
                          try {
                            await cartAPI.addToCart(product.id, 1);
                            showToast('Item added in cart', 'success');
                          } catch (err) {
                            const message = err?.response?.data?.detail || err?.message || 'Failed to add to cart';
                            const isStockIssue = /stock/i.test(message || '');
                            showToast(isStockIssue ? 'Out of stock' : message, 'error');
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                type="button"
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &laquo; Previous
              </button>

              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              ))}

              <button
                type="button"
                className="pagination-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;