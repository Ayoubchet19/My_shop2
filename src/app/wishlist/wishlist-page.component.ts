import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, signal } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProductsService } from '../services/products.service';
import { CartStore } from '../state/cart/cart.selectors';
import { loadWishlist, removeWishlist } from '../state/wishlist/wishlist.actions';
import { selectWishlistState } from '../state/wishlist/wishlist.reducer';

@Component({
  selector: 'app-wishlist-page',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule],
  template: `
    <h1 class="text-2xl font-semibold mb-4">Ma wishlist</h1>
    @if (ids().length === 0) {
      <p class="text-slate-600">Votre wishlist est vide.</p>
    } @else {
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        @for (prod of products(); track prod.id) {
          <div class="rounded border p-3 space-y-2">
            <a
              [routerLink]="['/products', prod.id]"
              class="font-medium text-indigo-700 hover:underline"
              >{{ prod.name }}</a
            >
            <div class="text-sm text-slate-600">{{ prod.price | currency: 'EUR' }}</div>
            <div class="flex gap-2">
              <button
                (click)="addToCart(prod.id)"
                class="px-3 py-1 rounded bg-indigo-600 text-white"
              >
                Ajouter au panier
              </button>
              <button (click)="remove(prod.id)" class="px-3 py-1 rounded bg-pink-600 text-white">
                Retirer
              </button>
            </div>
          </div>
        }
      </div>
    }
  `,
})
export class WishlistPageComponent {
  private readonly store = inject(Store);
  private readonly productsService = inject(ProductsService);
  private readonly http = inject(HttpClient);
  private readonly cart = inject(CartStore);
  private readonly snack = inject(MatSnackBar);

  ids = signal<number[]>([]);
  products = signal<any[]>([]);

  constructor() {
    this.store.dispatch(loadWishlist());
    // Ensure products list is loaded so we can render wishlist items
    this.productsService.loadProducts().subscribe();
    effect(() => {
      const state = this.store.selectSignal(selectWishlistState)();
      this.ids.set(state.ids);
    });
    // derive products from service stream when loaded; fallback to individual fetches
    this.productsService.products$.subscribe((data) => {
      const ids = this.ids();
      const list = data?.results ?? [];
      const matched = list.filter((p: any) => ids.includes(p.id));
      if (matched.length === ids.length) {
        this.products.set(matched);
      } else {
        // fetch missing ones individually
        const missing = ids.filter((id) => !matched.some((m) => m.id === id));
        if (missing.length === 0) {
          this.products.set(matched);
        } else {
          Promise.all(
            missing.map((id) =>
              this.http
                .get(`/api/products/${id}/`)
                .toPromise()
                .catch(() => null),
            ),
          ).then((extras) => {
            const extraFiltered = extras.filter((e) => !!e);
            this.products.set([...matched, ...extraFiltered]);
          });
        }
      }
    });
  }

  addToCart(id: number) {
    const p = this.products().find((x: any) => x.id === id);
    if (!p) return;
    this.cart.addItem({ product: { id: p.id, name: p.name, price: p.price }, quantity: 1 });
    this.snack.open('Article ajouté au panier', 'OK', { duration: 1800 });
  }

  remove(id: number) {
    this.store.dispatch(removeWishlist({ productId: id }));
  }
}
