import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { removeItem, updateQuantity } from '../../state/cart/cart.actions';
import { CartStore } from '../../state/cart/cart.selectors';
import { CartItemComponent } from './cart-item.component';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    CartItemComponent,
  ],
  template: `
    <mat-card>
      <h2 class="m-0">Your Cart</h2>
      <div *ngIf="(items() || []).length === 0" class="py-6 opacity-70">Cart is empty.</div>
      <div *ngIf="(items() || []).length > 0" class="divide-y">
        <app-cart-item
          *ngFor="let it of items()"
          [item]="it"
          (remove)="onRemove($event)"
          (quantityChange)="onQty(it.id, $event)"
        />
      </div>
      <div class="flex justify-between items-center pt-4">
        <strong>Subtotal: {{ total() | currency }}</strong>
        <span class="flex gap-2">
          <button mat-button color="warn" (click)="onClear()">Clear Cart</button>
          <a mat-flat-button color="primary" [routerLink]="['/checkout', 'step1']">Checkout</a>
        </span>
      </div>
    </mat-card>
  `,
})
export class CartPageComponent {
  private readonly cart = inject(CartStore);

  readonly items = this.cart.selectCartItems;
  readonly total = this.cart.selectCartTotal;

  onQty(id: number, quantity: number) {
    this.cart.updateQuantity({ productId: id, quantity } as ReturnType<
      typeof updateQuantity
    >['payload']);
  }
  onRemove(id: number) {
    this.cart.removeItem({ productId: id } as ReturnType<typeof removeItem>['payload']);
  }
  onClear() {
    this.cart.clearCart();
  }
}
