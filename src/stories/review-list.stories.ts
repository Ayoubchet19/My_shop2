import type { Meta, StoryObj } from '@storybook/angular';
import { ReviewItem, ReviewListComponent } from '../app/stories/review-list.component';

const meta: Meta<ReviewListComponent> = {
  title: 'Shop/Review List',
  component: ReviewListComponent,
  argTypes: {
    reviews: { control: 'object' },
  },
};
export default meta;

type Story = StoryObj<ReviewListComponent>;

const sample: ReviewItem[] = [
  { user: 'Ayoub', rating: 5, comment: 'Excellent !', createdAt: new Date().toISOString() },
  {
    user: 'Maria',
    rating: 4,
    comment: 'Très bon',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const Empty: Story = {
  args: { reviews: [] },
};

export const WithData: Story = {
  args: { reviews: sample },
};
