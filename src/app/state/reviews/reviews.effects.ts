import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
  loadReviews,
  loadReviewsFailure,
  loadReviewsSuccess,
  postReview,
  postReviewFailure,
  postReviewSuccess,
} from './reviews.actions';
import { Review } from './reviews.models';

@Injectable()
export class ReviewsEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadReviews),
      mergeMap(({ productId }) =>
        this.http.get<Review[]>(`/api/products/${productId}/reviews/`).pipe(
          map((reviews) => loadReviewsSuccess({ productId, reviews })),
          catchError((err) =>
            of(loadReviewsFailure({ productId, error: String(err?.message || err) })),
          ),
        ),
      ),
    ),
  );

  post$ = createEffect(() =>
    this.actions$.pipe(
      ofType(postReview),
      mergeMap(({ productId, rating, comment }) =>
        this.http.post<Review>(`/api/products/${productId}/reviews/`, { rating, comment }).pipe(
          map((review) => postReviewSuccess({ productId, review })),
          catchError((err) =>
            of(postReviewFailure({ productId, error: String(err?.message || err) })),
          ),
        ),
      ),
    ),
  );
}
