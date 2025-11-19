import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CartStore } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-checkout-step1-summary',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <mat-card>
      <h2 class="m-0">Checkout - Summary</h2>
      <div *ngIf="(items() || []).length === 0" class="py-6 opacity-70">Cart is empty.</div>
      <div *ngIf="(items() || []).length > 0" class="py-4">
        <div class="grid grid-cols-4 font-medium border-b pb-2">
          <div>Product</div>
          <div>Qty</div>
          <div>Price</div>
          <div>Total</div>
        </div>
        <div *ngFor="let it of items()" class="grid grid-cols-4 py-2 border-b">
          <div>{{ it.name }}</div>
          <div>{{ it.quantity }}</div>
          <div>{{ it.price | currency }}</div>
          <div>{{ it.price * it.quantity | currency }}</div>
        </div>
        <div class="text-right py-4">
          <div>Subtotal: {{ summary()?.subtotal | currency }}</div>
          <div>Tax: {{ summary()?.tax | currency }}</div>
          <div class="font-bold">Total: {{ summary()?.total | currency }}</div>
        </div>
        <a mat-flat-button color="primary" [routerLink]="['/checkout', 'step2']">Continue</a>
      </div>
    </mat-card>
  `,
})
export class CheckoutStep1SummaryComponent {
  private readonly cart = inject(CartStore);
  private readonly http = inject(HttpClient);

  readonly items = this.cart.selectCartItems;
  readonly summary = signal<{ subtotal: number; tax: number; total: number } | null>(null);

  constructor() {
    const payload = { items: this.items().map((i) => ({ id: i.id, quantity: i.quantity })) };
    this.http
      .post<{ subtotal: number; tax: number; total: number }>(`/api/cart/validate/`, payload)
      .subscribe((res) => this.summary.set(res));
  }
}
