'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag, User, Search,
  LogOut, Menu, X, Shield, LayoutDashboard, Package
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (!mounted) {
    return <nav className="bg-white shadow-sm h-16" />;
  }

  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  // Solo mostrar navegación en Admin
  const getNavItems = () => {
    if (isAdminRoute) {
      return [
        { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
        { href: '/admin/products', label: 'Productos', icon: <Package className="h-5 w-5" /> },
        { href: '/admin/categories', label: 'Categorías', icon: <Package className="h-5 w-5" /> },
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href) ?? false;
  };

  const themeColor = isAdminRoute ? 'purple' : 'blue';
  const activeBg = themeColor === 'purple' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-600';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirigir a home con query param
      router.push(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/');
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link
            href={isAdminRoute ? '/admin' : '/'}
            className="flex items-center space-x-2 flex-shrink-0"
          >
            <ShoppingBag className={`h-8 w-8 ${themeColor === 'purple' ? 'text-purple-600' : 'text-orange-500'}`} />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              {isAdminRoute ? 'Admin Panel' : 'MiTienda'}
            </span>
          </Link>

          {/* Barra de búsqueda estilo Temu (solo en tienda) */}
          {!isAdminRoute && (
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar productos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-12 py-2.5 bg-gray-100 border-0 rounded-full focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}

          {/* Navegación Admin (solo si es admin route) */}
          {isAdminRoute && (
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
                    isActive(item.href) ? activeBg : `text-gray-700 hover:bg-gray-100`
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {user ? (
              <>
                {/* Botón Admin (solo para admins en tienda) */}
                {!isAdminRoute && user.role === 'Admin' && (
                  <Link
                    href="/admin"
                    className="hidden sm:flex items-center space-x-1 px-3 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition"
                  >
                    <Shield className="h-5 w-5" />
                    <span className="hidden lg:inline">Admin</span>
                  </Link>
                )}

                {/* Botón Ir a Tienda (solo en admin) */}
                {isAdminRoute && (
                  <Link
                    href="/"
                    className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="hidden lg:inline">Tienda</span>
                  </Link>
                )}

                <Link
                  href="/profile"
                  className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden lg:inline max-w-[80px] truncate">
                    {user.firstName || user.username}
                  </span>
                </Link>

                <button
                  onClick={logout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-700 px-3 py-2 rounded-lg hover:bg-red-50 transition"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button (solo en admin) */}
          {isAdminRoute && (
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-700 hover:text-gray-900 p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Navigation (solo admin) */}
      {isAdminRoute && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 border-t space-y-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg ${
                  isActive(item.href) ? activeBg : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;