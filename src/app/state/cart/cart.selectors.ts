import { computed, Injectable, signal } from '@angular/core';
import { AddItemPayload, RemoveItemPayload, UpdateQuantityPayload } from './cart.actions';
import { CartItem, CartState, initialCartState } from './cart.models';
import { cartReducer } from './cart.reducer';

@Injectable({ providedIn: 'root' })
export class CartStore {
  private readonly key = 'cartState';

  private readonly _state = signal<CartState>(this.load());
  readonly state = this._state.asReadonly();

  readonly selectCartItems = computed<CartItem[]>(() => this._state().items);
  readonly selectCartTotal = computed<number>(() => this._state().totalPrice);
  readonly selectCartCount = computed<number>(() => this._state().count);

  addItem(payload: AddItemPayload) {
    this._state.update((s) => cartReducer.addItem(s, payload));
    this.save();
  }
  removeItem(payload: RemoveItemPayload) {
    this._state.update((s) => cartReducer.removeItem(s, payload));
    this.save();
  }
  updateQuantity(payload: UpdateQuantityPayload) {
    this._state.update((s) => cartReducer.updateQuantity(s, payload));
    this.save();
  }
  clearCart() {
    this._state.update(() => cartReducer.clearCart());
    this.save();
  }

  private save() {
    localStorage.setItem(this.key, JSON.stringify(this._state()));
  }
  private load(): CartState {
    const raw = localStorage.getItem(this.key);
    if (!raw) return initialCartState;
    try {
      const parsed = JSON.parse(raw) as CartState;
      return parsed ?? initialCartState;
    } catch {
      return initialCartState;
    }
  }
}
