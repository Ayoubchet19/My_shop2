import { createSelector } from '@ngrx/store';
import { selectReviewsState } from './reviews.reducer';

export const selectReviewsByProduct = (productId: number) =>
  createSelector(selectReviewsState, (s) => s.byProduct[productId] || []);

export const selectReviewsLoading = (productId: number) =>
  createSelector(selectReviewsState, (s) => !!s.loading[productId]);
