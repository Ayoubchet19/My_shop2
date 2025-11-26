import { createReducer, on } from '@ngrx/store';
import {
  loadMe,
  loadMeFailure,
  loadMeSuccess,
  loadOrders,
  loadOrdersFailure,
  loadOrdersSuccess,
  updatePreferences,
  updatePreferencesFailure,
  updatePreferencesSuccess,
} from './user.actions';
import { UserState } from './user.models';

export const initialState: UserState = {
  profile: null,
  orders: [],
  loading: false,
  error: undefined,
};

export const userReducer = createReducer(
  initialState,
  on(loadMe, (s) => ({ ...s, loading: true, error: undefined })),
  on(loadMeSuccess, (s, { profile }) => ({ ...s, loading: false, profile })),
  on(loadMeFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(updatePreferences, (s) => ({ ...s, loading: true, error: undefined })),
  on(updatePreferencesSuccess, (s, { profile }) => ({ ...s, loading: false, profile })),
  on(updatePreferencesFailure, (s, { error }) => ({ ...s, loading: false, error })),

  on(loadOrders, (s) => ({ ...s, loading: true, error: undefined })),
  on(loadOrdersSuccess, (s, { orders }) => ({ ...s, loading: false, orders })),
  on(loadOrdersFailure, (s, { error }) => ({ ...s, loading: false, error })),
);
