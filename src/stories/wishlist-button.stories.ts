import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { WishlistButtonComponent } from '../app/stories/wishlist-button.component';

const meta: Meta<WishlistButtonComponent> = {
  title: 'Shop/Wishlist Button',
  component: WishlistButtonComponent,
  argTypes: {
    active: { control: { type: 'boolean' } },
    toggle: { action: 'toggle' },
  },
};
export default meta;

type Story = StoryObj<WishlistButtonComponent>;

export const Default: Story = {
  args: {
    active: false,
  },
  render: (args) => ({ props: { ...args, toggle: action('toggle') } }),
};

export const Active: Story = {
  args: { active: true },
  render: (args) => ({ props: { ...args, toggle: action('toggle') } }),
};
