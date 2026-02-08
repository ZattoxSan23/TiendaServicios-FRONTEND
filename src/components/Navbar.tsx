// components/Navbar.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from './ui/Button';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { 
  ShoppingBag, 
  User, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronDown,
  Shield,
  UserCircle,
  ShoppingCart
} from 'lucide-react';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    router.push('/products');
  };

  const UserAvatar = () => (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
      <div className="relative">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
          <span className="text-white font-semibold text-sm">
            {user?.username?.charAt(0)?.toUpperCase() || 'U'}
          </span>
        </div>
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border-2 border-white flex items-center justify-center">
          {user?.role === 'Admin' ? (
            <Shield className="w-3 h-3 text-purple-600" />
          ) : (
            <User className="w-3 h-3 text-green-600" />
          )}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {user?.username || 'Usuario'}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          user?.role === 'Admin' 
            ? 'bg-purple-100 text-purple-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {user?.role === 'Admin' ? 'Administrador' : 'Cliente'}
        </span>
      </div>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-md">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  EcommercePro
                </span>
                <span className="block text-xs text-gray-500 -mt-1">Tu tienda online</span>
              </div>
            </Link>
          </div>

          {/* Menú de navegación desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/products" 
              className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group"
            >
              <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Productos</span>
            </Link>
            
            {isAuthenticated && (
              <>
                {user?.role === 'Cliente' && (
                  <Link 
                    href="/profile" 
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600 font-medium transition-all duration-200 group"
                  >
                    <UserCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Mi Perfil</span>
                  </Link>
                )}
                
                {user?.role === 'Admin' && (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium transition-all duration-200 group"
                  >
                    <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span>Panel Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Panel derecho desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button 
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="focus:outline-none"
                >
                  <UserAvatar />
                </button>
                
                {/* Menú desplegable del usuario */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-in slide-in-from-top-5">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900">{user?.username}</div>
                      <div className="text-sm text-gray-500">{user?.email || 'usuario@email.com'}</div>
                    </div>
                    
                    <div className="py-2">
                      {user?.role === 'Cliente' && (
                        <Link 
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <UserCircle className="w-4 h-4" />
                          <span>Mi Perfil</span>
                        </Link>
                      )}
                      
                      {user?.role === 'Admin' && (
                        <Link 
                          href="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                          <span>Panel Administrativo</span>
                        </Link>
                      )}
                      
                      <Link 
                        href="/products"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>Ver Productos</span>
                      </Link>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2 w-full text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button 
                    variant="primary" 
                    className="border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-all"
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Botón menú móvil */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Información del usuario móvil */}
            {isAuthenticated && user && (
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow">
                    <span className="text-white font-bold text-lg">
                      {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{user?.username}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        user?.role === 'Admin' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user?.role === 'Admin' ? 'Administrador' : 'Cliente'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enlaces móviles */}
            <div className="space-y-4">
              <Link 
                href="/products" 
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="font-medium">Productos</span>
              </Link>
              
              {isAuthenticated && (
                <>
                  {user?.role === 'Cliente' && (
                    <Link 
                      href="/profile" 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5" />
                      <span className="font-medium">Mi Perfil</span>
                    </Link>
                  )}
                  
                  {user?.role === 'Admin' && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-purple-50 text-gray-700 hover:text-purple-600 transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Users className="w-5 h-5" />
                      <span className="font-medium">Panel Admin</span>
                    </Link>
                  )}
                </>
              )}
            </div>

            {/* Botones de auth móvil */}
            {!isAuthenticated ? (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <Link 
                  href="/login" 
                  className="block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button variant="primary" className="w-full border-gray-300">
                    Iniciar Sesión
                  </Button>
                </Link>
                <Link 
                  href="/register" 
                  className="block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Registrarse
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 w-full p-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Cerrar Sesión</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay para cerrar menú */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};