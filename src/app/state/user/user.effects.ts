import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import {
  loadMe,
  loadMeFailure,
  loadMeSuccess,
  loadOrderDetail,
  loadOrderDetailFailure,
  loadOrderDetailSuccess,
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
  updatePreferences,
  updatePreferencesFailure,
  updatePreferencesSuccess,
} from './user.actions';
import { OrderDetail, OrderSummary, UserProfile } from './user.models';

@Injectable()
export class UserEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  loadMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMe),
      mergeMap(() =>
        this.http.get<UserProfile>('/api/me/').pipe(
          map((profile) => loadMeSuccess({ profile })),
          catchError((err) => of(loadMeFailure({ error: String(err?.message || err) }))),
        ),
      ),
    ),
  );

  updatePreferences$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updatePreferences),
      mergeMap(({ patch }) =>
        this.http.patch<UserProfile>('/api/me/', patch).pipe(
          map((profile) => updatePreferencesSuccess({ profile })),
          catchError((err) => of(updatePreferencesFailure({ error: String(err?.message || err) }))),
        ),
      ),
    ),
  );

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrders),
      mergeMap(() =>
        this.http.get<OrderSummary[]>('/api/me/orders/').pipe(
          map((orders) => loadOrdersSuccess({ orders })),
          catchError((err) => of(loadOrdersFailure({ error: String(err?.message || err) }))),
        ),
      ),
    ),
  );

  loadOrderDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrderDetail),
      mergeMap(({ id }) =>
        this.http.get<OrderDetail>(`/api/orders/${id}/`).pipe(
          map((order) => loadOrderDetailSuccess({ order })),
          catchError((err) => of(loadOrderDetailFailure({ error: String(err?.message || err) }))),
        ),
      ),
    ),
  );
}
