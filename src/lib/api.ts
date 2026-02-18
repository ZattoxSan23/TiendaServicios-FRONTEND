import axios from 'axios';

const PRODUCT_API_URL = 'http://localhost:5174/api';
const AUTH_API_URL = 'http://localhost:5003/api';

export const productApi = axios.create({
    baseURL: PRODUCT_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

export const authApi = axios.create({
    baseURL: AUTH_API_URL,
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
});

// INTERCEPTOR ULTRA SEGURO
const authInterceptor = (config: any) => {
    if (typeof window === 'undefined') return config;

    let token = localStorage.getItem('token');
    if (!token) return config;

    // Limpieza extrema
    token = token.replace(/^["']|["']$/g, '').trim();

    if (token.split('.').length !== 3) {
        console.error('❌ Token inválido (no tiene 3 partes)');
        return config;
    }

    config.headers.Authorization = `Bearer ${token}`;
    console.log('✅ Token enviado (primeros 50):', token.substring(0, 50) + '...');
    return config;
};

productApi.interceptors.request.use(authInterceptor);
authApi.interceptors.request.use(authInterceptor);

productApi.interceptors.response.use(
    response => response,
    error => {
        console.error('❌ ERROR API:', error.config?.url, error.response?.status);
        console.error('Headers enviados:', error.config?.headers);
        return Promise.reject(error);
    }
);

export default authApi;