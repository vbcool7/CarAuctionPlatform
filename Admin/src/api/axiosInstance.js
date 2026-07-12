
import axios from 'axios';
import useAdminAuthStore from '../store/useAdminAuthStore';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
    const token = useAdminAuthStore.getState().token;
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
        if (error.response && error.response.status === 401) {
            useAdminAuthStore.getState().logout();
        }
        return Promise.reject(error);
    }
);

export default API;