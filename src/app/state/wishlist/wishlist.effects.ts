import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, tap, withLatestFrom } from 'rxjs';
import {
  addWishlist,
  loadWishlist,
  loadWishlistFailure,
  loadWishlistSuccess,
  removeWishlist,
  toggleWishlist,
} from './wishlist.actions';
import { selectWishlistState } from './wishlist.reducer';

@Injectable()
export class WishlistEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);
  private readonly store = inject<Store>(Store as any);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadWishlist),
      mergeMap(() => {
        try {
          const raw = localStorage.getItem('wishlist.ids');
          if (raw) {
            const ids = JSON.parse(raw);
            if (Array.isArray(ids)) {
              return of(loadWishlistSuccess({ ids }));
            }
          }
        } catch {}
        return this.http.get<number[]>(`/api/me/wishlist/`).pipe(
          map((ids) => loadWishlistSuccess({ ids })),
          catchError((err) => of(loadWishlistFailure({ error: String(err?.message || err) }))),
        );
      }),
    ),
  );

  // Toggle via MSW endpoint then reflect result in store
  toggle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(toggleWishlist),
      mergeMap(({ productId }) =>
        this.http
          .post<{ productId: number; added: boolean; removed: boolean; ids?: number[] }>(
            `/api/me/wishlist/`,
            {
              productId,
              action: 'toggle',
            },
          )
          .pipe(
            map((res) =>
              Array.isArray(res.ids)
                ? loadWishlistSuccess({ ids: res.ids })
                : res.added
                  ? addWishlist({ productId })
                  : removeWishlist({ productId }),
            ),
            catchError(() => of(removeWishlist({ productId }))),
          ),
      ),
    ),
  );

  // Keep server in sync when user removes/adds directly from the wishlist page
  syncAddRemove$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addWishlist, removeWishlist),
        mergeMap((action) => {
          const productId = 'productId' in action ? action.productId : 0;
          const post = this.http.post(`/api/me/wishlist/`, {
            productId,
            action: action.type.includes('Add') ? 'add' : 'remove',
          });
          return post.pipe(catchError(() => of(null)));
        }),
      ),
    { dispatch: false },
  );

  // Persist wishlist to localStorage on changes
  persist$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addWishlist, removeWishlist, toggleWishlist, loadWishlistSuccess),
        withLatestFrom(this.store.pipe(select(selectWishlistState))),
        tap(([_, state]) => {
          try {
            localStorage.setItem('wishlist.ids', JSON.stringify(state.ids));
          } catch {}
        }),
      ),
    { dispatch: false },
  );

  // Initialize from localStorage if present
  initLocal$ = createEffect(() =>
    of(null).pipe(
      map(() => localStorage.getItem('wishlist.ids')),
      map((raw) => {
        if (!raw) return loadWishlist();
        try {
          const ids = JSON.parse(raw || '[]');
          return loadWishlistSuccess({ ids: Array.isArray(ids) ? ids : [] });
        } catch {
          return loadWishlist();
        }
      }),
    ),
  );
}
