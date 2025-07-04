
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PlaceOrderData, Order } from '@/types/product';
import { User } from '@supabase/supabase-js';

export const useOrderOperations = (
  user: User | null,
  fetchOrders: () => Promise<void>,
  fetchProducts: () => Promise<void>,
  clearCart: () => Promise<void>
) => {
  const { toast } = useToast();

  const placeOrder = async (orderData: PlaceOrderData) => {
    if (!user) {
      console.error('No user found for order placement');
      throw new Error('User not authenticated');
    }

    try {
      console.log('Starting order placement process...');
      console.log('Order data:', orderData);

      // Check inventory before placing order
      const inventoryChecks = await Promise.all(
        orderData.products.map(async (product) => {
          const { data, error } = await supabase
            .from('products')
            .select('quantity')
            .eq('id', product.productId)
            .single();

          if (error) {
            console.error(`Error checking inventory for ${product.productId}:`, error);
            throw error;
          }
          
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

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

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

      if (itemsError) {
        console.error('Error creating order items:', itemsError);
        throw itemsError;
      }

      console.log('Order items created');

      // Update product quantities using RPC function for atomic updates
      for (const product of orderData.products) {
        console.log(`Updating inventory for product ${product.productId}: reducing by ${product.quantity}`);
        
        const { error: updateError } = await supabase.rpc('reduce_product_quantity', {
          product_id: product.productId,
          quantity_to_reduce: product.quantity
        });

        if (updateError) {
          console.error(`Failed to update inventory for product ${product.productId}:`, updateError);
          throw new Error(`Failed to update inventory for ${product.productName}: ${updateError.message}`);
        }
      }

      console.log('Inventory updated successfully');

      // Clear cart after successful order
      await clearCart();
      
      // Refresh data
      await Promise.all([fetchOrders(), fetchProducts()]);

      console.log('Order placement completed successfully');

    } catch (error) {
      console.error('Error placing order:', error);
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

  return {
    placeOrder,
    updateOrderStatus
  };
};
