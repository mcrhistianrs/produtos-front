"use client";

import { CartItem, Loading } from '@/components';
import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { ArrowLeftIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function CartPage() {
  const { items, isLoading, error, getTotal, checkout } = useCartStore();

  const handleCheckout = async () => {
    try {
      await checkout();
      toast.success('Pedido realizado com sucesso!');
    } catch {
      // Error is handled by the store and displayed in the UI
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Seu Carrinho</h1>
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          <ArrowLeftIcon className="mr-2 h-4 w-4" />
          Continuar Comprando
        </Link>
      </div>

      {isLoading ? (
        <Loading />
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <ShoppingBagIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-lg font-medium text-gray-900">Seu carrinho está vazio</h2>
            <p className="mt-1 text-gray-500">Adicione produtos para fazer um pedido</p>
            <Link 
              href="/"
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Ver produtos
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <div className="flow-root">
            <ul className="-my-6 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item.productId} className="py-6">
                  <CartItem 
                    productId={item.productId}
                    name={item.name}
                    imageUrl={item.imageUrl}
                    price={item.price}
                    quantity={item.quantity}
                  />
                </li>
              ))}
            </ul>
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="flex justify-between text-base font-medium text-gray-900">
              <p>Subtotal</p>
              <p>{formatCurrency(getTotal())}</p>
            </div>
            <p className="mt-0.5 text-sm text-gray-500">
              Frete e impostos calculados no checkout.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processando...
                  </>
                ) : (
                  'Finalizar Compra'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 