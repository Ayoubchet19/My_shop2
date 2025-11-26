import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { loadAdminStats } from '../state/admin/admin.actions';
import { selectAdminState } from '../state/admin/admin.reducer';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, CurrencyPipe, DatePipe, MatCardModule, MatTableModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="grid gap-4 grid-cols-1 md:grid-cols-3">
      <mat-card>
        <div class="text-sm text-slate-600">Utilisateurs</div>
        <div class="text-2xl font-semibold">{{ state().stats?.totalUsers ?? 0 }}</div>
      </mat-card>
      <mat-card>
        <div class="text-sm text-slate-600">Commandes</div>
        <div class="text-2xl font-semibold">{{ state().stats?.totalOrders ?? 0 }}</div>
      </mat-card>
      <mat-card>
        <div class="text-sm text-slate-600">Chiffre d'affaires</div>
        <div class="text-2xl font-semibold">{{ state().stats?.totalRevenue | currency }}</div>
      </mat-card>
    </div>

    <div class="mt-6 grid gap-4 grid-cols-1 md:grid-cols-2">
      <mat-card>
        <h3 class="m-0 mb-3">Top produits</h3>
        <div *ngIf="(state().stats?.topProducts || []).length === 0" class="text-slate-600">
          Aucun
        </div>
        <div
          *ngFor="let tp of state().stats?.topProducts || []"
          class="flex justify-between py-1 border-b"
        >
          <div>{{ tp.name }}</div>
          <div class="text-sm">Vendus: {{ tp.sold }} — {{ tp.revenue | currency }}</div>
        </div>
      </mat-card>

      <mat-card>
        <h3 class="m-0 mb-3">Commandes récentes</h3>
        <div *ngIf="(state().stats?.recentOrders || []).length === 0" class="text-slate-600">
          Aucune
        </div>
        <div class="grid grid-cols-5 font-medium border-b pb-2">
          <div>ID</div>
          <div>Utilisateur</div>
          <div>Total</div>
          <div>Date</div>
          <div>Statut</div>
        </div>
        <div
          *ngFor="let ro of state().stats?.recentOrders || []"
          class="grid grid-cols-5 py-2 border-b text-sm"
        >
          <div>{{ ro.id }}</div>
          <div>{{ ro.user }}</div>
          <div>{{ ro.total | currency }}</div>
          <div>{{ ro.createdAt | date: 'short' }}</div>
          <div>{{ ro.status }}</div>
        </div>
      </mat-card>
    </div>
  `,
})
export class AdminDashboardComponent {
  private readonly store = inject(Store);
  readonly state = this.store.selectSignal(selectAdminState);

  constructor() {
    this.store.dispatch(loadAdminStats());
  }
}
