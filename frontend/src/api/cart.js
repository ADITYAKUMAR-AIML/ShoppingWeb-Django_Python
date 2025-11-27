import { apiClient } from './fetcher';

export const cartAPI = {
  // Get cart
  getCart() {
    return apiClient.get('/cart/');
  },

  // Add item to cart
  addToCart(productId, quantity = 1) {
    return apiClient.post('/cart/add_item/', { product_id: productId, quantity });
  },

  // Update cart item quantity
  updateCartItem(productId, quantity) {
    return apiClient.post('/cart/update_item/', { product_id: productId, quantity });
  },

  // Remove item from cart (set quantity to 0)
  removeFromCart(productId) {
    return this.updateCartItem(productId, 0);
  },

  // Clear cart
  clearCart() {
    return apiClient.delete('/cart/');
  }
};