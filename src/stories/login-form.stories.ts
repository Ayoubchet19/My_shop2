import { Meta, StoryObj } from '@storybook/angular';
import { moduleMetadata } from '@storybook/angular';
import { fn } from 'storybook/test';
import { LoginForm } from '../app/components/login-form/login-form';

const meta: Meta<LoginForm> = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  decorators: [
    moduleMetadata({
      providers: [],
    }),
  ],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<LoginForm>;

export const Default: Story = {
  args: {
    submit: () => fn(),
  },
};
