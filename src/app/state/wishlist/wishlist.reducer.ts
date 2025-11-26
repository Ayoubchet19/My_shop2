import { createFeature, createReducer, on } from '@ngrx/store';
import {
  addWishlist,
  loadWishlistSuccess,
  removeWishlist,
  toggleWishlist,
} from './wishlist.actions';

export interface WishlistState {
  ids: number[];
}

const initialState: WishlistState = {
  ids: [],
};

function toggleId(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
}

export const wishlistFeature = createFeature({
  name: 'wishlist',
  reducer: createReducer(
    initialState,
    on(loadWishlistSuccess, (state, { ids }) => ({ ...state, ids })),
    on(toggleWishlist, (state, { productId }) => ({
      ...state,
      ids: toggleId(state.ids, productId),
    })),
    on(addWishlist, (state, { productId }) => ({
      ...state,
      ids: state.ids.includes(productId) ? state.ids : [...state.ids, productId],
    })),
    on(removeWishlist, (state, { productId }) => ({
      ...state,
      ids: state.ids.filter((x) => x !== productId),
    })),
  ),
});

export const {
  name: wishlistFeatureKey,
  reducer: wishlistReducer,
  selectWishlistState,
} = wishlistFeature;
export const selectWishlistIds = (s: WishlistState) => s.ids;
