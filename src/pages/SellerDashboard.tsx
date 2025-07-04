import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, ShoppingCart, Edit, Trash } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import ReceivedOrders from '@/components/ReceivedOrders';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, deleteProduct, orders } = useProducts();
  const { user, signOut } = useAuth();

  // Filter products to show only current seller's products
  const userProducts = products.filter(product => 
    user && (product.sellerId === user.id || product.seller === user.user_metadata?.name)
  );

  // Filter orders that contain current seller's products
  const receivedOrders = orders.filter(order => 
    order.products.some(product => 
      product.sellerId === user?.id || product.seller === user?.user_metadata?.name
    )
  );

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    // Check if user role is seller
    const userRole = user.user_metadata?.role;
    if (userRole !== 'seller') {
      toast({
        title: "Access Denied",
        description: "This dashboard is for sellers only. Redirecting to buyer dashboard...",
        variant: "destructive"
      });
      navigate('/buyer-dashboard');
      return;
    }
  }, [user, navigate, toast]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleDeleteProduct = (productId: string) => {
    deleteProduct(productId);
    toast({
      title: "Product Deleted",
      description: "Product has been removed from your listing.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading seller dashboard...</p>
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
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
            <h1 className="text-xl font-bold text-green-800">Seller Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.name || user.email}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{userProducts.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{receivedOrders.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                ${receivedOrders.reduce((total, order) => {
                  const myProducts = order.products.filter(product => 
                    product.sellerId === user?.id || product.seller === user?.user_metadata?.name
                  );
                  return total + myProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
                }, 0).toFixed(2)}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {userProducts.filter(p => p.quantity < 10).length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">My Products</TabsTrigger>
            <TabsTrigger value="orders">Orders Received</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            {/* Products Section */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">My Products</h2>
              <Link to="/add-product">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>

            {userProducts.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <div className="text-gray-400 mb-4">
                    <ShoppingCart className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">No Products Yet</h3>
                  <p className="text-gray-500 mb-6">Start by adding your first agricultural product</p>
                  <Link to="/add-product">
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userProducts.map((product) => (
                  <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    {product.image && (
                      <div className="w-full h-48 overflow-hidden rounded-t-lg">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <Badge variant="secondary" className="mb-2 capitalize">
                          {product.category.replace('-', ' ')}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            ${product.price}
                          </div>
                          <div className={`text-sm ${product.quantity === 0 ? 'text-red-500 font-medium' : product.quantity < 10 ? 'text-orange-500' : 'text-gray-500'}`}>
                            Stock: {product.quantity} units
                            {product.quantity === 0 && ' (Out of Stock)'}
                          </div>
                        </div>
                        {product.quantity < 10 && (
                          <Badge variant={product.quantity === 0 ? "destructive" : "secondary"}>
                            {product.quantity === 0 ? "Out of Stock" : "Low Stock"}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <ReceivedOrders />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
