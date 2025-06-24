
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Plus } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-md border-b border-green-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">AM</span>
            </div>
            <h1 className="text-2xl font-bold text-green-800">AgriMarket</h1>
          </div>
          <div className="flex space-x-3">
            <Link to="/login">
              <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                <User className="w-4 h-4 mr-2" />
                Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-5xl font-bold text-green-800 mb-6">
          Agricultural Products Marketplace
        </h2>
        <p className="text-xl text-green-700 mb-8 max-w-2xl mx-auto">
          Connect farmers and buyers in one platform. Discover quality fertilizers, pesticides, and cattle feed from trusted sellers.
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
          {/* Seller Card */}
          <Card className="border-2 border-green-200 hover:border-green-400 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-green-800">I'm a Seller</CardTitle>
              <CardDescription className="text-green-600">
                List your agricultural products and reach buyers nationwide
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-green-700">
                <li>• Add and manage your products</li>
                <li>• Track orders and inventory</li>
                <li>• Connect with buyers directly</li>
                <li>• Build your agricultural business</li>
              </ul>
              <Link to="/register?role=seller">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Selling
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Buyer Card */}
          <Card className="border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 hover:shadow-lg">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl text-blue-800">I'm a Buyer</CardTitle>
              <CardDescription className="text-blue-600">
                Find quality agricultural products from verified sellers
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <ul className="text-left space-y-2 mb-6 text-blue-700">
                <li>• Browse quality products</li>
                <li>• Compare prices and sellers</li>
                <li>• Secure ordering system</li>
                <li>• Track your orders</li>
              </ul>
              <Link to="/register?role=buyer">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center text-green-800 mb-12">
            Product Categories
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">Fertilizers</h4>
              <p className="text-green-600">Organic and chemical fertilizers for optimal crop growth</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🛡️</span>
              </div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">Pesticides</h4>
              <p className="text-green-600">Safe and effective pest control solutions</p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-brown-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🐄</span>
              </div>
              <h4 className="text-xl font-semibold text-green-800 mb-2">Cattle Feed</h4>
              <p className="text-green-600">Nutritious feed and supplements for livestock</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-green-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">AgriMarket</h3>
          <p className="text-green-200">Connecting agriculture, one product at a time.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
