
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { X, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import Checkout from './Checkout';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Cart = () => {
  const { products, cart, removeFromCart, updateCartQuantity, clearCart } = useProducts();
  const [showCheckout, setShowCheckout] = useState(false);

  const cartItems = cart.map(cartItem => {
    const product = products.find(p => p.id === cartItem.productId);
    return product ? { ...product, cartQuantity: cartItem.quantity } : null;
  }).filter(Boolean);

  const total = cartItems.reduce((sum, item) => sum + (item!.price * item!.cartQuantity), 0);

  const updateQuantity = (productId: string, newQuantity: number) => {
    const product = products.find(p => p.id === productId);
    if (product && newQuantity <= product.quantity) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  if (showCheckout) {
    return (
      <Sheet open={true} onOpenChange={() => setShowCheckout(false)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Checkout</SheetTitle>
            <SheetDescription>
              Complete your order details
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6">
            <Checkout onClose={() => setShowCheckout(false)} />
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="relative">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {cart.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              {cartItems.map((item) => (
                <Card key={item!.id} className="p-3">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item!.name}</h4>
                      <p className="text-xs text-gray-600 mb-1">{item!.seller}</p>
                      <div className="text-green-600 font-bold">${item!.price}</div>
                      <p className="text-xs text-gray-500">Stock: {item!.quantity}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromCart(item!.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item!.id, item!.cartQuantity - 1)}
                        disabled={item!.cartQuantity <= 1}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <Input
                        type="number"
                        value={item!.cartQuantity}
                        onChange={(e) => updateQuantity(item!.id, parseInt(e.target.value) || 1)}
                        className="w-16 text-center"
                        min="1"
                        max={item!.quantity}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item!.id, item!.cartQuantity + 1)}
                        disabled={item!.cartQuantity >= item!.quantity}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-sm font-semibold">
                      ${(item!.price * item!.cartQuantity).toFixed(2)}
                    </div>
                  </div>
                </Card>
              ))}
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg text-green-600">${total.toFixed(2)}</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    onClick={() => setShowCheckout(true)}
                  >
                    Proceed to Checkout
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
