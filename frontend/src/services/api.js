import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Handled by Vite server proxies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Inject JWT token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('prepzo_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Catch 401 Unauthorized errors and redirect
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('prepzo_token');
      localStorage.removeItem('prepzo_user');
      // Prevent infinite redirect loop if already on login/register page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
