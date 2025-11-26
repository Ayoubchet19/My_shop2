import { createFeature, createReducer, on } from '@ngrx/store';
import { loadAdminStats, loadAdminStatsFailure, loadAdminStatsSuccess } from './admin.actions';
import { AdminState, initialAdminState } from './admin.models';

export const adminFeature = createFeature({
  name: 'admin',
  reducer: createReducer<AdminState>(
    initialAdminState,
    on(loadAdminStats, (state) => ({ ...state, loading: true, error: null })),
    on(loadAdminStatsSuccess, (state, { stats }) => ({ ...state, stats, loading: false })),
    on(loadAdminStatsFailure, (state, { error }) => ({ ...state, loading: false, error })),
  ),
});

export const { name: adminFeatureKey, reducer: adminReducer, selectAdminState } = adminFeature;
