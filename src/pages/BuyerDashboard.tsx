
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import Cart from '@/components/Cart';
import Orders from '@/components/Orders';
import UserProfile from '@/components/UserProfile';

const BuyerDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, cart, addToCart, removeFromCart, loading } = useProducts();
  const { user, signOut } = useAuth();

  React.useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if user role is buyer
    const userRole = user.user_metadata?.role;
    if (userRole === 'seller') {
      navigate('/seller-dashboard');
      return;
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleCartAction = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    if (product.quantity === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently out of stock.",
        variant: "destructive"
      });
      return;
    }

    if (cart.some(item => item.productId === productId)) {
      await removeFromCart(productId);
      toast({
        title: "Removed from Cart",
        description: "Product has been removed from your cart.",
      });
    } else {
      await addToCart(productId);
      toast({
        title: "Added to Cart",
        description: "Product has been added to your cart.",
      });
    }
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

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading buyer dashboard...</p>
        </div>
      </div>
    );
  }

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
            <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.name || user.email}</span>
            <Cart />
            <UserProfile />
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Browse Products</TabsTrigger>
            <TabsTrigger value="orders">My Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
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
                <Card key={product.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  {product.image && (
                    <div className="w-full h-48 overflow-hidden rounded-t-lg">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {product.category.replace('-', ' ')}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating || 0)}
                        <span className="text-sm text-gray-600 ml-1">({product.rating || 0})</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription className="text-sm text-gray-600">
                      Sold by: {product.seller}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-gray-700 mb-4 min-h-[2.5rem]">
                      {truncateText(product.description, 80)}
                    </p>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          ${product.price}
                        </div>
                        <div className={`text-sm ${product.quantity === 0 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} units available`}
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleCartAction(product.id)}
                      disabled={product.quantity === 0}
                      className={`w-full ${
                        product.quantity === 0 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : cart.some(item => item.productId === product.id) 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {product.quantity === 0 
                        ? 'Out of Stock' 
                        : cart.some(item => item.productId === product.id) 
                          ? 'Remove from Cart' 
                          : 'Add to Cart'
                      }
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
          </TabsContent>

          <TabsContent value="orders">
            <Orders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
