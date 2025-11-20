import type { Meta, StoryObj } from '@storybook/react';
import { HomePage } from '../src/components/HomePage';

const meta: Meta<typeof HomePage> = {
  title: 'Pages/HomePage',
  component: HomePage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HomePage>;

export const Default: Story = {};

export const WithCustomContent: Story = {
  render: () => (
    <div>
      <HomePage />
    </div>
  ),
};

