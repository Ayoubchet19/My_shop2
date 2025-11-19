import { CartItem } from './cart.models';

// Action interfaces (NgRx-like shape for clarity)
export interface AddItemPayload {
  product: { id: number; name: string; price: number };
  quantity: number;
}

export interface RemoveItemPayload {
  productId: number;
}

export interface UpdateQuantityPayload {
  productId: number;
  quantity: number;
}

export const addItem = (payload: AddItemPayload) => ({ type: '[Cart] Add Item', payload });
export const removeItem = (payload: RemoveItemPayload) => ({ type: '[Cart] Remove Item', payload });
export const updateQuantity = (payload: UpdateQuantityPayload) => ({
  type: '[Cart] Update Quantity',
  payload,
});
export const clearCart = () => ({ type: '[Cart] Clear' });

// Helper to convert product to CartItem
export const toCartItem = (
  product: { id: number; name: string; price: number },
  quantity: number,
): CartItem => ({
  id: product.id,
  name: product.name,
  price: product.price,
  quantity,
});
