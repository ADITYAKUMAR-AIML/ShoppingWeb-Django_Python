import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SoundProvider } from './context/SoundContext';
import Navbar from './components/Navbar';
import GlobalClickSound from './components/GlobalClickSound';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderSuccess from './pages/OrderSuccess';
import Category from './pages/Category';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import AddProduct from './pages/AddProduct';
import Settings from './pages/Settings';
import Admin from './pages/Admin';
import './App.css';
import './styles/theme.css';

function App() {
  return (
    <AuthProvider>
      <SoundProvider>
        <Router>
          <GlobalClickSound />
          <div className="App">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<Category />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/add-product" element={<AddProduct />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <div className="footer-top">
              <div className="footer-col">
                <div className="footer-title">ABOUT</div>
                <ul className="footer-list">
                  <li><Link to="/contact">Contact Us</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/careers">Careers</Link></li>
                  <li><Link to="/stories">shopEase Stories</Link></li>
                  <li><Link to="/press">Press</Link></li>
                  <li><Link to="/corporate">Corporate Information</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <div className="footer-title">GROUP COMPANIES</div>
                <ul className="footer-list">
                  <li><a href="#">Myntra</a></li>
                  <li><a href="#">Cleartrip</a></li>
                  <li><a href="#">Shopsy</a></li>
                </ul>
              </div>
              <div className="footer-col">
                <div className="footer-title">HELP</div>
                <ul className="footer-list">
                  <li><Link to="/payments">Payments</Link></li>
                  <li><Link to="/shipping">Shipping</Link></li>
                  <li><Link to="/returns">Cancellation & Returns</Link></li>
                  <li><Link to="/faq">FAQ</Link></li>
                </ul>
              </div>
              <div className="footer-col">
                <div className="footer-title">CONSUMER POLICY</div>
                <ul className="footer-list">
                  <li><Link to="/returns">Cancellation & Returns</Link></li>
                  <li><Link to="/terms">Terms Of Use</Link></li>
                  <li><Link to="/security">Security</Link></li>
                  <li><Link to="/privacy">Privacy</Link></li>
                  <li><Link to="/sitemap">Sitemap</Link></li>
                  <li><Link to="/grievance">Grievance Redressal</Link></li>
                  <li><Link to="/epr">EPR Compliance</Link></li>
                  <li><Link to="/app">App</Link></li>
                </ul>
              </div>
              <div className="footer-col footer-col-wide">
                <div className="footer-mail">
                  <div className="footer-title">Mail Us:</div>
                  <address>
                    ShopEase Pvt Ltd,<br />
                    Commerce Park, Sector 21,<br />
                    Bengaluru, 560103,<br />
                    Karnataka, India
                  </address>
                </div>
                <div className="footer-office">
                  <div className="footer-title">Registered Office Address:</div>
                  <address>
                    ShopEase Pvt Ltd,<br />
                    Commerce Park, Sector 21,<br />
                    Bengaluru, 560103,<br />
                    Karnataka, India
                  </address>
                </div>
                <div className="footer-social">
                  <span>Social:</span>
                  <div className="social-icons">
                    <a href="#" aria-label="Facebook" className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 4.99 3.66 9.13 8.44 9.94v-7.03H8.08v-2.91h2.36V9.41c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.3h-1.18c-1.17 0-1.54.73-1.54 1.48v1.78h2.63l-.42 2.91h-2.21v7.03C18.34 21.19 22 17.05 22 12.06z"/></svg>
                    </a>
                    <a href="#" aria-label="X" className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 3H22l-7.7 8.8L22.7 21h-3.2l-6-6.9-6.7 7.9H1l8.4-9.8L1.3 3h3.3l5.3 6.1z"/></svg>
                    </a>
                    <a href="#" aria-label="YouTube" className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3.1 3.1 0 0 0-2.2-2.2C19.4 3.5 12 3.5 12 3.5s-7.4 0-9.3.5A3.1 3.1 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3.1 3.1 0 0 0 2.2 2.2c1.9.5 9.3.5 9.3.5s7.4 0 9.3-.5a3.1 3.1 0 0 0 2.2-2.2c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.4V8.6L15.8 12z"/></svg>
                    </a>
                    <a href="#" aria-label="Instagram" className="icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.4.4.6.2 1 .4 1.4.8.4.4.6.8.8 1.4.2.5.3 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.4-.2.6-.4 1-.8 1.4-.4.4-.8.6-1.4.8-.5.2-1.2.3-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.4-.4-.6-.2-1-.4-1.4-.8-.4-.4-.6-.8-.8-1.4-.2-.5-.3-1.2-.4-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.4.2-.6.4-1 .8-1.4.4-.4.8-.6 1.4-.8.5-.2 1.2-.3 2.4-.4C8.4 2.2 8.8 2.2 12 2.2zm0 3.1a6.7 6.7 0 1 0 0 13.4 6.7 6.7 0 0 0 0-13.4zm6.8-1.6a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer-separator" />
            <div className="footer-bottom">
              <div className="footer-actions">
                <a href="#" className="footer-action"><span className="emoji">🏪</span> Become a Seller</a>
                <a href="#" className="footer-action"><span className="emoji">✴️</span> Advertise</a>
                <a href="#" className="footer-action"><span className="emoji">🎁</span> Gift Cards</a>
                <a href="#" className="footer-action"><span className="emoji">🛠️</span> Help Center</a>
              </div>
              <div className="footer-copy">© 2007-2025 FashionCompras.com</div>
              <div className="footer-payments">
                <span className="badge">VISA</span>
                <span className="badge">Mastercard</span>
                <span className="badge">Amex</span>
                <span className="badge">RuPay</span>
                <span className="badge">NetBanking</span>
                <span className="badge">Cash on Delivery</span>
                <span className="badge">EMI</span>
              </div>
            </div>
          </footer>
        </div>
        </Router>
      </SoundProvider>
    </AuthProvider>
  );
}

export default App;