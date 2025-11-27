import { API_BASE } from './config';
import { apiClient } from './fetcher';

export const authAPI = {
  async login(email, password) {
    const res = await fetch(`${API_BASE}/auth/token/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.detail || 'Login failed';
      throw new Error(msg);
    }
    localStorage.setItem('access', data.access);
    localStorage.setItem('refresh', data.refresh);
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = typeof data === 'object' && Object.keys(data).length
        ? JSON.stringify(data)
        : 'Registration failed';
      throw new Error(msg);
    }
    return data;
  },

  async refreshToken() {
    const refresh = localStorage.getItem('refresh');
    if (!refresh) throw new Error('No refresh token');
    
    const res = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) throw new Error('Token refresh failed');
    return await res.json();
  },

  async getCurrentUser() {
    const data = await apiClient.get('/auth/user/');
    return data;
  },

  logout() {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
  }
};