import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadAdminStats, loadAdminStatsFailure, loadAdminStatsSuccess } from './admin.actions';
import { AdminStats } from './admin.models';

@Injectable()
export class AdminEffects {
  private readonly actions$ = inject(Actions);
  private readonly http = inject(HttpClient);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAdminStats),
      mergeMap(() =>
        this.http.get<AdminStats>(`/api/admin/stats/`).pipe(
          map((stats) => loadAdminStatsSuccess({ stats })),
          catchError((err) => of(loadAdminStatsFailure({ error: String(err?.message || err) }))),
        ),
      ),
    ),
  );
}
