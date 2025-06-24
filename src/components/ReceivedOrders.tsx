
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from '@/contexts/ProductContext';
import { useToast } from "@/hooks/use-toast";
import { Package, Clock, CheckCircle, XCircle, User } from 'lucide-react';

const ReceivedOrders = () => {
  const { orders, updateOrderStatus } = useProducts();
  const { toast } = useToast();
  
  // Get current user
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;
  
  // Filter orders that contain products from current seller
  const myReceivedOrders = orders.filter(order => 
    order.products.some(product => 
      product.sellerId === user?.email || product.seller === user?.name
    )
  );

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    updateOrderStatus(orderId, newStatus as any);
    toast({
      title: "Order Status Updated",
      description: `Order has been marked as ${newStatus}`,
    });
  };

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

  if (myReceivedOrders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">No Orders Received</h3>
        <p className="text-gray-500">Orders for your products will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Orders Received</h2>
      
      <div className="space-y-4">
        {myReceivedOrders.map((order) => {
          // Filter products that belong to current seller
          const myProducts = order.products.filter(product => 
            product.sellerId === user?.email || product.seller === user?.name
          );
          const myOrderTotal = myProducts.reduce((sum, product) => sum + (product.price * product.quantity), 0);
          
          return (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                      <User className="w-4 h-4" />
                      <span>{order.buyerName} ({order.buyerEmail})</span>
                    </div>
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
                    <h4 className="font-semibold mb-2">Your Products in this Order:</h4>
                    {myProducts.map((product, index) => (
                      <div key={index} className="flex justify-between text-sm mb-1">
                        <span>{product.productName} x {product.quantity}</span>
                        <span>${(product.price * product.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-semibold">Your Earnings:</span>
                    <span className="font-bold text-green-600">${myOrderTotal.toFixed(2)}</span>
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
                  
                  <div className="flex items-center gap-4 pt-3 border-t">
                    <span className="font-medium">Update Status:</span>
                    <Select
                      value={order.status}
                      onValueChange={(value) => handleStatusUpdate(order.id, value)}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ReceivedOrders;
