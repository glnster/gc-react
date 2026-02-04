import { useState } from 'react'
import { Home } from './pages/Home'
import { TodoApp } from './components/TodoApp'

type Page = 'home' | 'todo'

function App() {
  const [page, setPage] = useState<Page>('home')

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex gap-4">
          <button
            onClick={() => setPage('home')}
            className={`px-3 py-1 rounded ${
              page === 'home'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => setPage('todo')}
            className={`px-3 py-1 rounded ${
              page === 'todo'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            Todo App
          </button>
          <a
            href="http://localhost:6006"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Storybook ↗
          </a>
        </div>
      </nav>

      {/* Page Content */}
      {page === 'home' && <Home />}
      {page === 'todo' && <TodoApp />}
    </div>
  )
}

export default App

