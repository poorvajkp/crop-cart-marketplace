
-- Drop the problematic RLS policy that's causing infinite recursion
DROP POLICY IF EXISTS "Sellers can view orders containing their products" ON public.orders;

-- Create a new policy that avoids recursion by directly checking order_items
CREATE POLICY "Sellers can view orders with their products" 
ON public.orders 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM public.order_items oi 
    WHERE oi.order_id = orders.id 
    AND oi.seller_id = auth.uid()
  )
);

-- Also need to allow sellers to update order status
CREATE POLICY "Sellers can update order status" 
ON public.orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM public.order_items oi 
    WHERE oi.order_id = orders.id 
    AND oi.seller_id = auth.uid()
  )
);
