import { createAction, props } from '@ngrx/store';
import { Review } from './reviews.models';

export const loadReviews = createAction('[Reviews] Load', props<{ productId: number }>());
export const loadReviewsSuccess = createAction(
  '[Reviews] Load Success',
  props<{ productId: number; reviews: Review[] }>(),
);
export const loadReviewsFailure = createAction(
  '[Reviews] Load Failure',
  props<{ productId: number; error: string }>(),
);

export const postReview = createAction(
  '[Reviews] Post',
  props<{ productId: number; rating: number; comment: string }>(),
);
export const postReviewSuccess = createAction(
  '[Reviews] Post Success',
  props<{ productId: number; review: Review }>(),
);
export const postReviewFailure = createAction(
  '[Reviews] Post Failure',
  props<{ productId: number; error: string }>(),
);
