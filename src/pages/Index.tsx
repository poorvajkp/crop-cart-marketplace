
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Store, Users, Leaf, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
            <h1 className="text-xl font-bold text-green-800">AgriMarket</h1>
          </div>
          <div className="flex space-x-4">
            <Link to="/auth">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold text-green-900 mb-6">
              Connect Farmers with
              <span className="text-green-600"> Quality Products</span>
            </h2>
            <p className="text-xl text-green-700 mb-8 leading-relaxed">
              AgriMarket bridges the gap between agricultural suppliers and farmers, 
              providing a seamless platform for buying and selling quality farming products.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3">
                  Start Buying <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 text-lg px-8 py-3">
                  Start Selling <Store className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-green-900 mb-12">
            Why Choose AgriMarket?
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Easy Shopping</CardTitle>
                <CardDescription className="text-green-600">
                  Browse and purchase agricultural products with just a few clicks
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Trusted Sellers</CardTitle>
                <CardDescription className="text-green-600">
                  Connect with verified agricultural suppliers and quality vendors
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Quality Products</CardTitle>
                <CardDescription className="text-green-600">
                  Access to premium fertilizers, pesticides, and cattle feed
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center text-green-900 mb-12">
            Product Categories
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-green-100 text-green-800">Fertilizers</Badge>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Premium Fertilizers</CardTitle>
                <CardDescription className="text-green-600">
                  Urea, Phosphorus, Potassium, and NPK complete fertilizers for optimal crop growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Starting from <span className="font-bold text-green-600">$25.99</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-blue-100 text-blue-800">Pesticides</Badge>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Crop Protection</CardTitle>
                <CardDescription className="text-green-600">
                  Bio pesticides, neem oil, and copper fungicides for healthy crops
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Starting from <span className="font-bold text-green-600">$18.50</span>
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start mb-4">
                  <Badge className="bg-orange-100 text-orange-800">Cattle Feed</Badge>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <CardTitle className="text-green-800">Livestock Nutrition</CardTitle>
                <CardDescription className="text-green-600">
                  Premium cattle feed, dairy feed, and mineral supplements for healthy livestock
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Starting from <span className="font-bold text-green-600">$29.99</span>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-green-600 text-white">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Get Started?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of farmers and suppliers already using AgriMarket
          </p>
          <Link to="/auth">
            <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
              Create Your Account Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-900 text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
            <h1 className="text-xl font-bold">AgriMarket</h1>
          </div>
          <p className="text-green-200">
            Connecting agriculture, one product at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
