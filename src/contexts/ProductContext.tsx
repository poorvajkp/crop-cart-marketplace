
import React, { createContext, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { ProductContextType } from '@/types/productContext';
import { useDataFetching } from '@/hooks/useDataFetching';
import { useProductOperations } from '@/hooks/useProductOperations';
import { useCartOperations } from '@/hooks/useCartOperations';
import { useOrderOperations } from '@/hooks/useOrderOperations';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  
  // Data fetching hook
  const {
    products,
    cart,
    orders,
    loading,
    fetchProducts,
    fetchCart,
    fetchOrders
  } = useDataFetching(user);

  // Cart operations hook
  const {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
  } = useCartOperations(user, fetchCart);

  // Product operations hook
  const {
    addProduct,
    deleteProduct
  } = useProductOperations(user, fetchProducts);

  // Order operations hook
  const {
    placeOrder,
    updateOrderStatus
  } = useOrderOperations(user, fetchOrders, fetchProducts, clearCart);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
      fetchOrders();
    }
  }, [user]);

  return (
    <ProductContext.Provider value={{
      products,
      cart,
      orders,
      loading,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      fetchProducts,
      fetchCart,
      addProduct,
      deleteProduct,
      placeOrder,
      updateOrderStatus,
      fetchOrders
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// Re-export types for backward compatibility
export type { Product, CartItem, Order, OrderProduct, PlaceOrderData } from '@/types/product';
