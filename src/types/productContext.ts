
import { Product, CartItem, Order, PlaceOrderData } from './product';

export interface ProductContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  loading: boolean;
  addToCart: (productId: string) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateCartQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchProducts: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  placeOrder: (orderData: PlaceOrderData) => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  fetchOrders: () => Promise<void>;
}
