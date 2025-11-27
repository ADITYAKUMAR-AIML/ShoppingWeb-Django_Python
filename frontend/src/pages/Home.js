// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';
import { productsAPI } from '../api/products';
import { API_BASE } from '../api/config';
import { cartAPI } from '../api/cart';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.className = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.pointerEvents = 'none';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const pieces = Array.from({ length: 180 }).map(() => ({
      x: Math.random() * canvas.width,
      y: -Math.random() * 100,
      r: Math.random() * 6 + 2,
      c: `hsl(${Math.random()*360},80%,60%)`,
      s: Math.random() * 3 + 2
    }));
    let anim;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      pieces.forEach(p => {
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
        p.y += p.s;
        p.x += Math.sin(p.y/20);
      });
      anim = requestAnimationFrame(draw);
    };
    draw();
    const t = setTimeout(() => {
      cancelAnimationFrame(anim);
      canvas.remove();
    }, 2000);
    return () => { cancelAnimationFrame(anim); clearTimeout(t); canvas.remove(); };
  }, []);

  const visibleProducts = products.slice(0, 10);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productsAPI.getProducts();
        setProducts(data.results || data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSlideIndex((prev) => (prev + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const rootBase = API_BASE.replace('/api','');
  const placeholderAds = [
    `${rootBase}/static/images/big_sale.jpg`,
    `${rootBase}/static/images/hotSale.avif`,
    `${rootBase}/static/images/Anniv_sale.webp`,
    `${rootBase}/static/images/gemeni.png`,
    `${rootBase}/static/images/gemeni_2.png`
  ];

  return (
    <div className="home-container">
      {/* Sale Announcement Banner */}
      <div className="sale-banner">
        <div className="sale-text">
          🎉 MEGA SALE • UP TO 70% OFF • LIMITED TIME ONLY • MEGA SALE • UP TO 70% OFF • LIMITED TIME ONLY • MEGA SALE • UP TO 70% OFF • LIMITED TIME ONLY • MEGA SALE • UP TO 70% OFF • LIMITED TIME ONLY • 
        </div>
      </div>
      {/* Hero Section */}
      <section className="hero gradient-bg" style={{ paddingTop: '6px', paddingRight: '0px', paddingBottom: '0px', paddingLeft: '0px' }}>
        <div className="hero-slideshow">
          <img
            className={`hero-slide ${slideIndex === 0 ? 'active' : ''}`}
            src={`${API_BASE.replace('/api','')}/static/images/gemeni.png`}
            alt="Big Sale"
          />
          <img
            className={`hero-slide ${slideIndex === 1 ? 'active' : ''}`}
            src={`${API_BASE.replace('/api','')}/static/images/gemeni_2.png`}
            alt="Hot Sale"
          />
          <img
            className={`hero-slide ${slideIndex === 2 ? 'active' : ''}`}
            src={`${API_BASE.replace('/api','')}/static/images/Anniv_sale.webp`}
            alt="Anniversary Sale"
          />
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <Link to="/category/fashion" className="category">
          <div>👕 Fashion</div>
        </Link>
        <Link to="/category/electronics" className="category">
          <div>💻 Electronics</div>
        </Link>
        <Link to="/category/food" className="category">
          <div>🍔 Food</div>
        </Link>
        <Link to="/category/home" className="category">
          <div>🏠 Home</div>
        </Link>
        <Link to="/category/gaming" className="category">
          <div>🎮 Gaming</div>
        </Link>
      </section>


      {products.length > 0 && (
        <section className="featured-section">
          <h3 className="featured-title">Featured Picks</h3>
          <div className="featured-grid">
            {(products.slice(6, 12)).map((p, i) => (
              <Link key={p.id} to={`/product/${p.id}`} className="featured-card">
                <img src={(p.images && p.images[0]?.url) || placeholderAds[i % placeholderAds.length]} alt={p.name} />
                <div className="featured-info">
                  <div className="featured-name">{p.name}</div>
                  <div className="featured-price">${Number(p.price).toFixed(2)}</div>
                </div>
              </Link>
            ))}
            <Link to="/shop" className="featured-card" key="ad-1">
              <img src={placeholderAds[3]} alt="Ad" />
              <div className="featured-info">
                <div className="featured-name">Hot Deals</div>
                <div className="featured-price">Shop Now</div>
              </div>
            </Link>
            <Link to="/shop" className="featured-card" key="ad-2">
              <img src={placeholderAds[4]} alt="Ad" />
              <div className="featured-info">
                <div className="featured-name">New Arrivals</div>
                <div className="featured-price">Explore</div>
              </div>
            </Link>
          </div>
        </section>
      )}
      {products.length > 2 && (
        <section className="promo-banners">
          {products.slice(2,4).map((p, i) => (
            <Link key={p.id} to={`/product/${p.id}`} className="promo-banner">
              <img src={(p.images && p.images[0]?.url) || placeholderAds[(i+1) % placeholderAds.length]} alt={p.name} />
              <div className="promo-content">
                <div className="promo-heading">Special Offer</div>
                <div className="promo-sub">Limited time deal</div>
              </div>
            </Link>
          ))}
        </section>
      )}
      <section className="promo-banners">
        <Link to="/shop" className="promo-banner">
          <img src={placeholderAds[0]} alt="Ad" />
          <div className="promo-content">
            <div className="promo-heading">Mega Sale</div>
            <div className="promo-sub">Shop Now</div>
          </div>
        </Link>
        <Link to="/shop" className="promo-banner">
          <img src={placeholderAds[1]} alt="Ad" />
          <div className="promo-content">
            <div className="promo-heading">Limited Offer</div>
            <div className="promo-sub">Don't Miss</div>
          </div>
        </Link>
      </section>
      <section className="products-section">
        <h3>Popular items:</h3>
        <div className="products">
          {loading ? (
            <div>Loading...</div>
          ) : (
            visibleProducts.map((product) => (
              <div key={product.id} className="product">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={(product.images && product.images[0]?.url) || '/images/blank_image.png'}
                    alt={product.name}
                    className="product-img"
                  />
                </Link>
                <div className="product-info">
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
                        navigate('/login');
                        return;
                      }
                      if (typeof product.stock !== 'undefined') {
                        const available = Number(product.stock) || 0;
                        if (available <= 0) {
                          alert('This product is out of stock');
                          return;
                        }
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
            ))
          )}
        </div>

      </section>

    </div>
  );
};

export default Home;