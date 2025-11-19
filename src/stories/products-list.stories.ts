import { Meta, StoryObj } from '@storybook/angular';
import { ProductsList } from '../app/components/products-list/products-list';

const meta: Meta<ProductsList> = {
  title: 'Components/Products List',
  component: ProductsList,
};

export default meta;
type Story = StoryObj<ProductsList>;

export const Default: Story = {
  args: {},
};
