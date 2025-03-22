"use client";

import { Loading, ProductCard } from '@/components';
import { useProductStore } from '@/lib/store';
import { CategoryEnum } from '@/types';
import { useEffect, useState } from 'react';

export default function Home() {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryEnum | 'all'>('all');

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Produtos</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Filtrar por:</span>
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
      </div>

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 p-8">
              <p>Nenhum produto encontrado para esta categoria.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
