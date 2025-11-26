import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { CartStore } from '../../state/cart/cart.selectors';

@Component({
  selector: 'app-checkout-step1-summary',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CurrencyPipe,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
        <div *ngFor="let it of items(); trackBy: trackItem" class="grid grid-cols-4 py-2 border-b">
          <div>{{ it.name }}</div>
          <div>{{ it.quantity }}</div>
          <div>{{ it.price | currency }}</div>
          <div>{{ it.price * it.quantity | currency }}</div>
        </div>
        <div class="grid md:grid-cols-2 gap-4 py-4 items-start">
          <div class="space-y-2">
            <label class="block">
              <span class="text-sm">Code promo</span>
              <input
                [(ngModel)]="promoCode"
                name="promoCode"
                class="border rounded px-2 py-1 w-full"
              />
            </label>
            <button mat-stroked-button color="accent" (click)="applyPromo()">Appliquer</button>
            <div *ngIf="appliedPromos().length > 0" class="text-sm text-green-700">
              Codes appliqués: {{ appliedPromos().join(', ') }}
            </div>
          </div>
          <div class="text-right">
            <div>
              Sous-total: {{ promoSummary()?.itemsTotal ?? summary()?.subtotal | currency }}
            </div>
            <div>Remise(s): {{ promoSummary()?.discount | currency }}</div>
            <div>Frais de port: {{ promoSummary()?.shipping | currency }}</div>
            <div>Taxes: {{ promoSummary()?.taxes ?? summary()?.tax | currency }}</div>
            <div class="font-bold">
              Total final: {{ promoSummary()?.grandTotal ?? summary()?.total | currency }}
            </div>
          </div>
        </div>
        <a mat-flat-button color="primary" [routerLink]="['/checkout', 'step2']">Continue</a>
      </div>
    </mat-card>
  `,
})
export class CheckoutStep1SummaryComponent {
  private readonly cart = inject(CartStore);
  private readonly http = inject(HttpClient);
  private readonly snack = inject(MatSnackBar);

  readonly items = this.cart.selectCartItems;
  readonly summary = signal<{ subtotal: number; tax: number; total: number } | null>(null);
  readonly promoSummary = signal<{
    itemsTotal: number;
    discount: number;
    shipping: number;
    taxes: number;
    grandTotal: number;
    appliedPromos: string[];
  } | null>(null);
  readonly appliedPromos = signal<string[]>([]);
  promoCode = '';

  constructor() {
    const itemsPayload = this.items().map((i) => ({ id: i.id, quantity: i.quantity }));
    // Base totals from API (apply-promo without code) so taxes/shipping are not hard-coded
    this.http
      .post<{
        itemsTotal: number;
        discount: number;
        shipping: number;
        taxes: number;
        grandTotal: number;
        appliedPromos: string[];
      }>(`/api/cart/apply-promo/`, { items: itemsPayload, code: '' })
      .subscribe((res) => {
        this.promoSummary.set(res);
        this.summary.set({ subtotal: res.itemsTotal, tax: res.taxes, total: res.grandTotal });
      });
  }

  applyPromo() {
    const itemsPayload = this.items().map((i) => ({ id: i.id, quantity: i.quantity }));
    this.http
      .post<{
        itemsTotal: number;
        discount: number;
        shipping: number;
        taxes: number;
        grandTotal: number;
        appliedPromos: string[];
      }>(`/api/cart/apply-promo/`, { items: itemsPayload, code: this.promoCode })
      .subscribe((res) => {
        this.promoSummary.set(res);
        this.appliedPromos.set(res.appliedPromos || []);
        const msg = res.appliedPromos?.length ? 'Code promo appliqué' : 'Code invalide';
        this.snack.open(msg, 'OK', { duration: 1800 });
      });
  }

  trackItem = (_: number, it: { id: number }) => it.id;
}
