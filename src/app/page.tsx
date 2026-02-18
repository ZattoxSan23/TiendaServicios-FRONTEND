'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/lib/product';
import { categoryService } from '@/lib/category';
import { Product, Category } from '@/types';
import { ShoppingCart, Heart, Star, Filter, ChevronDown } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Leer query param al cargar y cuando cambie
  useEffect(() => {
    const query = searchParams.get('search') || '';
    setSearchQuery(query);
  }, [searchParams]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchQuery, selectedCategoryId]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = useCallback(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.categoryName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategoryId) {
      filtered = filtered.filter(product => product.categoryId === selectedCategoryId);
    }

    setFilteredProducts(filtered);
  }, [products, searchQuery, selectedCategoryId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Categorías horizontales estilo Temu */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-200 transition"
            >
              <Filter className="h-4 w-4" />
              Filtros
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                selectedCategoryId === null
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategoryId(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  selectedCategoryId === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtros expandibles */}
      {showFilters && (
        <div className="bg-white border-b py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ordenar por</label>
                <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Relevancia</option>
                  <option>Precio: Menor a Mayor</option>
                  <option>Precio: Mayor a Menor</option>
                  <option>Más vendidos</option>
                  <option>Nuevos</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Precio</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resultados de búsqueda */}
      {searchQuery && (
        <div className="bg-orange-50 border-b border-orange-100">
          <div className="container mx-auto px-4 py-3">
            <p className="text-sm text-gray-700">
              Resultados para: <span className="font-semibold text-orange-600">"{searchQuery}"</span>
              {' '}({filteredProducts.length} productos)
            </p>
          </div>
        </div>
      )}

      {/* Grid de Productos */}
      <div className="container mx-auto px-4 py-6">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No encontramos productos</h3>
            <p className="text-gray-500">Intenta con otros términos de búsqueda</p>
          </div>
        ) : (
          <>
            {/* Banner promocional */}
            <div className="mb-6 bg-gradient-to-r from-orange-400 to-pink-500 rounded-2xl p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">¡Ofertas Especiales!</h2>
              <p className="opacity-90">Hasta 50% de descuento en productos seleccionados</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="group bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
            Sin imagen
          </div>
        )}

        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </span>
        )}

        <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white">
          <Heart className="w-4 h-4 text-gray-600" />
        </button>

        <button className="absolute bottom-0 left-0 right-0 bg-orange-500 text-white py-2 text-sm font-medium translate-y-full group-hover:translate-y-0 transition-transform flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          Agregar
        </button>
      </div>

      <div className="p-3">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-lg font-bold text-gray-900">
            S/ {(product.discountPrice || product.price).toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">
              S/ {product.price.toFixed(2)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center bg-green-100 px-1.5 py-0.5 rounded">
            <Star className="w-3 h-3 text-green-600 fill-current" />
            <span className="text-xs font-medium text-green-700 ml-0.5">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {product.reviewCount} vendidos
          </span>
        </div>

        <h3 className="text-sm text-gray-700 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>

        {product.categoryName && (
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
            {product.categoryName}
          </span>
        )}

        {product.price > 50 && (
          <span className="inline-block mt-2 text-xs text-green-600 font-medium">
            Envío gratis
          </span>
        )}
      </div>
    </Link>
  );
}