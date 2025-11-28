import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../api/products';
import { ordersAPI } from '../api/orders';
import './Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const loadAll = async () => {
      try {
        const [p, o, c] = await Promise.all([
          productsAPI.getProducts().catch(() => []),
          ordersAPI.getOrders().catch(() => []),
          productsAPI.getCategories().catch(() => []),
        ]);
        setProducts(p.results || p);
        setOrders(o.results || o);
        setCategories(c.results || c);
      } catch (err) {
        setError('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, [isAuthenticated, navigate]);

  const filterText = (text) => (text || '').toString().toLowerCase();
  const matchesQuery = (values) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return values.some((v) => filterText(v).includes(q));
  };

  const filteredProducts = products.filter((p) =>
    matchesQuery([p.id, p.name, p.category, p.description, p.price, p.stock])
  );
  const filteredOrders = orders.filter((o) =>
    matchesQuery([o.id, o.status, o.total_amount, o.created_at, o.user?.email, o.user?.username])
  );
  const filteredCategories = categories.filter((c) =>
    matchesQuery([c.slug || c.key, c.name])
  );

  if (loading) return <div className="admin-page"><div className="loading">Loading admin data...</div></div>;
  if (error) return <div className="admin-page"><div className="error">{error}</div></div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>
      <div className="admin-controls">
        <div className="tabs">
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Products</button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Orders</button>
          <button className={activeTab === 'categories' ? 'active' : ''} onClick={() => setActiveTab('categories')}>Categories</button>
        </div>
        <input
          type="text"
          placeholder="Search across visible table"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {activeTab === 'products' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Available</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.name}</td>
                  <td>{p.category || p.category_slug || '-'}</td>
                  <td>{typeof p.price !== 'undefined' ? Number(p.price).toFixed(2) : '-'}</td>
                  <td>{typeof p.stock !== 'undefined' ? p.stock : '-'}</td>
                  <td>{p.available ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Status</th>
                <th>Total</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.user?.email || o.user?.username || '-'}</td>
                  <td>{o.status || '-'}</td>
                  <td>{typeof o.total_amount !== 'undefined' ? Number(o.total_amount).toFixed(2) : '-'}</td>
                  <td>{o.created_at || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Slug</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((c) => (
                <tr key={c.slug || c.key || c.name}>
                  <td>{c.slug || c.key || '-'}</td>
                  <td>{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;