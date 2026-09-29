const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom API client for backend requests.
 * Automatically injects the Authorization Bearer token if present.
 */
export async function apiRequest(endpoint, { method = 'GET', body, headers = {} } = {}) {
  const token = localStorage.getItem('auth_token');

  const requestHeaders = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const config = {
    method,
    headers: requestHeaders,
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error?.message || 'A network error occurred. Please check your connection and retry.';
    const error = new Error(message);
    error.status = response.status;
    error.details = data?.error?.details || null;
    throw error;
  }

  return data;
}
