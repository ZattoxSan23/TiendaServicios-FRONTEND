// hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '@/lib/auth';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Escuchar cambios en localStorage para actualizar automáticamente
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuth();
    };

    // Listener para cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar autenticación al montar
    checkAuth();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const checkAuth = async () => {
    const auth = authService.isAuthenticated();
    setIsAuthenticated(auth);
    
    if (auth) {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } else {
      setUser(null);
    }
    
    setLoading(false);
  };

  const login = async (username: string, password: string) => {
    try {
      const result = await authService.login({ username, password });
      
      // Forzar actualización inmediata
      await checkAuth();
      
      return { success: true, token: result };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Credenciales inválidas' 
      };
    }
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    
    // Forzar recarga de la página para actualizar completamente
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    checkAuth
  };
};