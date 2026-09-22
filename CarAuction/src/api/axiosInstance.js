
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
        const url = error.config?.url || '';
        const isAuthEndpoint = url.includes('/buyer-login') || url.includes('/seller-login');
        const status = error.response?.status;
        const code = error.response?.data?.code;

        if (!isAuthEndpoint && (status === 401 || (status === 403 && code === 'ACCOUNT_SUSPENDED'))) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;