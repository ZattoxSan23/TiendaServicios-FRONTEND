'use client';

import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ProductsPage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            🛍️ Catálogo de Productos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Explora nuestra amplia selección de productos. No necesitas iniciar sesión
            para navegar, pero sí para realizar compras y gestionar tu perfil.
          </p>
        </div>

        {/* Productos de ejemplo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Producto 1 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <span className="text-4xl">📱</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smartphone X10</h3>
              <p className="text-gray-600 mb-4">Pantalla 6.5", 128GB, 8GB RAM</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$499</span>
                {isAuthenticated ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agregar al carrito
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                      Iniciar sesión para comprar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Producto 2 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-green-100 flex items-center justify-center">
              <span className="text-4xl">💻</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Laptop Pro</h3>
              <p className="text-gray-600 mb-4">Intel i7, 16GB RAM, 512GB SSD</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$899</span>
                {isAuthenticated ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agregar al carrito
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                      Iniciar sesión para comprar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Producto 3 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-yellow-100 flex items-center justify-center">
              <span className="text-4xl">🎧</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Audífonos Bluetooth</h3>
              <p className="text-gray-600 mb-4">Cancelación de ruido, 30h batería</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$199</span>
                {isAuthenticated ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agregar al carrito
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                      Iniciar sesión para comprar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Producto 4 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-purple-100 flex items-center justify-center">
              <span className="text-4xl">⌚</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Smart Watch</h3>
              <p className="text-gray-600 mb-4">Monitoreo de salud, GPS, 7 días batería</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$299</span>
                {isAuthenticated ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agregar al carrito
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                      Iniciar sesión para comprar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Producto 5 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-red-100 flex items-center justify-center">
              <span className="text-4xl">📷</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Cámara Mirrorless</h3>
              <p className="text-gray-600 mb-4">24MP, 4K video, kit de lentes</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$799</span>
                {isAuthenticated ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agregar al carrito
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                      Iniciar sesión para comprar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Producto 6 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div className="h-48 bg-pink-100 flex items-center justify-center">
              <span className="text-4xl">🎮</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Consola Gaming</h3>
              <p className="text-gray-600 mb-4">1TB SSD, 4K gaming, 2 controles</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-blue-600">$599</span>
                {isAuthenticated ? (
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Agregar al carrito
                  </button>
                ) : (
                  <Link href="/login">
                    <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300">
                      Iniciar sesión para comprar
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Información para usuarios */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Información importante
            </h2>
            
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${user?.role === 'Admin' ? 'bg-purple-50 border border-purple-200' : 'bg-green-50 border border-green-200'}`}>
                  <p className={`font-medium ${user?.role === 'Admin' ? 'text-purple-700' : 'text-green-700'}`}>
                    ✅ <span className="font-bold">{user?.role === 'Admin' ? 'ADMINISTRADOR' : 'CLIENTE'}</span>
                  </p>
                  <p className="mt-2 text-gray-600">
                    {user?.role === 'Admin' 
                      ? 'Tienes acceso al panel de administración para gestionar usuarios.' 
                      : 'Ya puedes agregar productos al carrito y realizar compras.'}
                  </p>
                </div>
                <p className="text-gray-500 text-sm">
                  Usuario: <span className="font-medium">{user?.username}</span> | 
                  Rol: <span className={`px-2 py-1 rounded text-xs ${user?.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                    {user?.role}
                  </span>
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                  <p className="text-yellow-700">
                    ⚠️ Para realizar compras, necesitas una cuenta
                  </p>
                  <p className="mt-2 text-gray-600">
                    Regístrate gratuitamente y disfruta de todos los beneficios
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <Link href="/login">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                      Iniciar Sesión
                    </button>
                  </Link>
                  <Link href="/register">
                    <button className="bg-white text-blue-600 border border-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition">
                      Registrarse
                    </button>
                  </Link>
                </div>
              </div>
            )}
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-500">
                Estado del sistema: <span className="font-medium">Autenticación ✅ | Productos ✅ | Carrito 🔄</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}