import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { ProductDetailsPageComponent } from '../app/shop/product-details/product-details-page.component';

// ProductDetailsPage fetches via HttpClient; for Storybook we override the route param
// and let MSW (if running) supply the network response. ArgTypes allow toggling id.

const meta: Meta<ProductDetailsPageComponent> = {
  title: 'Shop/ProductDetailsPage',
  component: ProductDetailsPageComponent,
  tags: ['autodocs'],
  decorators: [
    () => ({
      moduleMetadata: {
        imports: [HttpClientModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
          },
        ],
      },
    }),
  ],
};
export default meta;

type Story = StoryObj<ProductDetailsPageComponent>;

export const Default: Story = {};

export const SecondProduct: Story = {
  name: 'Product ID 2',
  decorators: [
    () => ({
      moduleMetadata: {
        imports: [HttpClientModule],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { paramMap: convertToParamMap({ id: '2' }) } },
          },
        ],
      },
    }),
  ],
};
