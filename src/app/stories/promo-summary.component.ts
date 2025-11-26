import { CurrencyPipe, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-promo-summary',
  standalone: true,
  imports: [NgIf, CurrencyPipe, MatButtonModule],
  template: `
    <div class="space-y-1">
      <div>Sous-total: {{ itemsTotal | currency }}</div>
      <div>Remise(s): {{ discount | currency }}</div>
      <div>Frais de port: {{ shipping | currency }}</div>
      <div>Taxes: {{ taxes | currency }}</div>
      <div class="font-semibold">Total final: {{ grandTotal | currency }}</div>
      <div *ngIf="appliedPromos.length" class="text-sm text-green-700">
        Codes appliqués: {{ appliedPromos.join(', ') }}
      </div>
      <div class="pt-2">
        <button mat-stroked-button color="accent" (click)="onApply.emit()">Appliquer</button>
      </div>
    </div>
  `,
})
export class PromoSummaryComponent {
  @Input() itemsTotal = 0;
  @Input() discount = 0;
  @Input() shipping = 0;
  @Input() taxes = 0;
  @Input() grandTotal = 0;
  @Input() appliedPromos: string[] = [];
  @Output() onApply = new EventEmitter<void>();
}
