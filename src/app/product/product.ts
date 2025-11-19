import { Component, inject } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { ProductRating } from '../types/globalTypes';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { MatCard } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AsyncPipe } from '@angular/common';
import { ProductCard } from '../components/product-card/product-card';

@Component({
  selector: 'app-product',
  imports: [MatCard, MatProgressSpinner, AsyncPipe, ProductCard],
  templateUrl: './product.html',
  styleUrl: './product.css',
})
export class Product {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);

  /** Get productId from route params and fetch rating */
  readonly rating$: Observable<ProductRating> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = Number(params.get('id'));
      return this.productsService.getProductRating(id);
    }),
  );
}
