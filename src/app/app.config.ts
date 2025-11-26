import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { routes } from './app.routes';
import { authInterceptor } from './services/auth.interceptor';
import { AdminEffects } from './state/admin/admin.effects';
import { adminReducer } from './state/admin/admin.reducer';
import { ReviewsEffects } from './state/reviews/reviews.effects';
import { reviewsReducer } from './state/reviews/reviews.reducer';
import { UserEffects } from './state/user/user.effects';
import { userReducer } from './state/user/user.reducer';
import { WishlistEffects } from './state/wishlist/wishlist.effects';
import { wishlistReducer } from './state/wishlist/wishlist.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore({
      user: userReducer,
      wishlist: wishlistReducer,
      reviews: reviewsReducer,
      admin: adminReducer,
    }),
    provideEffects([UserEffects, WishlistEffects, ReviewsEffects, AdminEffects]),
  ],
};
