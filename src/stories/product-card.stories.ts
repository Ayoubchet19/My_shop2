import type { Meta, StoryObj } from '@storybook/angular';
import { ProductCard } from '../app/components/product-card/product-card';

const meta: Meta<ProductCard> = {
  title: 'Components/ProductCard',
  component: ProductCard,
  tags: ['autodocs'],
  // Use template-only stories to avoid DI/store arg typing
  render: (args) => ({
    props: args,
  }),
};

export default meta;
type Story = StoryObj<ProductCard>;

export const Default: Story = {
  args: {
    id: 1,
    name: 'Tampon Encreur',
    price: 5,
    created_at: '2025-04-20T15:00:00Z',
    avgRating: 4,
  },
};

export const HighRating: Story = {
  args: {
    id: 2,
    name: 'Luxury Notebook',
    price: 30,
    created_at: '2025-05-01T09:00:00Z',
    avgRating: 5,
  },
};

export const LowRating: Story = {
  args: {
    id: 3,
    name: 'Cheap Pen',
    price: 1.5,
    created_at: '2025-03-11T12:00:00Z',
    avgRating: 2,
  },
};
