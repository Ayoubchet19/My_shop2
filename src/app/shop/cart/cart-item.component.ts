import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CartItem } from '../../state/cart/cart.models';

@Component({
  selector: 'app-cart-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <div class="flex items-center justify-between py-2 gap-4">
      <div class="flex-1">
        <div class="font-medium">{{ item.name }}</div>
        <div class="text-sm opacity-70">{{ item.price | currency }}</div>
      </div>
      <mat-form-field appearance="outline" style="width: 120px">
        <mat-label>Qty</mat-label>
        <input
          matInput
          type="number"
          min="1"
          [value]="item.quantity"
          (input)="onChange($any($event.target).value)"
        />
      </mat-form-field>
      <div class="w-24 text-right">{{ item.price * item.quantity | currency }}</div>
      <button mat-icon-button color="warn" (click)="remove.emit(item.id)">
        <mat-icon>delete</mat-icon>
      </button>
    </div>
  `,
})
export class CartItemComponent {
  @Input() item!: CartItem;
  @Output() quantityChange = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  onChange(value: any) {
    const q = Math.max(1, Number(value) || 1);
    this.quantityChange.emit(q);
  }
}
