import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.models';

export const selectUser = createFeatureSelector<UserState>('user');

export const selectUserProfile = createSelector(selectUser, (s) => s.profile);
export const selectUserOrders = createSelector(selectUser, (s) => s.orders);
export const selectUserLoading = createSelector(selectUser, (s) => s.loading);
export const selectUserError = createSelector(selectUser, (s) => s.error);
