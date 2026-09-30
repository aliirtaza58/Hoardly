import { apiRequest } from './api.js';
export const ordersService = { createOrder: (shippingAddress) => apiRequest('/orders', { method: 'POST', body: { shipping_address: shippingAddress } }), getOrders: () => apiRequest('/orders'), getAddresses: () => apiRequest('/users/addresses') };
