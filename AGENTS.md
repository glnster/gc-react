# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development
```bash
./dock dev              # Start Docker dev environment with HMR
./dock dev -d           # Start in background
./dock stop             # Stop containers
./dock shell            # Open shell in container
npm run dev             # Run Vite dev server directly (non-Docker)
```

### Build & Lint
```bash
npm run build           # TypeScript check + Vite production build
npm run lint            # ESLint with zero warnings allowed
```

### Testing
```bash
npm test                # Run Vitest unit tests once
npm run test:watch      # Run unit tests in watch mode
npm run test:coverage   # Unit tests with coverage
npm run test:e2e        # Playwright E2E tests (starts dev server)
npm run test:e2e:ui     # E2E tests with Playwright UI
npx playwright test tests/e2e/specific.spec.ts  # Run single E2E test
```

### Storybook
```bash
npm run storybook       # Start Storybook at localhost:6006
npm run build-storybook # Build static Storybook
```

## Architecture

### Docker-First Development
- Development runs in `app-dev` container via `./dock dev`
- Production uses multi-stage build: Node builder → nginx:alpine
- Source is volume-mounted for HMR; `node_modules` uses named volume
- SSL certificates mounted read-only in production

### MSW (Mock Service Worker) API Mocking
MSW is pre-configured for development and Storybook:
- **Handlers**: `src/mocks/handlers.ts` - Define mock API endpoints
- **Fixtures**: `src/mocks/fixtures/` - JSON data files
- **Browser worker**: `src/mocks/browser.ts` - Bootstrapped in `main.tsx`
- Disable with `VITE_DISABLE_MOCKS=true`
- Stories automatically inherit MSW handlers; override per-story via `parameters.msw.handlers`

### Storybook + MSW Integration
- Stories live in `stories/` directory (not co-located)
- `.storybook/preview.ts` initializes MSW and imports default handlers
- Tailwind styles loaded globally in preview

### Testing Strategy
- **Unit tests**: Co-located with source (`src/**/*.test.tsx`), uses Vitest + React Testing Library
- **E2E tests**: `tests/e2e/` directory, uses Playwright
- Test setup: `src/test/setup.ts` imports `@testing-library/jest-dom`

### Project Layout
```
src/
├── components/     # React components + co-located unit tests
├── pages/          # Page-level components
├── mocks/          # MSW handlers and fixtures
├── test/           # Vitest setup
├── types/          # TypeScript type definitions
└── main.tsx        # App entry (includes MSW bootstrap)
stories/            # Storybook stories (*.stories.tsx)
tests/e2e/          # Playwright E2E tests
docs/               # Architecture, development, testing guides
```

## Environment Variables
- `.env.development` - Dev environment (VITE_PORT, VITE_API_URL)
- `.env.production` - Production (ports, SSL paths)
- `VITE_DISABLE_MOCKS=true` - Disable MSW mocking
