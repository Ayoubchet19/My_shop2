import type { Meta, StoryObj } from '@storybook/angular';
import { CartSummaryComponent } from '../app/shop/cart/cart-summary.component';

const meta: Meta<CartSummaryComponent> = {
  title: 'Shop/CartSummary',
  component: CartSummaryComponent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<CartSummaryComponent>;

export const Empty: Story = {
  args: {
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
  },
};

export const WithItems: Story = {
  args: {
    items: [
      { id: 1, name: 'Notebook', price: 9.99, quantity: 2 },
      { id: 2, name: 'Pen pack', price: 2.5, quantity: 3 },
    ],
    subtotal: 9.99 * 2 + 2.5 * 3,
    tax: +((9.99 * 2 + 2.5 * 3) * 0.2).toFixed(2),
    total: +((9.99 * 2 + 2.5 * 3) * 1.2).toFixed(2),
  },
};
