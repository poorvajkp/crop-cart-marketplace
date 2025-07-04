
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
  seller: string;
  sellerId?: string;
  rating: number;
  image?: string;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderProduct {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  seller: string;
  sellerId?: string;
}

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryTime: string;
  orderDate: string;
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
}

export interface PlaceOrderData {
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  products: OrderProduct[];
  totalAmount: number;
  paymentMethod: string;
  deliveryAddress: string;
  deliveryTime: string;
}
