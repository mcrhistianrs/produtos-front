"use client";

import { useCartStore } from '@/lib/store';
import { formatCurrency } from '@/lib/utils';
import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface CartItemProps {
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export default function CartItem({ productId, name, imageUrl, price, quantity }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(productId, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(productId, quantity - 1);
    } else {
      removeFromCart(productId);
    }
  };

  const handleRemove = () => {
    removeFromCart(productId);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <Image
          src={imageUrl || 'https://via.placeholder.com/100x100'}
          alt={name}
          width={100}
          height={100}
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div className="flex justify-between text-base font-medium text-gray-900">
          <h3>{name}</h3>
          <p className="ml-4">{formatCurrency(price)}</p>
        </div>

        <div className="flex flex-1 items-end justify-between text-sm mt-2">
          <div className="flex items-center border rounded-md">
            <button
              onClick={handleDecrement}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <MinusIcon className="h-4 w-4" />
            </button>
            <span className="px-2 py-1 text-gray-700">{quantity}</span>
            <button
              onClick={handleIncrement}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex">
            <p className="text-gray-500 mr-4">Subtotal: {formatCurrency(price * quantity)}</p>
            <button
              type="button"
              onClick={handleRemove}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 