import { Component, inject } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CartStore } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-cart-icon',
  standalone: true,
  imports: [MatIconModule, MatBadgeModule, RouterModule],
  template: `
    <a [routerLink]="['/cart']" class="inline-flex items-center" title="Cart">
      <mat-icon aria-hidden="false" [matBadge]="count()" matBadgeColor="accent"
        >shopping_cart</mat-icon
      >
    </a>
  `,
})
export class CartIconComponent {
  private readonly cart = inject(CartStore);
  readonly count = this.cart.selectCartCount;
}
