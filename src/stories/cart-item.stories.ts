import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from '../app/shop/cart/cart-item.component';

const meta: Meta<CartItemComponent> = {
  title: 'Shop/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<CartItemComponent>;

export const Default: Story = {
  args: {
    item: { id: 1, name: 'Notebook', price: 9.99, quantity: 2 },
  },
};

export const LargeQuantity: Story = {
  args: {
    item: { id: 2, name: 'Pen pack', price: 2.5, quantity: 10 },
  },
};
