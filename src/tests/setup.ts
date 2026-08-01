/**
 * Vitest global test setup.
 * Runs before every test file.
 */
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from './mocks/server';

// Start MSW server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Clean up after each test
afterEach(() => {
  cleanup(); // React Testing Library cleanup
  server.resetHandlers(); // Reset any test-specific handlers
});

// Stop server after all tests
afterAll(() => server.close());
