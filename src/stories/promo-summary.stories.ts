import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/angular';
import { PromoSummaryComponent } from '../app/stories/promo-summary.component';

const meta: Meta<PromoSummaryComponent> = {
  title: 'Checkout/Promo Summary',
  component: PromoSummaryComponent,
  argTypes: {
    itemsTotal: { control: { type: 'number' } },
    discount: { control: { type: 'number' } },
    shipping: { control: { type: 'number' } },
    taxes: { control: { type: 'number' } },
    grandTotal: { control: { type: 'number' } },
    appliedPromos: { control: 'object' },
    onApply: { action: 'onApply' },
  },
};
export default meta;

type Story = StoryObj<PromoSummaryComponent>;

export const Default: Story = {
  args: {
    itemsTotal: 100,
    discount: 10,
    shipping: 0,
    taxes: 18,
    grandTotal: 108,
    appliedPromos: ['WELCOME10'],
  },
  render: (args) => ({ props: { ...args, onApply: action('onApply') } }),
};
