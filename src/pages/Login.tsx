
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, ShoppingCart, Store } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'buyer' | 'seller' | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose whether you want to login as a buyer or seller.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      localStorage.setItem('user', JSON.stringify({ 
        email, 
        role: selectedRole,
        name: email.split('@')[0]
      }));
      
      toast({
        title: "Login Successful",
        description: `Welcome back! Redirecting to ${selectedRole} dashboard...`,
      });
      
      setTimeout(() => {
        navigate(selectedRole === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
      }, 1000);
      
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center text-green-600 hover:text-green-800 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
        
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-green-800">Welcome Back</CardTitle>
            <CardDescription className="text-green-600">
              Sign in to your AgriMarket account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedRole ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-center text-gray-700 mb-4">
                  Choose your role
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setSelectedRole('buyer')}
                    className="h-24 flex flex-col items-center justify-center bg-blue-600 hover:bg-blue-700"
                  >
                    <ShoppingCart className="w-8 h-8 mb-2" />
                    <span>Buyer</span>
                    <span className="text-xs opacity-80">Buy Products</span>
                  </Button>
                  <Button
                    onClick={() => setSelectedRole('seller')}
                    className="h-24 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700"
                  >
                    <Store className="w-8 h-8 mb-2" />
                    <span>Seller</span>
                    <span className="text-xs opacity-80">Sell Products</span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <div className="flex items-center">
                    {selectedRole === 'buyer' ? (
                      <ShoppingCart className="w-5 h-5 text-blue-600 mr-2" />
                    ) : (
                      <Store className="w-5 h-5 text-green-600 mr-2" />
                    )}
                    <span className="font-medium capitalize">{selectedRole} Login</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedRole(null)}
                  >
                    Change
                  </Button>
                </div>
                
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-green-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      required
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password" className="text-green-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className={`w-full ${selectedRole === 'buyer' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-600 hover:bg-green-700'}`}
                    disabled={loading}
                  >
                    {loading ? 'Signing In...' : `Sign In as ${selectedRole}`}
                  </Button>
                </form>
              </>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-green-700">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-800 font-semibold">
                  Register here
                </Link>
              </p>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Demo: Use any email and password to login
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
