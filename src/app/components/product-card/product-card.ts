import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [MatCardModule, MatIconModule, DatePipe, CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input({ required: true }) name!: string;
  @Input({ required: true }) price!: number;
  @Input({ required: true }) created_at!: string;
  @Input({ required: true }) avgRating!: number;

  get stars(): number[] {
    return [1, 2, 3, 4, 5];
  }
}
