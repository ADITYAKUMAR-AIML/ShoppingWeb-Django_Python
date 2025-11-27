import { apiClient } from './fetcher';

export const ordersAPI = {
  getOrders() {
    return apiClient.get('/orders/');
  },

  createOrder(data) {
    return apiClient.post('/orders/', data);
  }
};