import { createAction, props } from '@ngrx/store';

export const loadWishlist = createAction('[Wishlist] Load');
export const loadWishlistSuccess = createAction(
  '[Wishlist] Load Success',
  props<{ ids: number[] }>(),
);
export const loadWishlistFailure = createAction(
  '[Wishlist] Load Failure',
  props<{ error: string }>(),
);

export const toggleWishlist = createAction('[Wishlist] Toggle', props<{ productId: number }>());
export const addWishlist = createAction('[Wishlist] Add', props<{ productId: number }>());
export const removeWishlist = createAction('[Wishlist] Remove', props<{ productId: number }>());

export const persistWishlist = createAction('[Wishlist] Persist');
