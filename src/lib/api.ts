import axios, { type InternalAxiosRequestConfig } from 'axios';

// Configure these public URLs in the hosting provider before building.
const PRODUCT_API_URL =
    process.env.NEXT_PUBLIC_PRODUCT_API_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5174/api' : '/api/products');
const AUTH_API_URL =
    process.env.NEXT_PUBLIC_AUTH_API_URL ||
    (process.env.NODE_ENV === 'development' ? 'http://localhost:5003/api' : '/api/auth');

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

const authInterceptor = (config: InternalAxiosRequestConfig) => {
    if (typeof window === 'undefined') return config;

    let token: string | null;
    try {
        token = window.localStorage.getItem('token');
    } catch {
        // Storage may be unavailable in private or restricted browsers.
        return config;
    }
    if (!token) return config;
    token = token.replace(/^["']|["']$/g, '').trim();
    if (token.split('.').length !== 3) return config;

    config.headers.set('Authorization', `Bearer ${token}`);
    return config;
};

productApi.interceptors.request.use(authInterceptor);
authApi.interceptors.request.use(authInterceptor);

export default authApi;
