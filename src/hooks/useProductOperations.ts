
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { User } from '@supabase/supabase-js';

export const useProductOperations = (
  user: User | null,
  fetchProducts: () => Promise<void>
) => {
  const { toast } = useToast();

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

  return {
    addProduct,
    deleteProduct
  };
};
