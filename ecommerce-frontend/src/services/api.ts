import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    console.log('Token:', token);
    console.log('URL:', config.url);
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isAuthRoute = error.config?.url?.includes('/auth/');
        if (error.response?.status === 403 && !isAuthRoute) {
            Cookies.remove('token');
           // if (typeof window !== 'undefined') {
            //     window.location.href = '/login';
            // }
        }
        return Promise.reject(error);
    }
);

export default api;