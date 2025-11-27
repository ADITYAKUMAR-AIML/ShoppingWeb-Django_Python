import { apiClient } from './fetcher';

export const productsAPI = {
  // Get all products with optional filters
  getProducts(filters = {}) {
    const params = new URLSearchParams();
    Object.keys(filters).forEach(key => {
      if (filters[key]) params.append(key, filters[key]);
    });
    
    const queryString = params.toString();
    const url = `/products/${queryString ? `?${queryString}` : ''}`;
    return apiClient.get(url);
  },

  // Get single product
  getProduct(id) {
    return apiClient.get(`/products/${id}/`);
  },

  // Get categories
  getCategories() {
    return apiClient.get('/categories/');
  },

  // Get products by category
  getProductsByCategory(categorySlug) {
    return apiClient.get(`/products/?category=${categorySlug}`);
  },

  // Search products
  searchProducts(query) {
    return apiClient.get(`/products/?search=${encodeURIComponent(query)}`);
  }
  ,
  // Create product with multiple images
  createProduct(data) {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    if (data.category_slug) {
      formData.append('category_slug', data.category_slug);
    } else if (data.category) {
      formData.append('category', data.category);
    }
    if (typeof data.stock !== 'undefined') {
      formData.append('stock', data.stock);
      const available = Number(data.stock) > 0;
      formData.append('available', available);
    }
    (data.images || []).forEach(file => formData.append('images', file));
    return apiClient.post('/products/', formData);
  }
};