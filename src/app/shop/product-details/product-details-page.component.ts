import { CurrencyPipe, DatePipe, DecimalPipe, NgFor, NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from '../../services/auth';
import { CartStore } from '../../state/cart/cart.selectors';
import { loadReviews, postReview } from '../../state/reviews/reviews.actions';
import { selectReviewsByProduct } from '../../state/reviews/reviews.selectors';
import { toggleWishlist } from '../../state/wishlist/wishlist.actions';

interface ProductDetails {
  id: number;
  name: string;
  price: number;
  created_at: string;
  _avg: number;
  description?: string;
  stock: number;
  lowStockThreshold: number;
}

@Component({
  selector: 'app-product-details-page',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    CurrencyPipe,
    DatePipe,
    DecimalPipe,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    FormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-container *ngIf="product() as p">
      <mat-card>
        <h2 class="m-0">{{ p.name }}</h2>
        <div class="opacity-70 text-sm pb-2">Added: {{ p.created_at | date }}</div>
        <div class="pb-2">
          Average rating: {{ avgFromReviews() ?? (p._avg | number: '1.1-1') }} / 5
        </div>
        <div class="pb-2 text-sm">
          @if (p.stock === 0) {
            <span class="text-red-600">Rupture de stock</span>
          } @else if (p.stock <= p.lowStockThreshold) {
            <span class="text-amber-600">Plus que {{ p.stock }} en stock</span>
          } @else {
            <span class="text-green-700">En stock</span>
          }
        </div>
        <div class="text-lg font-bold pb-4">{{ p.price | currency }}</div>
        <div class="flex gap-2">
          <button mat-flat-button color="primary" [disabled]="p.stock === 0" (click)="addToCart(p)">
            Add to Cart
          </button>
          <button mat-stroked-button color="accent" (click)="onToggleWishlist(p.id)">
            ❤ Wishlist
          </button>
        </div>
      </mat-card>

      <div class="mt-6">
        <h3 class="text-lg font-semibold mb-2">Avis clients</h3>
        <div *ngIf="reviews().length === 0" class="text-slate-600 mb-3">
          Aucun avis pour le moment.
        </div>
        <div *ngFor="let r of reviews(); trackBy: trackReview" class="border rounded p-3 mb-2">
          <div class="flex items-center justify-between">
            <div class="font-medium">{{ r.user }}</div>
            <div class="text-sm text-slate-500">{{ r.createdAt | date: 'medium' }}</div>
          </div>
          <div class="text-amber-600">Note: {{ r.rating }} / 5</div>
          <div class="text-slate-700">{{ r.comment }}</div>
        </div>

        <div *ngIf="isAuthenticated()" class="mt-4">
          <h4 class="font-medium mb-2">Laisser un avis</h4>
          <form (submit)="submitReview($event)" class="space-y-2">
            <label class="block">
              <span class="text-sm mr-2">Note</span>
              <select [(ngModel)]="rating" name="rating" class="border rounded px-2 py-1">
                <option *ngFor="let n of [1, 2, 3, 4, 5]" [value]="n">{{ n }}</option>
              </select>
            </label>
            <label class="block">
              <span class="text-sm block mb-1">Commentaire</span>
              <textarea
                [(ngModel)]="comment"
                name="comment"
                rows="3"
                class="w-full border rounded px-2 py-1"
              ></textarea>
            </label>
            <button mat-flat-button color="primary" type="submit">Envoyer</button>
          </form>
        </div>
      </div>
    </ng-container>
  `,
})
export class ProductDetailsPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartStore);
  private readonly snack = inject(MatSnackBar);
  private readonly store = inject(Store);
  private readonly auth = inject(AuthService);

  readonly productId = Number(this.route.snapshot.paramMap.get('id'));
  readonly product = signal<ProductDetails | null>(null);
  readonly reviews = this.store.selectSignal(selectReviewsByProduct(this.productId));
  rating = 5;
  comment = '';

  constructor() {
    const id = this.productId;
    this.http.get<ProductDetails>(`/api/products/${id}/`).subscribe((p) => this.product.set(p));
    this.store.dispatch(loadReviews({ productId: id }));
  }

  addToCart(p: ProductDetails) {
    this.cart.addItem({ product: { id: p.id, name: p.name, price: p.price }, quantity: 1 });
  }

  onToggleWishlist(id: number) {
    this.store.dispatch(toggleWishlist({ productId: id }));
    this.snack.open('Item added to wishlist', 'OK', { duration: 2000 });
  }

  trackReview = (_: number, r: { createdAt: string }) => r.createdAt;

  avgFromReviews(): number | null {
    const list = this.reviews();
    if (!list.length) return null;
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return +(sum / list.length).toFixed(1);
  }

  isAuthenticated() {
    return this.auth.isAuthenticated();
  }

  submitReview(ev: Event) {
    ev.preventDefault();
    const p = this.product();
    if (!p) return;
    this.store.dispatch(
      postReview({ productId: p.id, rating: this.rating, comment: this.comment }),
    );
    this.comment = '';
    this.snack.open('Avis envoyé', 'OK', { duration: 1800 });
  }
}
