import { http, HttpResponse } from 'msw'

// Import fixtures
import initialTodos from './fixtures/todos.json'

// In-memory store (resets on page refresh)
let todos = [...initialTodos] as Array<{ id: number; text: string; completed: boolean }>
let nextId = Math.max(...todos.map((t) => t.id)) + 1

export const handlers = [
  // GET /api/todos - List all todos
  http.get('/api/todos', () => {
    return HttpResponse.json(todos)
  }),

  // GET /api/todos/:id - Get single todo
  http.get('/api/todos/:id', ({ params }) => {
    const todo = todos.find((t) => t.id === Number(params.id))
    if (!todo) {
      return new HttpResponse(null, { status: 404 })
    }
    return HttpResponse.json(todo)
  }),

  // POST /api/todos - Create new todo
  http.post('/api/todos', async ({ request }) => {
    const body = (await request.json()) as { text: string }
    const newTodo = {
      id: nextId++,
      text: body.text,
      completed: false,
    }
    todos.push(newTodo)
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  // PUT /api/todos/:id - Update todo
  http.put('/api/todos/:id', async ({ params, request }) => {
    const body = (await request.json()) as { text?: string; completed?: boolean }
    const index = todos.findIndex((t) => t.id === Number(params.id))
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    todos[index] = { ...todos[index], ...body }
    return HttpResponse.json(todos[index])
  }),

  // PATCH /api/todos/:id - Partial update (toggle completed)
  http.patch('/api/todos/:id', async ({ params, request }) => {
    const body = (await request.json()) as { completed?: boolean }
    const index = todos.findIndex((t) => t.id === Number(params.id))
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    todos[index] = { ...todos[index], ...body }
    return HttpResponse.json(todos[index])
  }),

  // DELETE /api/todos/:id - Delete todo
  http.delete('/api/todos/:id', ({ params }) => {
    const index = todos.findIndex((t) => t.id === Number(params.id))
    if (index === -1) {
      return new HttpResponse(null, { status: 404 })
    }
    todos.splice(index, 1)
    return new HttpResponse(null, { status: 204 })
  }),
]

// Reset function for testing
export const resetTodos = () => {
  todos = [...initialTodos] as Array<{ id: number; text: string; completed: boolean }>
  nextId = Math.max(...todos.map((t) => t.id)) + 1
}
