import type { Meta, StoryObj } from '@storybook/angular';
import { CartItemComponent } from '../app/shop/cart/cart-item.component';

// Storybook configuration for CartItem with interactive controls

const meta: Meta<CartItemComponent> = {
  title: 'Shop/CartItem',
  component: CartItemComponent,
  tags: ['autodocs'],
  argTypes: {
    item: {
      description: 'Cart item data (id, name, price, quantity)',
      control: 'object',
    },
    quantityChange: { action: 'quantityChange', description: 'Emitted when quantity changes' },
    remove: { action: 'remove', description: 'Emitted when remove button clicked' },
  },
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

export const Single: Story = {
  args: {
    item: { id: 3, name: 'USB Cable', price: 12.49, quantity: 1 },
  },
};
