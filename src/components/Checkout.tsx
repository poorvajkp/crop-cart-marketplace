
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from '@/contexts/ProductContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { CreditCard, MapPin, Clock } from 'lucide-react';

interface CheckoutProps {
  onClose: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ onClose }) => {
  const { products, cart, placeOrder } = useProducts();
  const { user } = useAuth();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Payment method specific fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [ifscCode, setIfscCode] = useState('');

  useEffect(() => {
    // Pre-fill delivery address from user profile if available
    if (user?.user_metadata) {
      const metadata = user.user_metadata;
      if (metadata.address || metadata.city || metadata.state || metadata.zipCode) {
        const fullAddress = `${metadata.address || ''}, ${metadata.city || ''}, ${metadata.state || ''} - ${metadata.zipCode || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*|,\s*$/g, '');
        setDeliveryAddress(fullAddress);
      }
    }
  }, [user]);

  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return product ? { ...product, cartQuantity: cartItem.quantity } : null;
  }).filter(Boolean);

  const total = cartItems.reduce((sum, item) => sum + (item!.price * item!.cartQuantity), 0);

  const validatePaymentMethod = () => {
    switch (paymentMethod) {
      case 'card':
        if (!cardNumber || !expiryDate || !cvv || !cardName) {
          toast({
            title: "Incomplete Card Details",
            description: "Please fill in all card information.",
            variant: "destructive"
          });
          return false;
        }
        if (cardNumber.length < 16) {
          toast({
            title: "Invalid Card Number",
            description: "Card number must be 16 digits.",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 'upi':
        if (!upiId) {
          toast({
            title: "Missing UPI ID",
            description: "Please enter your UPI ID.",
            variant: "destructive"
          });
          return false;
        }
        if (!upiId.includes('@')) {
          toast({
            title: "Invalid UPI ID",
            description: "Please enter a valid UPI ID (e.g., user@paytm).",
            variant: "destructive"
          });
          return false;
        }
        break;
      case 'bank':
        if (!bankAccount || !ifscCode) {
          toast({
            title: "Incomplete Bank Details",
            description: "Please fill in all bank information.",
            variant: "destructive"
          });
          return false;
        }
        break;
    }
    return true;
  };

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

    if (!validatePaymentMethod()) {
      return;
    }

    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to place an order.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const orderProducts = cartItems.map(item => ({
        productId: item!.id,
        productName: item!.name,
        quantity: item!.cartQuantity,
        price: item!.price,
        seller: item!.seller,
        sellerId: item!.sellerId
      }));

      await placeOrder({
        buyerId: user.id,
        buyerName: user.user_metadata?.name || user.email || 'Unknown',
        buyerEmail: user.email || '',
        products: orderProducts,
        totalAmount: total,
        paymentMethod,
        deliveryAddress,
        deliveryTime: "Within 1 hour"
      });

      onClose();
    } catch (error) {
      console.error('Order placement error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPaymentFields = () => {
    switch (paymentMethod) {
      case 'card':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="cardName">Cardholder Name</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                  setCardNumber(value);
                }}
                maxLength={16}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    if (value.length >= 2) {
                      value = value.substring(0, 2) + '/' + value.substring(2, 4);
                    }
                    setExpiryDate(value);
                  }}
                  maxLength={5}
                  required
                />
              </div>
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                  maxLength={3}
                  required
                />
              </div>
            </div>
          </div>
        );
      case 'upi':
        return (
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              placeholder="user@paytm"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter your UPI ID (e.g., user@paytm, user@googlepay)</p>
          </div>
        );
      case 'bank':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="bankAccount">Bank Account Number</Label>
              <Input
                id="bankAccount"
                placeholder="1234567890"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="ifscCode">IFSC Code</Label>
              <Input
                id="ifscCode"
                placeholder="SBIN0001234"
                value={ifscCode}
                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                required
              />
            </div>
          </div>
        );
      default:
        return null;
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
          <CardContent className="space-y-4">
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
            
            {renderPaymentFields()}
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
