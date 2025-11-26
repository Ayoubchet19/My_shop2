import { CurrencyPipe, NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-stats-card',
  standalone: true,
  imports: [MatCardModule, CurrencyPipe, NgSwitch, NgSwitchCase, NgSwitchDefault],
  template: `
    <mat-card>
      <div class="text-sm text-slate-600">{{ label }}</div>
      <div class="text-2xl font-semibold">
        <ng-container [ngSwitch]="format">
          <span *ngSwitchCase="'currency'">{{ value | currency }}</span>
          <span *ngSwitchDefault>{{ value }}</span>
        </ng-container>
      </div>
    </mat-card>
  `,
})
export class AdminStatsCardComponent {
  @Input() label = '';
  @Input() value = 0;
  @Input() format: 'number' | 'currency' = 'number';
}
