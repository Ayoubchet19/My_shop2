import { Routes } from '@angular/router';
import { AppPlaceholderComponent } from './app-placeholder.component';
import { Auth } from './auth/auth';
import { DevAuthComponent } from './dev/dev-auth.component';
import { DevIndexComponent } from './dev/dev-index.component';
import { DevProductRatingComponent } from './dev/dev-product-rating.component';
import { DevProductsComponent } from './dev/dev-products.component';
import { HomeComponent } from './home.component';
import { Product } from './product/product';
import { Products } from './products/products';
import { authGuard } from './services/auth.guard';
import { guestGuard } from './services/guest.guard';
import { CartPageComponent } from './shop/cart/cart-page.component';
import { CheckoutStep1SummaryComponent } from './shop/checkout/step1-summary.component';
import { CheckoutStep2AddressComponent } from './shop/checkout/step2-address.component';
import { CheckoutStep3ConfirmComponent } from './shop/checkout/step3-confirm.component';
import { ProductDetailsPageComponent } from './shop/product-details/product-details-page.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dev', component: DevIndexComponent },
  { path: 'dev/auth', component: DevAuthComponent },
  { path: 'dev/products', component: DevProductsComponent },
  { path: 'dev/products/:id/rating', component: DevProductRatingComponent },

  { path: 'auth', canActivate: [guestGuard], component: Auth },
  { path: 'app', canActivate: [authGuard], component: AppPlaceholderComponent },
  {
    path: 'products',
    canActivate: [authGuard],
    component: Products,
    children: [
      { path: ':id/rating', canActivate: [authGuard], component: Product },
      { path: ':id', canActivate: [authGuard], component: ProductDetailsPageComponent },
    ],
  },
  { path: 'cart', canActivate: [authGuard], component: CartPageComponent },
  {
    path: 'checkout',
    canActivate: [authGuard],
    children: [
      { path: 'step1', component: CheckoutStep1SummaryComponent },
      { path: 'step2', component: CheckoutStep2AddressComponent },
      { path: 'step3', component: CheckoutStep3ConfirmComponent },
      { path: '', pathMatch: 'full', redirectTo: 'step1' },
    ],
  },

  { path: '**', redirectTo: '' },
];
