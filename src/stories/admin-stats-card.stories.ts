import type { Meta, StoryObj } from '@storybook/angular';
import { AdminStatsCardComponent } from '../app/stories/admin-stats-card.component';

const meta: Meta<AdminStatsCardComponent> = {
  title: 'Admin/Stats Card',
  component: AdminStatsCardComponent,
  argTypes: {
    label: { control: 'text' },
    value: { control: 'number' },
    format: { control: { type: 'radio' }, options: ['number', 'currency'] },
  },
};
export default meta;

type Story = StoryObj<AdminStatsCardComponent>;

export const Users: Story = {
  args: { label: 'Utilisateurs', value: 128, format: 'number' },
};

export const Revenue: Story = {
  args: { label: "Chiffre d'affaires", value: 18452.35, format: 'currency' },
};
