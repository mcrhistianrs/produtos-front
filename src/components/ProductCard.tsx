"use client";

import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { Product } from '@/types';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore(state => state.addToCart);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} adicionado ao carrinho!`);
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-75">
        <Image
          src={product.imageUrl || 'https://via.placeholder.com/300x300'}
          alt={product.name}
          width={600}
          height={400}
          className="w-full h-60 object-cover"
        />
      </div>
      <div className="px-4 py-4">
        <div className="flex justify-between">
          <h3 className="text-sm font-medium text-gray-900">{product.name}</h3>
          <p className="text-sm font-medium text-gray-900">{formatCurrency(product.price)}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{product.category}</p>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="mt-4 flex justify-between">
          <p className="text-sm text-gray-500">
            {product.quantityInStock > 0 ? `${product.quantityInStock} em estoque` : 'Fora de estoque'}
          </p>
          <button
            onClick={handleAddToCart}
            disabled={product.quantityInStock === 0}
            className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white ${
              product.quantityInStock === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
            }`}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-1" />
            Adicionar
          </button>
        </div>
      </div>
    </div>
  );
} 