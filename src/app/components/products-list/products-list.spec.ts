import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IProducts } from '../../types/globalTypes';
import { ProductsList } from './products-list';

describe('ProductsList', () => {
  let component: ProductsList;
  let fixture: ComponentFixture<ProductsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsList],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsList);
    component = fixture.componentInstance;
    // Provide required inputs
    const empty: IProducts = { count: 0, next: null, previous: null, results: [] };
    component.products = empty;
    component.ordering = '';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
