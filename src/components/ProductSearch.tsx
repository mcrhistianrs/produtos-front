"use client";

import { ChangeEvent, useState } from 'react';

interface PriceRange {
  min: number;
  max: number;
}

interface ProductSearchProps {
  onSearch: (query: string) => void;
  onPriceRangeChange: (range: PriceRange) => void;
}

export default function ProductSearch({ onSearch, onPriceRangeChange }: ProductSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<PriceRange>({ min: 0, max: 10000 });
  const [minPriceInput, setMinPriceInput] = useState('0');
  const [maxPriceInput, setMaxPriceInput] = useState('100');

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const convertToNumber = (value: string): number => {
    if (value === '') return 0;
    const normalizedValue = value.replace(',', '.');
    return parseFloat(normalizedValue);
  };

  const handleMinPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMinPriceInput(value);
    
    const numValue = convertToNumber(value);
    if (!isNaN(numValue)) {
      const newRange = { ...priceRange, min: numValue };
      setPriceRange(newRange);
      onPriceRangeChange(newRange);
    }
  };

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMaxPriceInput(value);
    
    const numValue = value === '' ? 10000 : convertToNumber(value);
    if (!isNaN(numValue)) {
      const newRange = { ...priceRange, max: numValue };
      setPriceRange(newRange);
      onPriceRangeChange(newRange);
    }
  };

  return (
    <div className="space-y-3 mb-4">
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700">
          Buscar produtos
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            type="text"
            name="search"
            id="search"
            className="block w-full rounded-md border-gray-300 pl-3 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Nome do produto..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="price-range" className="block text-sm font-medium text-gray-700">
          Faixa de preço (R$)
        </label>
        <div className="mt-1 flex items-center space-x-4">
          <div className="relative rounded-md shadow-sm w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="text"
              name="min-price"
              id="min-price"
              className="block w-full rounded-md border-gray-300 pl-8 pr-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Min"
              value={minPriceInput}
              onChange={handleMinPriceChange}
            />
          </div>
          <span className="text-gray-500">a</span>
          <div className="relative rounded-md shadow-sm w-1/2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">R$</span>
            </div>
            <input
              type="text"
              name="max-price"
              id="max-price"
              className="block w-full rounded-md border-gray-300 pl-8 pr-3 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Max"
              value={maxPriceInput}
              onChange={handleMaxPriceChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 