
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product, CartItem, Order } from '@/types/product';
import { User } from '@supabase/supabase-js';

export const useDataFetching = (user: User | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
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
      console.log('Fetching orders for user:', user.id);
      
      // Get orders where user is the buyer
      const { data: buyerOrders, error: buyerError } = await supabase
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
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (buyerError) {
        console.error('Error fetching buyer orders:', buyerError);
        throw buyerError;
      }

      // Get orders that contain products from current seller
      const { data: sellerOrderItems, error: sellerError } = await supabase
        .from('order_items')
        .select(`
          order_id,
          orders!inner (
            id,
            user_id,
            buyer_name,
            buyer_email,
            total_amount,
            payment_method,
            delivery_address,
            delivery_time,
            status,
            created_at
          )
        `)
        .eq('seller_id', user.id);

      if (sellerError) {
        console.error('Error fetching seller orders:', sellerError);
      }

      // Get full order details for seller orders
      const sellerOrderIds = sellerOrderItems?.map(item => item.order_id) || [];
      let sellerOrders: any[] = [];
      
      if (sellerOrderIds.length > 0) {
        const { data: sellerOrdersData, error: sellerOrdersError } = await supabase
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
          .in('id', sellerOrderIds)
          .order('created_at', { ascending: false });

        if (sellerOrdersError) {
          console.error('Error fetching seller order details:', sellerOrdersError);
        } else {
          sellerOrders = sellerOrdersData || [];
        }
      }

      // Combine and deduplicate orders
      const allOrders = [...(buyerOrders || []), ...sellerOrders];
      const uniqueOrders = allOrders.filter((order, index, self) => 
        index === self.findIndex(o => o.id === order.id)
      );

      const mappedOrders: Order[] = uniqueOrders.map(order => ({
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

      console.log('Mapped orders:', mappedOrders);
      setOrders(mappedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive"
      });
    }
  };

  return {
    products,
    cart,
    orders,
    loading,
    fetchProducts,
    fetchCart,
    fetchOrders
  };
};
