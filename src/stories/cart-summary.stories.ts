import type { Meta, StoryObj } from '@storybook/angular';
import { CartSummaryComponent } from '../app/shop/cart/cart-summary.component';

// Storybook configuration for CartSummary with adjustable monetary values

const meta: Meta<CartSummaryComponent> = {
  title: 'Shop/CartSummary',
  component: CartSummaryComponent,
  tags: ['autodocs'],
  argTypes: {
    items: { control: 'object', description: 'Array of cart items' },
    subtotal: { control: { type: 'number', min: 0 }, description: 'Subtotal before tax' },
    tax: { control: { type: 'number', min: 0 }, description: 'Tax amount' },
    total: { control: { type: 'number', min: 0 }, description: 'Final total including tax' },
  },
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

export const ManyItems: Story = {
  args: {
    items: [
      { id: 1, name: 'Notebook', price: 9.99, quantity: 2 },
      { id: 2, name: 'Pen pack', price: 2.5, quantity: 5 },
      { id: 3, name: 'USB Cable', price: 12.49, quantity: 1 },
    ],
    subtotal: +(9.99 * 2 + 2.5 * 5 + 12.49).toFixed(2),
    tax: +((9.99 * 2 + 2.5 * 5 + 12.49) * 0.2).toFixed(2),
    total: +((9.99 * 2 + 2.5 * 5 + 12.49) * 1.2).toFixed(2),
  },
};
