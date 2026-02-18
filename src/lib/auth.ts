import { authApi } from './api';
import { LoginRequest, RegisterRequest } from '../types';

export const authService = {
    async login(data: LoginRequest): Promise<string> {
    try {
        console.log('🚀 === LOGIN ===');
        console.log('🚀 Username:', data.username);
        
        const response = await authApi.post('/auth/login', data);
        console.log('✅ Response:', response.status);
        
        let token = response.data;
        
        if (!token) {
            throw new Error('No se recibió token');
        }
        
        // ✅ SOLUCIÓN: Si el token viene como objeto {token: "..."}, extraerlo
        if (typeof token === 'object' && token.token) {
            token = token.token;
        }
        
        // ✅ SOLUCIÓN: Si viene como string con comillas JSON, parsearlo
        if (typeof token === 'string') {
            // Intentar parsear si parece JSON
            if (token.startsWith('"') && token.endsWith('"')) {
                try {
                    token = JSON.parse(token);
                } catch (e) {
                    // Si falla el parseo, limpiar manualmente
                    token = token.slice(1, -1);
                }
            }
            token = token.trim();
        }
        
        console.log('✅ Token limpio:', token.substring(0, 30) + '...');
        
        if (typeof window !== 'undefined') {
            // ✅ GUARDAR SIN JSON.stringify y sin comillas
            localStorage.setItem('token', token);
            localStorage.setItem('username', data.username);
            document.cookie = `token=${token}; path=/; max-age=3600; samesite=lax`;
            
            // Verificar
            const saved = localStorage.getItem('token');
            console.log('💾 Guardado:', saved?.substring(0, 30) + '...');
            console.log('💾 Tiene comillas?:', saved?.startsWith('"'));
            
            window.dispatchEvent(new CustomEvent('auth-change', { 
                detail: { action: 'login', username: data.username }
            }));
            window.dispatchEvent(new Event('storage'));
        }
        
        return token;
    } catch (error: any) {
        console.error('❌ Error login:', error);
        throw error;
    }
},

    async register(data: RegisterRequest): Promise<string> {
        const response = await authApi.post('/auth/register', data);
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
                window.location.href = '/';
            }, 50);
        }
    },

    getToken(): string | null {
        if (typeof window !== 'undefined') {
            let token = localStorage.getItem('token');
            if (!token) return null;
            
            // Limpiar comillas
            token = token.trim();
            while (token.startsWith('"') || token.startsWith("'")) {
                token = token.substring(1);
            }
            while (token.endsWith('"') || token.endsWith("'")) {
                token = token.substring(0, token.length - 1);
            }
            
            return token;
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
        const token = this.getToken();
        const valid = !!token && token.split('.').length === 3;
        console.log('🔍 isAuthenticated:', valid);
        return valid;
    },

    updateToken(token: string, username?: string): void {
        if (typeof window !== 'undefined') {
            // Limpiar antes de guardar
            let cleanToken = token.trim();
            while (cleanToken.startsWith('"') || cleanToken.startsWith("'")) {
                cleanToken = cleanToken.substring(1);
            }
            while (cleanToken.endsWith('"') || cleanToken.endsWith("'")) {
                cleanToken = cleanToken.substring(0, cleanToken.length - 1);
            }
            
            localStorage.setItem('token', cleanToken);
            if (username) {
                localStorage.setItem('username', username);
            }
            document.cookie = `token=${cleanToken}; path=/; max-age=3600; samesite=lax`;
            
            window.dispatchEvent(new CustomEvent('auth-change', { 
                detail: { action: 'login', username: username || this.getStoredUsername() }
            }));
            window.dispatchEvent(new Event('storage'));
        }
    },

    async getCurrentUser(): Promise<any> {
        const token = this.getToken();
        if (!token) return null;
        
        try {
            const parts = token.split('.');
            const payload = JSON.parse(atob(parts[1]));
            
            // Manejar rol como array (por si está duplicado)
            let role = payload.role;
            if (Array.isArray(role)) {
                role = role[0]; // Tomar el primero
            }
            
            return {
                id: payload.sub || payload.nameid,
                username: payload.username || payload.name,
                email: payload.email,
                role: role || 'Cliente',
                firstName: payload.firstName,
                lastName: payload.lastName,
                phoneNumber: payload.phoneNumber,
                address: payload.address,
                birthDate: payload.birthDate,
                createdAt: payload.createdAt
            };
        } catch (error) {
            console.error('❌ Error decoding:', error);
            return null;
        }
    }
};