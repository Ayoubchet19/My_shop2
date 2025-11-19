import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CartStore } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-checkout-step3-confirm',
  standalone: true,
  imports: [NgIf, MatCardModule, MatButtonModule, RouterModule],
  template: `
    <mat-card>
      <h2 class="m-0">Checkout - Confirmation</h2>
      <div *ngIf="!order()" class="py-4">
        <button mat-flat-button color="primary" (click)="placeOrder()">Place Order</button>
      </div>
      <div *ngIf="order()" class="py-4">
        <p class="font-medium">Order Confirmed!</p>
        <p>
          Order Number: <strong>{{ order()?.orderNumber }}</strong>
        </p>
        <a mat-button routerLink="/products">Back to products</a>
      </div>
    </mat-card>
  `,
})
export class CheckoutStep3ConfirmComponent {
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartStore);

  readonly order = signal<{ orderNumber: string } | null>(null);

  placeOrder() {
    const payload = {
      items: this.cart.selectCartItems().map((i) => ({ id: i.id, quantity: i.quantity })),
    };
    this.http.post<{ orderNumber: string }>(`/api/order/`, payload).subscribe((res) => {
      this.order.set(res);
      this.cart.clearCart();
    });
  }
}
