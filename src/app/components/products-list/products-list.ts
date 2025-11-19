import { Component, Input, EventEmitter, Output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { IProducts } from '../../types/globalTypes';

@Component({
  selector: 'app-products-list',
  imports: [
    CurrencyPipe,
    DatePipe,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  @Input({ required: true }) products!: IProducts;
  @Input() ordering!: string;
  @Output() orderingChange = new EventEmitter<string>();
  @Output() pageChange = new EventEmitter<any>();
}
