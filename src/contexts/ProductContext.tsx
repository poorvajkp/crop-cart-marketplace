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
  sellerId?: string;
  rating: number;
  image?: string;
}

interface CartItem {
  productId: string;
  quantity: number;
}

interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  seller: string;
  sellerId?: string;
}

interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryTime: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

interface PlaceOrderData {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryTime: string;
}

interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  placeOrder: (orderData: PlaceOrderData) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  fetchOrders: () => Promise<void>;
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
  const [orders, setOrders] = useState<Order[]>([]);
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
        price: parseFloat(product.price.toString()),
        quantity: product.quantity,
        category: product.category,
        seller: product.seller_name || 'Unknown Seller',
        sellerId: product.seller_id,
        rating: parseFloat((product.rating || '0').toString()),
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

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      return;
    }

    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            product_id,
            product_name,
            quantity,
            price,
            seller_id,
            seller_name
          )
        `)
        .or(`user_id.eq.${user.id},order_items.seller_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const mappedOrders: Order[] = (ordersData || []).map(order => ({
        id: order.id,
        buyerId: order.user_id,
        buyerName: order.buyer_name || '',
        buyerEmail: order.buyer_email || '',
        products: order.order_items.map((item: any) => ({
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
          price: parseFloat(item.price.toString()),
          seller: item.seller_name || '',
          sellerId: item.seller_id
        })),
        totalAmount: parseFloat(order.total_amount.toString()),
        paymentMethod: order.payment_method,
        deliveryAddress: order.delivery_address,
        deliveryTime: order.delivery_time || '',
        orderDate: order.created_at,
        status: order.status as Order['status']
      }));

      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          category: product.category,
          seller_id: user.id,
          seller_name: product.seller,
          rating: product.rating,
          image_url: product.image
        });

      if (error) throw error;

      await fetchProducts();
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', user.id);

      if (error) throw error;

      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive"
      });
    }
  };

  const placeOrder = async (orderData: PlaceOrderData) => {
    if (!user) return;

    try {
      // Start a transaction-like operation
      console.log('Starting order placement process...');

      // Check inventory before placing order
      const inventoryChecks = await Promise.all(
        orderData.products.map(async (product) => {
          const { data, error } = await supabase
            .from('products')
            .select('quantity')
            .eq('id', product.productId)
            .single();

          if (error) throw error;
          
          if (data.quantity < product.quantity) {
            throw new Error(`Insufficient stock for ${product.productName}. Available: ${data.quantity}, Requested: ${product.quantity}`);
          }
          
          return { productId: product.productId, availableQuantity: data.quantity };
        })
      );

      console.log('Inventory checks passed:', inventoryChecks);

      // Create order
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          buyer_name: orderData.buyerName,
          buyer_email: orderData.buyerEmail,
          total_amount: orderData.totalAmount,
          payment_method: orderData.paymentMethod,
          delivery_address: orderData.deliveryAddress,
          delivery_time: orderData.deliveryTime,
          status: 'pending'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      console.log('Order created:', orderResult);

      // Create order items
      const orderItems = orderData.products.map(product => ({
        order_id: orderResult.id,
        product_id: product.productId,
        product_name: product.productName,
        quantity: product.quantity,
        price: product.price,
        seller_id: product.sellerId,
        seller_name: product.seller
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log('Order items created');

      // Update product quantities (deduct inventory)
      const inventoryUpdates = await Promise.all(
        orderData.products.map(async (product) => {
          const { error } = await supabase
            .from('products')
            .update({ 
              quantity: supabase.raw(`quantity - ${product.quantity}`)
            })
            .eq('id', product.productId)
            .gte('quantity', product.quantity); // Ensure we don't go negative

          if (error) {
            console.error(`Failed to update inventory for product ${product.productId}:`, error);
            throw error;
          }

          return product.productId;
        })
      );

      console.log('Inventory updated for products:', inventoryUpdates);

      // Clear cart after successful order
      await clearCart();
      
      // Refresh data
      await Promise.all([fetchOrders(), fetchProducts()]);

      console.log('Order placement completed successfully');

      toast({
        title: "Order Placed Successfully",
        description: "Your order has been placed and inventory has been updated.",
      });
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive"
      });
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;

      await fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
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
      fetchOrders();
    } else {
      setCart([]);
      setOrders([]);
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
