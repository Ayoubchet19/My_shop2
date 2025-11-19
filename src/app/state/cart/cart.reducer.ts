import { AddItemPayload, RemoveItemPayload, UpdateQuantityPayload } from './cart.actions';
import { CartItem, CartState, initialCartState } from './cart.models';

function recalc(state: CartState): CartState {
  const count = state.items.reduce((acc, it) => acc + it.quantity, 0);
  const totalPrice = +state.items.reduce((acc, it) => acc + it.price * it.quantity, 0).toFixed(2);
  return { ...state, count, totalPrice };
}

export const cartReducer = {
  addItem(state: CartState, payload: AddItemPayload): CartState {
    const idx = state.items.findIndex((i) => i.id === payload.product.id);
    let items: CartItem[];
    if (idx >= 0) {
      items = state.items.map((i) =>
        i.id === payload.product.id ? { ...i, quantity: i.quantity + payload.quantity } : i,
      );
    } else {
      items = [
        ...state.items,
        {
          id: payload.product.id,
          name: payload.product.name,
          price: payload.product.price,
          quantity: payload.quantity,
        },
      ];
    }
    return recalc({ ...state, items });
  },
  removeItem(state: CartState, payload: RemoveItemPayload): CartState {
    const items = state.items.filter((i) => i.id !== payload.productId);
    return recalc({ ...state, items });
  },
  updateQuantity(state: CartState, payload: UpdateQuantityPayload): CartState {
    const items = state.items
      .map((i) => (i.id === payload.productId ? { ...i, quantity: payload.quantity } : i))
      .filter((i) => i.quantity > 0);
    return recalc({ ...state, items });
  },
  clearCart(): CartState {
    return { ...initialCartState };
  },
};
