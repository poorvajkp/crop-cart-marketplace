
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  seller: string;
  rating?: number;
  image?: string;
  sellerId: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  cart: string[];
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with sample products
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Organic Fertilizer Premium',
        description: 'High-quality organic fertilizer for vegetable gardens. Rich in nutrients and eco-friendly.',
        price: 25.99,
        quantity: 50,
        category: 'fertilizers',
        seller: 'Green Farm Co.',
        rating: 4.5,
        sellerId: 'seller1'
      },
      {
        id: '2',
        name: 'Bio Pesticide Solution',
        description: 'Eco-friendly pesticide for crop protection without harmful chemicals.',
        price: 18.50,
        quantity: 30,
        category: 'pesticides',
        seller: 'EcoAgri Solutions',
        rating: 4.2,
        sellerId: 'seller2'
      },
      {
        id: '3',
        name: 'Premium Cattle Feed',
        description: 'Nutritious cattle feed with essential vitamins and minerals.',
        price: 45.00,
        quantity: 25,
        category: 'cow-food',
        seller: 'LiveStock Plus',
        rating: 4.8,
        sellerId: 'seller1'
      }
    ];
    setProducts(sampleProducts);

    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      rating: 0
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, productData: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...productData } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    // Remove from cart if it exists there
    setCart(prev => prev.filter(itemId => itemId !== id));
  };

  const addToCart = (productId: string) => {
    setCart(prev => [...prev, productId]);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(id => id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      cart,
      addToCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </ProductContext.Provider>
  );
};
