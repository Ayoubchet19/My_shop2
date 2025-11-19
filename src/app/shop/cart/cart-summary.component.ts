import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CartItem } from '../../state/cart/cart.models';

@Component({
  selector: 'app-cart-summary',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, CurrencyPipe, MatCardModule],
  template: `
    <mat-card>
      <h3 class="m-0">Summary</h3>
      <div *ngIf="(items || []).length === 0" class="py-4 opacity-70">No items.</div>
      <div *ngIf="(items || []).length > 0">
        <div class="grid grid-cols-4 font-medium border-b pb-2">
          <div>Product</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Total</div>
        </div>
        <div *ngFor="let it of items" class="grid grid-cols-4 py-2 border-b">
          <div>{{ it.name }}</div>
          <div>{{ it.quantity }}</div>
          <div>{{ it.price | currency }}</div>
          <div>{{ it.price * it.quantity | currency }}</div>
        </div>
        <div class="text-right py-4">
          <div>Subtotal: {{ subtotal | currency }}</div>
          <div>Tax: {{ tax | currency }}</div>
          <div class="font-bold">Total: {{ total | currency }}</div>
        </div>
      </div>
    </mat-card>
  `,
})
export class CartSummaryComponent {
  @Input() items: CartItem[] = [];
  @Input() subtotal = 0;
  @Input() tax = 0;
  @Input() total = 0;
}
