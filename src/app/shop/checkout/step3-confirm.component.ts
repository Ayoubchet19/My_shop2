import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CartStore } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-checkout-step3-confirm',
  standalone: true,
  imports: [NgIf, MatCardModule, MatButtonModule, MatSnackBarModule, RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  private readonly snack = inject(MatSnackBar);

  readonly order = signal<{ orderNumber: string } | null>(null);

  placeOrder() {
    const payload = {
      items: this.cart.selectCartItems().map((i) => ({ id: i.id, quantity: i.quantity })),
    };
    // Validate stock before confirming order
    this.http
      .post<{ ok: boolean } | { detail: string }>(`/api/cart/validate-stock/`, payload)
      .subscribe({
        next: (resp) => {
          if ((resp as any).detail) {
            this.snack.open(String((resp as any).detail), 'OK', { duration: 2500 });
            return;
          }
          this.http.post<{ orderNumber: string }>(`/api/order/`, payload).subscribe((res) => {
            this.order.set(res);
            this.cart.clearCart();
          });
        },
        error: (err) => {
          const msg = String(err?.error?.detail || err?.message || 'Erreur de stock');
          this.snack.open(msg, 'OK', { duration: 2500 });
        },
      });
  }
}
