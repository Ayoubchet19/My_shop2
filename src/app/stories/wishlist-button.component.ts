import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-wishlist-button',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <button mat-stroked-button color="accent" (click)="toggle.emit()" aria-label="Toggle wishlist">
      <mat-icon [fontIcon]="active ? 'favorite' : 'favorite_border'"></mat-icon>
      <span class="ml-2">{{ active ? 'Retirer' : 'Ajouter' }}</span>
    </button>
  `,
})
export class WishlistButtonComponent {
  @Input() active = false;
  @Output() toggle = new EventEmitter<void>();
}
