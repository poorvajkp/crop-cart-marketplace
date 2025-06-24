
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from '@/contexts/ProductContext';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

const Orders = () => {
  const { orders } = useProducts();
  
  // Get current user
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  // Filter orders for current buyer
  const myOrders = orders.filter(order => order.buyerId === user?.email);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'confirmed': return 'bg-blue-500';
      case 'delivered': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <Package className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  if (myOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Yet</h3>
        <p className="text-gray-500">Your orders will appear here after you make a purchase</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">My Orders</h2>
      
      <div className="space-y-4">
        {myOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <Badge className={`${getStatusColor(order.status)} text-white`}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(order.status)}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Items:</h4>
                  {order.products.map((product, index) => (
                    <div key={index} className="flex justify-between text-sm mb-1">
                      <span>{product.productName} x {product.quantity}</span>
                      <span>${(product.price * product.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="font-semibold">Total Amount:</span>
                  <span className="font-bold text-green-600">${order.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <p className="text-gray-600 capitalize">{order.paymentMethod}</p>
                  </div>
                  <div>
                    <span className="font-medium">Delivery Time:</span>
                    <p className="text-gray-600">{order.deliveryTime}</p>
                  </div>
                </div>
                
                <div>
                  <span className="font-medium">Delivery Address:</span>
                  <p className="text-gray-600 text-sm">{order.deliveryAddress}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Orders;
