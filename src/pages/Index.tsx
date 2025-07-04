
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, ShoppingCart, Users, Star, Truck, Shield, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-green-800">AgriMarket</h1>
              <p className="text-sm text-green-600">Connecting Farmers & Buyers</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.user_metadata?.name || user.email}</span>
                <Link to={user.user_metadata?.role === 'seller' ? '/seller-dashboard' : '/buyer-dashboard'}>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Go to Dashboard
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold text-gray-800 mb-6">
              Revolutionizing Agricultural Commerce
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Connect directly with farmers and agricultural suppliers. Find quality fertilizers, 
              pesticides, cattle feed, and more at competitive prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register?role=buyer">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 px-8 py-3">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Start Buying
                </Button>
              </Link>
              <Link to="/register?role=seller">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 py-3">
                  <Users className="w-5 h-5 mr-2" />
                  Start Selling
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Why Choose AgriMarket?</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We provide a comprehensive platform that makes agricultural commerce simple, secure, and efficient.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Trusted Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Secure transactions with verified sellers and quality-assured products for your peace of mind.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-800">Fast Delivery</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Quick and reliable delivery service to get your agricultural supplies when you need them.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-purple-600" />
                </div>
                <CardTitle className="text-purple-800">Quality Products</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Premium fertilizers, pesticides, and cattle feed from trusted agricultural suppliers.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Preview */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Popular Products</h3>
            <p className="text-gray-600">Discover our most sought-after agricultural supplies</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="w-fit mb-2">Fertilizers</Badge>
                <CardTitle>Premium NPK Fertilizer</CardTitle>
                <CardDescription>Complete nutrition for all crops</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$35.99</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">(4.8)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="w-fit mb-2">Pesticides</Badge>
                <CardTitle>Organic Neem Oil</CardTitle>
                <CardDescription>Natural pest control solution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$22.00</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">(4.7)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Badge className="w-fit mb-2">Cattle Feed</Badge>
                <CardTitle>Premium Dairy Feed</CardTitle>
                <CardDescription>High protein feed for dairy cows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">$52.00</span>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">(4.9)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Agricultural Business?
            </h3>
            <p className="text-xl text-green-100 mb-8">
              Join thousands of farmers and buyers who trust AgriMarket for their agricultural needs.
            </p>
            <Link to="/auth">
              <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">AgriMarket</span>
              </div>
              <p className="text-gray-400">
                Connecting farmers and buyers for a sustainable agricultural future.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Buyers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register?role=buyer" className="hover:text-white">Browse Products</Link></li>
                <li><Link to="/login" className="hover:text-white">Sign In</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">For Sellers</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/register?role=seller" className="hover:text-white">Start Selling</Link></li>
                <li><Link to="/login" className="hover:text-white">Seller Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 AgriMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
