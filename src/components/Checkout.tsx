
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from '@/contexts/ProductContext';
import { useToast } from "@/hooks/use-toast";
import { CreditCard, MapPin, Clock } from 'lucide-react';

interface CheckoutProps {
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
  const { products, cart, placeOrder } = useProducts();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return product ? { ...product, cartQuantity: cartItem.quantity } : null;
  }).filter(Boolean);

  const total = cartItems.reduce((sum, item) => sum + (item!.price * item!.cartQuantity), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentMethod || !deliveryAddress) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Get current user data
    const userData = localStorage.getItem('user');
    if (!userData) {
      toast({
        title: "Error",
        description: "Please log in to place an order.",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    const user = JSON.parse(userData);

    try {
      // Create order data
      const orderProducts = cartItems.map(item => ({
        productId: item!.id,
        productName: item!.name,
        quantity: item!.cartQuantity,
        price: item!.price,
        seller: item!.seller,
        sellerId: item!.sellerId
      }));

      await placeOrder({
        buyerId: user.email,
        buyerName: user.name,
        buyerEmail: user.email,
        products: orderProducts,
        totalAmount: total,
        paymentMethod,
        deliveryAddress,
        deliveryTime: "Within 1 hour"
      });

      toast({
        title: "Order Placed Successfully!",
        description: "Your order will be delivered within 1 hour.",
      });

      onClose();
    } catch (error) {
      toast({
        title: "Order Failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            {cartItems.map((item) => (
              <div key={item!.id} className="flex justify-between text-sm">
                <span>{item!.name} x {item!.cartQuantity}</span>
                <span>${(item!.price * item!.cartQuantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-green-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash on Delivery</SelectItem>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="upi">UPI Payment</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Delivery Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Enter your complete delivery address"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              required
              rows={3}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Delivery Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Your order will be delivered within 1 hour of confirmation.
            </p>
          </CardContent>
        </Card>

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Placing Order...' : 'Place Order'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
