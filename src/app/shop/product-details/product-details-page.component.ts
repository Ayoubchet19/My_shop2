import { CurrencyPipe, DatePipe, DecimalPipe, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute } from '@angular/router';
import { CartStore } from '../../state/cart/cart.selectors';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  created_at: string;
  _avg: number;
  description?: string;
}

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [NgIf, CurrencyPipe, DatePipe, DecimalPipe, MatCardModule, MatButtonModule],
  template: `
    <ng-container *ngIf="product() as p">
      <mat-card>
        <h2 class="m-0">{{ p.name }}</h2>
        <div class="opacity-70 text-sm pb-2">Added: {{ p.created_at | date }}</div>
        <div class="pb-2">Average rating: {{ p._avg | number: '1.1-1' }} / 5</div>
        <div class="text-lg font-bold pb-4">{{ p.price | currency }}</div>
        <button mat-flat-button color="primary" (click)="addToCart(p)">Add to Cart</button>
      </mat-card>
    </ng-container>
  `,
})
export class ProductDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartStore);

  readonly product = signal<ProductDetails | null>(null);

  constructor() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.http.get<ProductDetails>(`/api/products/${id}/`).subscribe((p) => this.product.set(p));
  }

  addToCart(p: ProductDetails) {
    this.cart.addItem({ product: { id: p.id, name: p.name, price: p.price }, quantity: 1 });
  }
}
