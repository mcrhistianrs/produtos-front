"use client";

import { Loading, Pagination, ProductCard, ProductSearch } from '@/components';
import { useProductStore } from '@/lib/store';
import { CategoryEnum } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface PriceRange {
  min: number;
  max: number;
}

const PRODUCTS_PER_PAGE = 6;

export default function Home() {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryEnum | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery, priceRange]);

  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(product => {
      // Convert price range values to cents for comparison with product prices
      const minPriceInCents = Math.floor(priceRange.min * 100);
      const maxPriceInCents = Math.ceil(priceRange.max * 100);
      return product.price >= minPriceInCents && product.price <= maxPriceInCents;
    });

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Ordenar por:</span>
            <select 
              className="border rounded-md px-3 py-1 text-sm bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as CategoryEnum | 'all')}
            >
              <option value="all">Todos</option>
              <option value={CategoryEnum.FOOD}>Comidas</option>
              <option value={CategoryEnum.BEVERAGE}>Bebidas</option>
              <option value={CategoryEnum.SNACK}>Lanches</option>
            </select>
          </div>
          <Link 
            href="/products/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Adicionar Produto
          </Link>
        </div>
      </div>

      <ProductSearch 
        onSearch={(query) => setSearchQuery(query)}
        onPriceRangeChange={(range) => setPriceRange(range)}
      />

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-500 p-4 border border-red-200 rounded-md">
          <p>Erro ao carregar produtos: {error}</p>
          <button 
            onClick={() => fetchProducts()}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 p-8">
                <p>Nenhum produto encontrado para os filtros selecionados.</p>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
}
