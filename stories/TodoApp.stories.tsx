import type { Meta, StoryObj } from '@storybook/react'
import { http, HttpResponse, delay } from 'msw'
import { TodoApp } from '../src/components/TodoApp'

const meta: Meta<typeof TodoApp> = {
  title: 'Examples/TodoApp',
  component: TodoApp,
}

export default meta
type Story = StoryObj<typeof TodoApp>

// Uses default handlers from preview.ts
export const Default: Story = {}

// Loading state
export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/todos', async () => {
          await delay('infinite')
          return HttpResponse.json([])
        }),
      ],
    },
  },
}

// Empty state
export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/todos', () => HttpResponse.json([])),
        http.post('/api/todos', async ({ request }) => {
          const body = (await request.json()) as { text: string }
          return HttpResponse.json(
            { id: 1, text: body.text, completed: false },
            { status: 201 }
          )
        }),
      ],
    },
  },
}

// Error state
export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/todos', () => new HttpResponse(null, { status: 500 })),
      ],
    },
  },
}

// All completed
export const AllCompleted: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/todos', () =>
          HttpResponse.json([
            { id: 1, text: 'Task 1', completed: true },
            { id: 2, text: 'Task 2', completed: true },
            { id: 3, text: 'Task 3', completed: true },
          ])
        ),
      ],
    },
  },
}

// Many todos
export const ManyTodos: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/todos', () => {
          const todos = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            text: `Todo item ${i + 1}`,
            completed: i % 3 === 0,
          }))
          return HttpResponse.json(todos)
        }),
      ],
    },
  },
}
