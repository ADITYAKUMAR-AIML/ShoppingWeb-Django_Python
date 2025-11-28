import { API_BASE } from './config';

class APIClient {
  constructor() {
    this.baseURL = API_BASE;
  }

  async request(url, options = {}) {
    const token = localStorage.getItem('access');
    
    const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
    const headers = {
      ...options.headers,
    };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    let response = await fetch(`${this.baseURL}${url}`, config);

    // If token expired, try to refresh
    if (response.status === 401 && token) {
      try {
        const refreshed = await this.refreshToken();
        if (refreshed) {
          // Retry original request with new token
          config.headers['Authorization'] = `Bearer ${localStorage.getItem('access')}`;
          response = await fetch(`${this.baseURL}${url}`, config);
        }
      } catch (error) {
        // Refresh failed, redirect to login
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
        throw error;
      }
    }

    if (!response.ok) {
      let detail = '';
      try {
        const data = await response.json();
        if (data && typeof data === 'object') {
          detail = data.detail || data.error || JSON.stringify(data);
        }
      } catch (e) {
        // no-op
      }
      throw new Error(detail || `API error: ${response.status}`);
    }

    return response;
  }

  async refreshToken() {
    try {
      const refresh = localStorage.getItem('refresh');
      if (!refresh) return false;

      const response = await fetch(`${this.baseURL}/auth/token/refresh/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      });

      if (!response.ok) {
        throw new Error('Refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('access', data.access);
      return true;
    } catch (error) {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      throw error;
    }
  }

  async get(url) {
    const response = await this.request(url);
    return await response.json();
  }

  async post(url, data) {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const response = await this.request(url, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
    return await response.json();
  }

  async put(url, data) {
    const response = await this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return await response.json();
  }

  async delete(url) {
    const response = await this.request(url, {
      method: 'DELETE',
    });
    return response.status === 204 ? null : await response.json();
  }
}

export const apiClient = new APIClient();