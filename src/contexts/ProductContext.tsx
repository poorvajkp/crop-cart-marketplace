
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  seller: string;
  rating: number;
  image?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }: { children: React.ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedProducts: Product[] = (data || []).map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: parseFloat(product.price),
        quantity: product.quantity,
        category: product.category,
        seller: product.seller_name || 'Unknown Seller',
        rating: parseFloat(product.rating || '0'),
        image: product.image_url || undefined
      }));

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCart = async () => {
    if (!user) {
      setCart([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems: CartItem[] = (data || []).map(item => ({
        productId: item.product_id,
        quantity: item.quantity
      }));

      setCart(cartItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to add items to cart",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user.id,
          product_id: productId,
          quantity: 1
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      });
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      });
    }
  };

  const updateCartQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error('Error updating cart quantity:', error);
      toast({
        title: "Error",
        description: "Failed to update cart quantity",
        variant: "destructive"
      });
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [user]);

  return (
    <ProductContext.Provider value={{
      products,
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      fetchProducts,
      fetchCart
    }}>
      {children}
    </ProductContext.Provider>
  );
};
