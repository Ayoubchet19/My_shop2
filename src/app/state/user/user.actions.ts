import { createAction, props } from '@ngrx/store';
import { OrderDetail, OrderSummary, UserPreferences, UserProfile } from './user.models';

export const loadMe = createAction('[User] Load Me');
export const loadMeSuccess = createAction(
  '[User] Load Me Success',
  props<{ profile: UserProfile }>(),
);
export const loadMeFailure = createAction('[User] Load Me Failure', props<{ error: string }>());

export const updatePreferences = createAction(
  '[User] Update Preferences',
  props<{ patch: Partial<UserPreferences> }>(),
);
export const updatePreferencesSuccess = createAction(
  '[User] Update Preferences Success',
  props<{ profile: UserProfile }>(),
);
export const updatePreferencesFailure = createAction(
  '[User] Update Preferences Failure',
  props<{ error: string }>(),
);

export const loadOrders = createAction('[User] Load Orders');
export const loadOrdersSuccess = createAction(
  '[User] Load Orders Success',
  props<{ orders: OrderSummary[] }>(),
);
export const loadOrdersFailure = createAction(
  '[User] Load Orders Failure',
  props<{ error: string }>(),
);

export const loadOrderDetail = createAction('[User] Load Order Detail', props<{ id: string }>());
export const loadOrderDetailSuccess = createAction(
  '[User] Load Order Detail Success',
  props<{ order: OrderDetail }>(),
);
export const loadOrderDetailFailure = createAction(
  '[User] Load Order Detail Failure',
  props<{ error: string }>(),
);
