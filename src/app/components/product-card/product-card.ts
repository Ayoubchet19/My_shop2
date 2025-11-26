import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { toggleWishlist } from '../../state/wishlist/wishlist.actions';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatIconModule, DatePipe, CurrencyPipe, MatSnackBarModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) price!: number;
  @Input({ required: true }) created_at!: string;
  @Input({ required: true }) avgRating!: number;
  @Input({ required: true }) id!: number;
  @Input({ required: true }) stock!: number;
  @Input({ required: true }) lowStockThreshold!: number;

  private readonly store = inject(Store);
  private readonly snack = inject(MatSnackBar);

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }

  onToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.store.dispatch(toggleWishlist({ productId: this.id }));
    this.snack.open('Article ajouté à la wishlist', 'OK', { duration: 1800 });
  }
}
