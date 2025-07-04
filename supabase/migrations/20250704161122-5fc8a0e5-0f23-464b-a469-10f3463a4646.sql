
-- Create user profiles table to store additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  role TEXT DEFAULT 'buyer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart items table
CREATE TABLE public.cart_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  buyer_name TEXT,
  buyer_email TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  payment_method TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_time TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  seller_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  seller_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for products (public read, sellers can manage their own)
CREATE POLICY "Anyone can view products" ON public.products
  FOR SELECT USING (true);

CREATE POLICY "Sellers can insert their products" ON public.products
  FOR INSERT WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can update their products" ON public.products
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their products" ON public.products
  FOR DELETE USING (auth.uid() = seller_id);

-- RLS Policies for cart_items
CREATE POLICY "Users can view their own cart items" ON public.cart_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON public.cart_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON public.cart_items
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON public.cart_items
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Sellers can view orders containing their products" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.order_items oi 
      WHERE oi.order_id = orders.id AND oi.seller_id = auth.uid()
    )
  );

-- RLS Policies for order_items
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can view their order items" ON public.order_items
  FOR SELECT USING (auth.uid() = seller_id);

CREATE POLICY "Users can insert order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders o 
      WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
    )
  );

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample products into the products table
INSERT INTO public.products (name, description, price, quantity, category, seller_name, rating) VALUES
('Urea Fertilizer (46-0-0)', 'High nitrogen content fertilizer ideal for leafy vegetables and crop growth. Promotes healthy green foliage.', 25.99, 50, 'fertilizers', 'Green Farm Co.', 4.5),
('Phosphorus Fertilizer (0-46-0)', 'Essential for root development and flowering. Perfect for fruit trees and flowering plants.', 28.50, 40, 'fertilizers', 'AgriSupply Ltd.', 4.3),
('Potassium Fertilizer (0-0-60)', 'Enhances fruit quality and disease resistance. Ideal for fruit crops and vegetables.', 32.00, 35, 'fertilizers', 'Green Farm Co.', 4.6),
('NPK Complete Fertilizer (20-10-10)', 'Balanced nutrition for all-purpose use. Contains Nitrogen, Phosphorus, and Potassium.', 35.99, 45, 'fertilizers', 'FertilizerPro', 4.4),
('Bio Pesticide Solution', 'Eco-friendly pesticide for crop protection without harmful chemicals. Safe for organic farming.', 18.50, 30, 'pesticides', 'EcoAgri Solutions', 4.2),
('Neem Oil Pesticide', 'Natural pesticide derived from neem tree. Effective against aphids, whiteflies, and other pests.', 22.00, 25, 'pesticides', 'Organic Pest Control', 4.7),
('Copper Fungicide', 'Broad spectrum fungicide for preventing plant diseases. Suitable for fruits and vegetables.', 26.75, 20, 'pesticides', 'PlantProtect Inc.', 4.1),
('Premium Cattle Feed', 'Nutritious cattle feed with essential vitamins and minerals. Promotes healthy growth and milk production.', 45.00, 25, 'cow-food', 'LiveStock Plus', 4.8),
('High Protein Dairy Feed', 'Specially formulated for dairy cows. Rich in protein to enhance milk quality and quantity.', 52.00, 30, 'cow-food', 'DairyNutrition Co.', 4.9),
('Mineral Supplement for Cattle', 'Essential mineral mix for cattle health. Contains calcium, phosphorus, and trace elements.', 38.50, 40, 'cow-food', 'LiveStock Plus', 4.6),
('Silage Enhancer', 'Improves silage quality and palatability. Helps preserve nutrients in stored feed.', 29.99, 35, 'cow-food', 'FeedTech Solutions', 4.4);
