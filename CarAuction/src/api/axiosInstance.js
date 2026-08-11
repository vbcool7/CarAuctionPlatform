
import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: check each req before sending
API.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthEndpoint = error.config?.url?.includes('/buyer-login') || error.config?.url?.includes('/seller-login');
        if (error.response?.status === 401 && !isAuthEndpoint) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;