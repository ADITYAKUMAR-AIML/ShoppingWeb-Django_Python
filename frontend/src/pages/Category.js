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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const getPages = (total, current) => {
    if (total <= 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 3) {
      return [1, 2, 3, '…', total];
    }
    if (current >= total - 2) {
      return [1, '…', total - 2, total - 1, total];
    }
    return [1, '…', current - 1, current, current + 1, '…', total];
  };
  const pages = getPages(totalPages, currentPage);

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
      setCurrentPage(1);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
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
        <div>
          <div className="products-grid">
          {filteredProducts
            .slice((currentPage - 1) * pageSize, (currentPage - 1) * pageSize + pageSize)
            .map(product => (
            <div key={product.id} className="product-card">
              <img 
                src={(product.images && product.images[0]?.url) || '/placeholder-image.jpg'} 
                alt={product.name}
              />
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
          ))}
          </div>
          <div className="pagination">
            <button
              className="page-btn prev"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              ‹ Previous
            </button>
            {pages.map((p, idx) => (
              typeof p === 'number' ? (
                <button
                  key={`p-${p}`}
                  className={`page-btn number ${currentPage === p ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ) : (
                <span key={`e-${idx}`} className="ellipsis">{p}</span>
              )
            ))}
            <button
              className="page-btn next"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              Next ›
            </button>
            <select
              className="page-size-select"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;