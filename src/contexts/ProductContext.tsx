
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

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  products: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    seller: string;
    sellerId: string;
  }>;
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryTime: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
  orderDate: string;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  cart: Array<{ productId: string; quantity: number }>;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  orders: Order[];
  placeOrder: (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
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
  const [cart, setCart] = useState<Array<{ productId: string; quantity: number }>>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Initialize with comprehensive sample products
    const sampleProducts: Product[] = [
      // Fertilizers
      {
        id: '1',
        name: 'Urea Fertilizer (46-0-0)',
        description: 'High nitrogen content fertilizer ideal for leafy vegetables and crop growth. Promotes healthy green foliage.',
        price: 25.99,
        quantity: 50,
        category: 'fertilizers',
        seller: 'Green Farm Co.',
        rating: 4.5,
        sellerId: 'seller1'
      },
      {
        id: '2',
        name: 'Phosphorus Fertilizer (0-46-0)',
        description: 'Essential for root development and flowering. Perfect for fruit trees and flowering plants.',
        price: 28.50,
        quantity: 40,
        category: 'fertilizers',
        seller: 'AgriSupply Ltd.',
        rating: 4.3,
        sellerId: 'seller2'
      },
      {
        id: '3',
        name: 'Potassium Fertilizer (0-0-60)',
        description: 'Enhances fruit quality and disease resistance. Ideal for fruit crops and vegetables.',
        price: 32.00,
        quantity: 35,
        category: 'fertilizers',
        seller: 'Green Farm Co.',
        rating: 4.6,
        sellerId: 'seller1'
      },
      {
        id: '4',
        name: 'NPK Complete Fertilizer (20-10-10)',
        description: 'Balanced nutrition for all-purpose use. Contains Nitrogen, Phosphorus, and Potassium.',
        price: 35.99,
        quantity: 45,
        category: 'fertilizers',
        seller: 'FertilizerPro',
        rating: 4.4,
        sellerId: 'seller3'
      },
      // Pesticides
      {
        id: '5',
        name: 'Bio Pesticide Solution',
        description: 'Eco-friendly pesticide for crop protection without harmful chemicals. Safe for organic farming.',
        price: 18.50,
        quantity: 30,
        category: 'pesticides',
        seller: 'EcoAgri Solutions',
        rating: 4.2,
        sellerId: 'seller2'
      },
      {
        id: '6',
        name: 'Neem Oil Pesticide',
        description: 'Natural pesticide derived from neem tree. Effective against aphids, whiteflies, and other pests.',
        price: 22.00,
        quantity: 25,
        category: 'pesticides',
        seller: 'Organic Pest Control',
        rating: 4.7,
        sellerId: 'seller4'
      },
      {
        id: '7',
        name: 'Copper Fungicide',
        description: 'Broad spectrum fungicide for preventing plant diseases. Suitable for fruits and vegetables.',
        price: 26.75,
        quantity: 20,
        category: 'pesticides',
        seller: 'PlantProtect Inc.',
        rating: 4.1,
        sellerId: 'seller5'
      },
      // Cow Food
      {
        id: '8',
        name: 'Premium Cattle Feed',
        description: 'Nutritious cattle feed with essential vitamins and minerals. Promotes healthy growth and milk production.',
        price: 45.00,
        quantity: 25,
        category: 'cow-food',
        seller: 'LiveStock Plus',
        rating: 4.8,
        sellerId: 'seller1'
      },
      {
        id: '9',
        name: 'High Protein Dairy Feed',
        description: 'Specially formulated for dairy cows. Rich in protein to enhance milk quality and quantity.',
        price: 52.00,
        quantity: 30,
        category: 'cow-food',
        seller: 'DairyNutrition Co.',
        rating: 4.9,
        sellerId: 'seller6'
      },
      {
        id: '10',
        name: 'Mineral Supplement for Cattle',
        description: 'Essential mineral mix for cattle health. Contains calcium, phosphorus, and trace elements.',
        price: 38.50,
        quantity: 40,
        category: 'cow-food',
        seller: 'LiveStock Plus',
        rating: 4.6,
        sellerId: 'seller1'
      },
      {
        id: '11',
        name: 'Silage Enhancer',
        description: 'Improves silage quality and palatability. Helps preserve nutrients in stored feed.',
        price: 29.99,
        quantity: 35,
        category: 'cow-food',
        seller: 'FeedTech Solutions',
        rating: 4.4,
        sellerId: 'seller7'
      }
    ];
    setProducts(sampleProducts);

    // Load cart and orders from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    // Save orders to localStorage whenever it changes
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

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
    setCart(prev => prev.filter(item => item.productId !== id));
  };

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.productId === productId);
      if (existingItem) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (orderData: Omit<Order, 'id' | 'orderDate' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      orderDate: new Date().toISOString(),
      status: 'pending'
    };

    // Update product quantities
    orderData.products.forEach(orderProduct => {
      setProducts(prev =>
        prev.map(product =>
          product.id === orderProduct.productId
            ? { ...product, quantity: Math.max(0, product.quantity - orderProduct.quantity) }
            : product
        )
      );
    });

    setOrders(prev => [...prev, newOrder]);
    clearCart();
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
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
      updateCartQuantity,
      clearCart,
      orders,
      placeOrder,
      updateOrderStatus
    }}>
      {children}
    </ProductContext.Provider>
  );
};
