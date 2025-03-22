"use client";

import { CartItem, Loading } from '@/components';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function CartPage() {
  const { items, isLoading, error, getTotal, checkout } = useCartStore();
  const cartTotal = getTotal();
  const isEmpty = items.length === 0;

  const handleCheckout = async () => {
    await checkout();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Seu Carrinho</h1>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <div className="text-center text-red-500 p-4 border border-red-200 rounded-md">
          <p>{error}</p>
        </div>
      ) : isEmpty ? (
        <div className="text-center p-8 border border-gray-200 rounded-md">
          <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Seu carrinho está vazio</h2>
          <p className="mt-1 text-sm text-gray-500">
            Comece adicionando alguns produtos ao seu carrinho.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Ver produtos
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="border-t border-gray-200">
            {items.map((item) => (
              <CartItem 
                key={item.productId} 
                productId={item.productId}
                name={item.name}
                imageUrl={item.imageUrl}
                price={item.price}
                quantity={item.quantity}
              />
            ))}
          </div>
          <div className="px-4 py-4 sm:px-6 bg-gray-50">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{formatCurrency(cartTotal)}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Frete e impostos calculados ao finalizar a compra.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Processando...' : 'Finalizar Compra'}
              </button>
            </div>
            <div className="mt-6 flex justify-center text-sm text-center text-gray-500">
              <p>
                ou{' '}
                <Link
                  href="/"
                  className="text-indigo-600 font-medium hover:text-indigo-500"
                >
                  Continuar comprando<span aria-hidden="true"> &rarr;</span>
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 