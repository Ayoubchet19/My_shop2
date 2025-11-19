import { HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import type { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { ProductDetailsPageComponent } from '../app/shop/product-details/product-details-page.component';

const meta: Meta<ProductDetailsPageComponent> = {
  title: 'Shop/ProductDetailsPage',
  component: ProductDetailsPageComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: '1' }) } },
        },
      ],
    }),
  ],
};
export default meta;

type Story = StoryObj<ProductDetailsPageComponent>;

export const Default: Story = {
  args: {},
};
