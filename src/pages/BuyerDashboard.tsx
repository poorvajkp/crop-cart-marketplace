
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ShoppingCart, Search, Star, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface Product {
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

const BuyerDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'buyer') {
      navigate('/seller-dashboard');
      return;
    }
    
    setUser(parsedUser);
    
    // Load sample products for demo
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Organic Fertilizer Premium',
        description: 'High-quality organic fertilizer for vegetable gardens. Rich in nutrients and eco-friendly.',
        price: 25.99,
        quantity: 50,
        category: 'fertilizers',
        seller: 'Green Farm Co.',
        rating: 4.5
      },
      {
        id: '2',
        name: 'Bio Pesticide Solution',
        description: 'Eco-friendly pesticide for crop protection without harmful chemicals.',
        price: 18.50,
        quantity: 30,
        category: 'pesticides',
        seller: 'EcoAgri Solutions',
        rating: 4.2
      },
      {
        id: '3',
        name: 'Premium Cattle Feed',
        description: 'Nutritious cattle feed with essential vitamins and minerals.',
        price: 45.00,
        quantity: 25,
        category: 'cow-food',
        seller: 'LiveStock Plus',
        rating: 4.8
      },
      {
        id: '4',
        name: 'NPK Fertilizer 20-20-20',
        description: 'Balanced NPK fertilizer suitable for all types of crops.',
        price: 32.75,
        quantity: 40,
        category: 'fertilizers',
        seller: 'Crop Masters',
        rating: 4.3
      },
      {
        id: '5',
        name: 'Fungicide Spray',
        description: 'Effective fungicide for preventing plant diseases.',
        price: 22.99,
        quantity: 35,
        category: 'pesticides',
        seller: 'Plant Protection Co.',
        rating: 4.1
      },
      {
        id: '6',
        name: 'Mineral Mix for Cattle',
        description: 'Essential mineral supplement for healthy cattle growth.',
        price: 28.50,
        quantity: 20,
        category: 'cow-food',
        seller: 'Dairy Best',
        rating: 4.6
      }
    ];
    setProducts(sampleProducts);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
    toast({
      title: "Added to Cart",
      description: "Product has been added to your cart.",
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
            <h1 className="text-xl font-bold text-blue-800">AgriMarket</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="outline" className="relative">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {cart.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </Badge>
                )}
              </Button>
            </div>
            <span className="text-sm text-gray-600">Welcome, {user.name}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Agricultural Products</h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fertilizers">Fertilizers</SelectItem>
                <SelectItem value="pesticides">Pesticides</SelectItem>
                <SelectItem value="cow-food">Cattle Feed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="capitalize">
                    {product.category.replace('-', ' ')}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {renderStars(product.rating)}
                    <span className="text-sm text-gray-600 ml-1">({product.rating})</span>
                  </div>
                </div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Sold by: {product.seller}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 mb-4">{product.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${product.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {product.quantity} units available
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => addToCart(product.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={cart.includes(product.id)}
                >
                  {cart.includes(product.id) ? 'Added to Cart' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
