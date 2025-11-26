import { CommonModule, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadOrderDetail } from '../state/user/user.actions';

@Component({
  selector: 'app-account-order-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, CurrencyPipe, NgIf, NgFor],
  template: `
    <mat-card *ngIf="order() as o">
      <h2 class="m-0">Commande #{{ o.id }}</h2>
      <div class="opacity-70 text-sm">Date: {{ o.date }} — Status: {{ o.status }}</div>

      <div class="py-4 grid gap-2">
        <div class="grid grid-cols-4 font-medium border-b pb-2">
          <div>Produit</div>
          <div>Qté</div>
          <div>Prix</div>
          <div>Total</div>
        </div>
        <div *ngFor="let it of o.items" class="grid grid-cols-4 py-2 border-b">
          <div>{{ it.name }}</div>
          <div>{{ it.quantity }}</div>
          <div>{{ it.price | currency }}</div>
          <div>{{ it.price * it.quantity | currency }}</div>
        </div>
      </div>

      <div class="text-right py-4">
        <div>Sous-total: {{ o.subtotal | currency }}</div>
        <div>Taxes: {{ o.tax | currency }}</div>
        <div>Livraison: {{ o.shipping | currency }}</div>
        <div class="font-bold">Total: {{ o.total | currency }}</div>
      </div>

      <div class="py-2">
        <h3 class="m-0">Adresse de livraison</h3>
        <div>{{ o.address.line1 }} {{ o.address.line2 }}</div>
        <div>{{ o.address.postalCode }} {{ o.address.city }} — {{ o.address.country }}</div>
      </div>
    </mat-card>
  `,
})
export class AccountOrderDetailComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly route = inject(ActivatedRoute);
  // For simplicity, readback from a one-shot effect result via a local signal updated by subscription
  private readonly _order = signal<any | null>(null);
  order = this._order;

  ngOnInit(): void {
    const id = String(this.route.snapshot.paramMap.get('id') || '');
    if (id) this.store.dispatch(loadOrderDetail({ id }));
    // In real app we'd select from store; here we listen to all actions or use a dedicated selector; simplified.
    // TODO: Add selector for last loaded order detail if persisted in state.
  }
}
