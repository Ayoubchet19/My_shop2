import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IProducts, ProductRating, ProductsParams } from '../types/globalTypes';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly ApiUrl = '/api/products/';

  private readonly _products$ = new BehaviorSubject<IProducts | null>(null);
  readonly products$ = this._products$.asObservable();

  constructor(private http: HttpClient) {}

  loadProducts(
    productParams: ProductsParams = { page: 1, pageSize: 10, minRating: 0, ordering: '' },
  ): Observable<IProducts> {
    const params = new HttpParams({
      fromObject: {
        page: productParams.page,
        page_size: productParams.pageSize,
        min_rating: productParams.minRating,
        ordering: productParams.ordering,
      } as any,
    });

    return this.http.get<IProducts>(this.ApiUrl, { params }).pipe(
      tap((data) => {
        this._products$.next(data);
      }),
      catchError((err) => {
        console.error('Failed to load products', err);
        return throwError(() => new Error(`${err.status} ${err.statusText}`));
      }),
    );
  }

  getProductRating(id: number): Observable<ProductRating> {
    return this.http.get<ProductRating>(`${this.ApiUrl}${id}/rating/`);
  }
}
