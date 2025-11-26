import { createSelector } from '@ngrx/store';
import { selectAdminState } from './admin.reducer';

export const selectRecentOrdersByStatus = (status: string) =>
  createSelector(selectAdminState, (s) =>
    (s.stats?.recentOrders || []).filter((o) => o.status === status),
  );
