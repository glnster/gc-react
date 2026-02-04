# Testing Guide

## Overview

GC Scaffold uses two testing frameworks:
- **Vitest** for unit and component testing
- **Playwright** for end-to-end (E2E) testing

---

## Unit Testing with Vitest

Vitest is used for testing individual components and utilities in isolation.

### Running Unit Tests

```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run tests with coverage report
```

### Test Location

Unit tests are co-located with source files using the naming convention:
- `*.test.ts` or `*.test.tsx`
- `*.spec.ts` or `*.spec.tsx`

Example: `src/components/Button.test.tsx`

### Writing Unit Tests

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MyComponent } from './MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles user interaction', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()

    render(<MyComponent onClick={handleClick} />)
    await user.click(screen.getByRole('button'))

    expect(handleClick).toHaveBeenCalled()
  })
})
```

### Testing Utilities

- **@testing-library/react**: Render components and query the DOM
- **@testing-library/user-event**: Simulate user interactions
- **@testing-library/jest-dom**: Additional matchers like `toBeInTheDocument()`
- **vi**: Vitest's mocking utility (similar to Jest's `jest`)

### Configuration

Vitest is configured in `vite.config.ts`:

```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/test/setup.ts',
  include: ['src/**/*.{test,spec}.{ts,tsx}'],
}
```

---

## End-to-End Testing with Playwright

## Running E2E Tests

### Run All Tests

```bash
npm run test:e2e
```

This will:
- Start the development server
- Run all E2E tests
- Generate HTML reports

### Run Tests in UI Mode

For interactive test debugging:

```bash
npm run test:e2e:ui
```

This opens Playwright's UI mode where you can:
- See tests running in real-time
- Debug individual tests
- View test traces

### Run Tests in Headed Mode

To see the browser while tests run:

```bash
npm run test:e2e:headed
```

### Run Specific Test File

```bash
npx playwright test tests/e2e/home.spec.ts
```

### Run Tests in Specific Browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

Tests are configured in `playwright.config.ts`:

- **Test Directory**: `./tests/e2e`
- **Base URL**: `http://localhost:5173` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Browsers**: Chromium, Firefox, WebKit
- **Retries**: 2 retries on CI, 0 locally
- **Screenshots**: Captured on failure
- **Videos**: Recorded on failure
- **Traces**: Collected on first retry

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    // Your test code here
  });
});
```

### Common Patterns

**Navigate to a page:**
```typescript
await page.goto('/');
```

**Check element visibility:**
```typescript
await expect(page.getByRole('heading', { name: 'Title' })).toBeVisible();
```

**Check text content:**
```typescript
await expect(page.getByText('Some text')).toBeVisible();
```

**Interact with elements:**
```typescript
await page.getByRole('button', { name: 'Click me' }).click();
await page.getByLabel('Email').fill('test@example.com');
```

**Test responsive design:**
```typescript
await page.setViewportSize({ width: 375, height: 667 }); // Mobile
await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop
```

## Test Examples

### Home Page Test

See `tests/e2e/home.spec.ts` for a complete example covering:
- Page loading
- Content visibility
- Responsive design
- Page title

## Running Tests in Docker

Tests can be run in the development container:

```bash
./dock shell
npm run test:e2e
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## Best Practices

1. **Use semantic selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Test user flows**: Focus on what users do, not implementation details
3. **Keep tests independent**: Each test should be able to run in isolation
4. **Use test fixtures**: Share setup code between tests
5. **Test accessibility**: Use role-based selectors which also test accessibility
6. **Test responsive design**: Verify layouts work on different screen sizes
7. **Use meaningful test names**: Describe what the test verifies

## Debugging Tests

### Debug Mode

Run tests in debug mode:

```bash
npx playwright test --debug
```

### View Test Traces

After a test run, view traces:

```bash
npx playwright show-trace trace.zip
```

### Screenshots and Videos

- Screenshots are saved on failure in `test-results/`
- Videos are saved on failure in `test-results/`
- HTML reports are generated in `playwright-report/`

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

This opens an interactive report showing:
- Test results
- Screenshots
- Videos
- Traces
- Test timeline

