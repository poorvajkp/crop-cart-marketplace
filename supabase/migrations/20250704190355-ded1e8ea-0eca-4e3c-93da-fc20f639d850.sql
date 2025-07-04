
-- Create a function to atomically reduce product quantity
CREATE OR REPLACE FUNCTION public.reduce_product_quantity(product_id UUID, quantity_to_reduce INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products 
  SET quantity = quantity - quantity_to_reduce
  WHERE id = product_id AND quantity >= quantity_to_reduce;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Insufficient stock or product not found for product ID: %', product_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
