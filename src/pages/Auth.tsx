
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',  
    confirmPassword: '',
    name: '',
    role: 'buyer'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signIn, user } = useAuth();

  useEffect(() => {
    if (user) {
      // Redirect authenticated users to appropriate dashboard
      const userRole = user.user_metadata?.role || 'buyer';
      console.log('User authenticated, redirecting to:', userRole === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
      navigate(userRole === 'seller' ? '/seller-dashboard' : '/buyer-dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSignUp && formData.password !== formData.confirmPassword) {
      return;
    }
    
    setLoading(true);
    
    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.name, formData.role);
        if (!result.error) {
          // Stay on auth page for sign up to show success message
          setLoading(false);
          return;
        }
      } else {
        result = await signIn(formData.email, formData.password);
        if (!result.error) {
          // Redirect will happen via useEffect when user state changes
          setLoading(false);
          return;
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
            <CardTitle className="text-2xl text-green-800">
              {isSignUp ? 'Join AgriMarket' : 'Welcome Back'}
            </CardTitle>
            <CardDescription className="text-green-600">
              {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <>
                  <div>
                    <Label htmlFor="name" className="text-green-700">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your full name"
                      required
                      className="border-green-200 focus:border-green-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-green-700">I want to</Label>
                    <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                      <SelectTrigger className="border-green-200 focus:border-green-400">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="seller">Sell agricultural products</SelectItem>
                        <SelectItem value="buyer">Buy agricultural products</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="email" className="text-green-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="border-green-200 focus:border-green-400"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-green-700">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={isSignUp ? "Create a password" : "Enter your password"}
                    required
                    minLength={6}
                    className="border-green-200 focus:border-green-400 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>
              
              {isSignUp && (
                <div>
                  <Label htmlFor="confirmPassword" className="text-green-700">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                    className="border-green-200 focus:border-green-400"
                  />
                  {isSignUp && formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">Passwords do not match</p>
                  )}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={loading || (isSignUp && formData.password !== formData.confirmPassword)}
              >
                {loading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-green-700">
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-green-600 hover:text-green-800 font-semibold underline"
                >
                  {isSignUp ? 'Sign in here' : 'Sign up here'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
