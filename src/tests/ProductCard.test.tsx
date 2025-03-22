import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/lib/store';
import { CategoryEnum, Product } from '@/types';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
  },
}));

vi.mock('@/lib/store', () => ({
  useCartStore: vi.fn(),
}));

describe('ProductCard Component', () => {
  const mockProduct: Product = {
    id: '1',
    name: 'Test Product',
    category: CategoryEnum.FOOD,
    price: 1000,
    description: 'Test description',
    imageUrl: 'https://example.com/test.jpg',
    quantityInStock: 5
  };

  const mockAddToCart = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    
    (useCartStore as unknown as ReturnType<typeof vi.fn>).mockImplementation(() => mockAddToCart);
  });

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('food')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('R$ 10,00')).toBeInTheDocument();
    expect(screen.getByText('5 em estoque')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /adicionar/i })).toBeInTheDocument();
  });

  it('calls addToCart when the button is clicked', () => {
    render(<ProductCard product={mockProduct} />);
    
    fireEvent.click(screen.getByRole('button', { name: /adicionar/i }));
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct, 1);
  });

  it('disables the button when product is out of stock', () => {
    const outOfStockProduct = { ...mockProduct, quantityInStock: 0 };
    render(<ProductCard product={outOfStockProduct} />);
    
    const button = screen.getByRole('button', { name: /adicionar/i });
    expect(button).toBeDisabled();
    expect(screen.getByText('Fora de estoque')).toBeInTheDocument();
  });
});