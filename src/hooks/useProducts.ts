// hooks/useProducts.ts
import { useState, useEffect, useCallback } from 'react';
import { productService } from '@/lib/product';
import type { 
  Product, 
  ProductFilter, 
  PaginationInfo, 
  Category, 
  CategorySimple // ✅ Importar
} from '@/types';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

export const useProduct = (id: number | undefined) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        setError(null);
      } catch (err) {
        setError('Producto no encontrado');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  return { product, loading, error };
};

export const useFeaturedProducts = (count: number = 8) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await productService.getFeaturedProducts(count);
        setProducts(data);
      } catch (err) {
        console.error('Error fetching featured products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, [count]);

  return { products, loading };
};

// ✅ ACTUALIZADO: Usar CategorySimple en lugar de Category
export const useProductFilters = (initialFilters?: Partial<ProductFilter>) => {
  const [filters, setFilters] = useState<ProductFilter>({
    page: 1,
    pageSize: 20,
    sortBy: 'newest',
    ...initialFilters
  });
  
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<CategorySimple[]>([]); // ✅ CategorySimple
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const [cats, brs] = await Promise.all([
          productService.getCategories(),
          productService.getBrands()
        ]);
        setCategories(cats);
        setCategoryNames(cats.map(c => c.name));
        setBrands(brs);
      } catch (err) {
        console.error('Error loading filters:', err);
      }
    };
    loadFilters();
  }, []);

  const applyFilters = useCallback(async (newFilters?: Partial<ProductFilter>) => {
    const updatedFilters = { ...filters, ...newFilters, page: newFilters?.page || 1 };
    setFilters(updatedFilters);
    setLoading(true);

    try {
      const result = await productService.getFilteredProducts(updatedFilters);
      setProducts(result.products);
      setPagination(result.pagination);
    } catch (err) {
      console.error('Error applying filters:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    applyFilters();
  }, []);

  return {
    filters,
    setFilters,
    products,
    pagination,
    loading,
    categories,
    categoryNames,
    brands,
    applyFilters
  };
};

// ✅ ACTUALIZADO: useCategories usa Category (completo) del servicio de categorías
export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // Usar categoryService en lugar de productService para obtener categorías completas
        const { categoryService } = await import('@/lib/category');
        const data = await categoryService.getAllCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar categorías');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};

export const useProductsByCategory = (categoryId: number | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setProducts([]);
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productService.getProductsByCategoryId(categoryId);
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar productos de la categoría');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryId]);

  return { products, loading, error };
};