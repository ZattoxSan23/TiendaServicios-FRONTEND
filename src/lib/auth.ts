// lib/auth.ts
import api from './api';
import { LoginRequest, RegisterRequest } from '../types';

export const authService = {
  async login(data: LoginRequest): Promise<string> {
    const response = await api.post('/auth/login', data);
    const { token } = response.data;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
      localStorage.setItem('username', data.username);
      document.cookie = `token=${token}; path=/; max-age=3600; samesite=lax`;
      
      window.dispatchEvent(new CustomEvent('auth-change', { 
        detail: { action: 'login', username: data.username }
      }));
      window.dispatchEvent(new Event('storage'));
    }
    
    return token;
  },

  async register(data: RegisterRequest): Promise<string> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('userRole');
      document.cookie = `token=; path=/; max-age=0; samesite=lax`;
      
      window.dispatchEvent(new CustomEvent('auth-change', { 
        detail: { action: 'logout' }
      }));
      window.dispatchEvent(new Event('storage'));
      
      setTimeout(() => {
        window.location.href = '/products';
      }, 50);
    }
  },

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  },

  getStoredUsername(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('username');
    }
    return null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // ✅ ACTUALIZADO: Decodificar todos los campos del token
  async getCurrentUser(): Promise<any> {
    const token = this.getToken();
    if (!token) return null;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      console.log('Token payload:', payload);
      
      // Extraer todos los campos del token
      return {
        id: payload.id || payload.sub,
        username: payload.username || this.getStoredUsername() || 'Usuario',
        email: payload.email || '',
        role: payload.role || payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || 'Cliente',
        // ✅ NUEVOS CAMPOS
        phoneNumber: payload.phoneNumber || '',
        address: payload.address || '',
        birthDate: payload.birthDate || '',
        createdAt: payload.createdAt || ''
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};