import { AsyncPipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort } from '@angular/material/sort';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ProductCard } from '../components/product-card/product-card';
import { ProductsList } from '../components/products-list/products-list';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    AsyncPipe,
    ProductsList,
    RouterLink,
    RouterOutlet,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatCard,
    MatButtonModule,
    ProductCard,
  ],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements AfterViewInit {
  private readonly productsService = inject(ProductsService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly products$ = this.productsService.products$;
  readonly ordering = signal<string>('');
  readonly page = signal<number>(1);
  readonly pageSize = signal<number>(10);
  readonly viewMode = signal<'grid' | 'table'>('grid');

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {
    effect(() => {
      const ordering = this.ordering();
      const page = this.page();
      const pageSize = this.pageSize();

      this.productsService
        .loadProducts({ page, pageSize, minRating: 0, ordering })
        .subscribe(() => {
          this.cdr.detectChanges();
        });
    });
  }

  ngAfterViewInit() {}

  onOrderingChange(value: string) {
    this.ordering.set(value);
    this.page.set(1);
  }

  onPageChange(event: any) {
    this.page.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  setView(mode: 'grid' | 'table') {
    this.viewMode.set(mode);
  }
}
