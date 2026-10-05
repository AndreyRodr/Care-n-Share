import axios from 'axios';

let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  withCredentials: true
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const shouldHandleUnauthorized =
      error.response?.status === 401 &&
      !error.config?.skipSessionRedirect;

    if (shouldHandleUnauthorized) {
      unauthorizedHandler?.();
    }

    return Promise.reject(error);
  }
);

export default api;