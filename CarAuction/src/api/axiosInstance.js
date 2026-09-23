
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
        const isChangePassword = url.includes('/change-password'); // change pass me 401 pr logout nhi hoga
        const status = error.response?.status;
        const code = error.response?.data?.code;

        // 401-403 err pr login page pr redirect krega 

        if (!isAuthEndpoint && !isChangePassword && (status === 401 || (status === 403 && code === 'ACCOUNT_SUSPENDED'))) {
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;