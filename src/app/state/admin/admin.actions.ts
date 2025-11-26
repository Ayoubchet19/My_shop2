import { createAction, props } from '@ngrx/store';
import { AdminStats } from './admin.models';

export const loadAdminStats = createAction('[Admin] Load Stats');
export const loadAdminStatsSuccess = createAction(
  '[Admin] Load Stats Success',
  props<{ stats: AdminStats }>(),
);
export const loadAdminStatsFailure = createAction(
  '[Admin] Load Stats Failure',
  props<{ error: string }>(),
);
