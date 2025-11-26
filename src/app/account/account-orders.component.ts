import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadOrders } from '../state/user/user.actions';
import { selectUserLoading, selectUserOrders } from '../state/user/user.selectors';

@Component({
  selector: 'app-account-orders',
  standalone: true,
  imports: [CommonModule, MatCardModule, RouterLink],
  template: `
    <mat-card>
      <h2 class="m-0">Mes commandes</h2>
      <div *ngIf="loading$ | async" class="opacity-70 py-2">Chargement...</div>
      <div *ngIf="orders$ | async as orders">
        <div *ngIf="orders.length === 0" class="py-3 opacity-70">Aucune commande.</div>
        <div *ngIf="orders.length > 0" class="divide-y">
          <div *ngFor="let o of orders" class="py-2 flex justify-between items-center">
            <div>
              <div class="font-medium">Commande #{{ o.id }}</div>
              <div class="text-sm opacity-70">Date: {{ o.date }} — Status: {{ o.status }}</div>
            </div>
            <div class="font-bold">{{ o.total | currency }}</div>
            <a class="btn-nav" [routerLink]="'/account/orders/' + o.id">Voir détail</a>
          </div>
        </div>
      </div>
    </mat-card>
  `,
})
export class AccountOrdersComponent implements OnInit {
  private readonly store = inject(Store);
  orders$ = this.store.select(selectUserOrders);
  loading$ = this.store.select(selectUserLoading);

  ngOnInit(): void {
    this.store.dispatch(loadOrders());
  }
}
