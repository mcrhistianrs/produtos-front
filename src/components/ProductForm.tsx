"use client";

import { useProductStore } from '@/lib/store';
import { CategoryEnum, Product } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const DEFAULT_PRODUCT_IMAGE = "https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=600&h=400";

export default function ProductForm() {
  const router = useRouter();
  const { createProduct, isLoading, error } = useProductStore();
  
  const [formData, setFormData] = useState({
    name: '',
    category: CategoryEnum.FOOD,
    price: '',
    description: '',
    imageUrl: '',
    quantityInStock: '10'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Convert string values to appropriate types
      const productData: Omit<Product, "id"> = {
        name: formData.name,
        category: formData.category as CategoryEnum,
        price: parseFloat(formData.price) * 100, // Convert to cents
        description: formData.description,
        imageUrl: formData.imageUrl || DEFAULT_PRODUCT_IMAGE,
        quantityInStock: parseInt(formData.quantityInStock)
      };
      
      const newProduct = await createProduct(productData);
      
      if (newProduct) {
        toast.success('Produto adicionado com sucesso!');
        router.push('/'); // Redirect to product list
      }
    } catch (error) {
      toast.error('Erro ao adicionar produto');
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Adicionar Novo Produto</h1>
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-md border border-red-200">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nome do Produto*
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Categoria*
          </label>
          <select
            id="category"
            name="category"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.category}
            onChange={handleChange}
          >
            <option value={CategoryEnum.FOOD}>Comidas</option>
            <option value={CategoryEnum.BEVERAGE}>Bebidas</option>
            <option value={CategoryEnum.SNACK}>Lanches</option>
          </select>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Preço (R$)*
          </label>
          <input
            type="text"
            name="price"
            id="price"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.price}
            onChange={handleChange}
            placeholder="0.00"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descrição*
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            URL da Imagem (opcional)
          </label>
          <input
            type="text"
            name="imageUrl"
            id="imageUrl"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://images.pexels.com/..."
          />
          <p className="mt-1 text-sm text-gray-500">
            Se não fornecido, uma imagem padrão será usada.
          </p>
        </div>

        <div>
          <label htmlFor="quantityInStock" className="block text-sm font-medium text-gray-700">
            Quantidade em Estoque*
          </label>
          <input
            type="number"
            name="quantityInStock"
            id="quantityInStock"
            required
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={formData.quantityInStock}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Adicionando...' : 'Adicionar Produto'}
          </button>
        </div>
      </form>
    </div>
  );
} 