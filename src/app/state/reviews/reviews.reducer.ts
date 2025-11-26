import { createFeature, createReducer, on } from '@ngrx/store';
import {
  loadReviews,
  loadReviewsFailure,
  loadReviewsSuccess,
  postReviewSuccess,
} from './reviews.actions';
import { initialReviewsState, ReviewsState } from './reviews.models';

export const reviewsFeature = createFeature({
  name: 'reviews',
  reducer: createReducer<ReviewsState>(
    initialReviewsState,
    on(loadReviews, (state, { productId }) => ({
      ...state,
      loading: { ...state.loading, [productId]: true },
      error: null,
    })),
    on(loadReviewsSuccess, (state, { productId, reviews }) => ({
      ...state,
      byProduct: { ...state.byProduct, [productId]: reviews },
      loading: { ...state.loading, [productId]: false },
    })),
    on(loadReviewsFailure, (state, { productId, error }) => ({
      ...state,
      loading: { ...state.loading, [productId]: false },
      error,
    })),
    on(postReviewSuccess, (state, { productId, review }) => ({
      ...state,
      byProduct: {
        ...state.byProduct,
        [productId]: [review, ...(state.byProduct[productId] || [])],
      },
    })),
  ),
});

export const {
  name: reviewsFeatureKey,
  reducer: reviewsReducer,
  selectReviewsState,
} = reviewsFeature;
