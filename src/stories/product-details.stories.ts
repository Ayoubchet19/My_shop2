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
  argTypes: {
    productId: {
      name: 'productId',
      description: 'Simulated route param id used to fetch product',
      control: { type: 'number', min: 1, max: 50 },
      defaultValue: 1,
    },
  },
  decorators: [
    (storyFunc) => {
      // Wrap with dynamic provider based on args
      const story = storyFunc();
      const id = (story?.args as any)?.productId ?? 1;
      return {
        ...story,
        moduleMetadata: {
          imports: [HttpClientModule],
          providers: [
            {
              provide: ActivatedRoute,
              useValue: { snapshot: { paramMap: convertToParamMap({ id: String(id) }) } },
            },
          ],
        },
      };
    },
  ],
};
export default meta;

type Story = StoryObj<ProductDetailsPageComponent>;

type Story = StoryObj<ProductDetailsPageComponent>;

export const Default: Story = {
  args: { productId: 1 },
};

export const SecondProduct: Story = {
  args: { productId: 2 },
};
