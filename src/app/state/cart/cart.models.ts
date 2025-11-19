export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalPrice: number;
  count: number;
}

export const initialCartState: CartState = {
  items: [],
  totalPrice: 0,
  count: 0,
};
