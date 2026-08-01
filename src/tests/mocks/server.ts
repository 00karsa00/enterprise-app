/**
 * MSW (Mock Service Worker) server for testing.
 *
 * WHY: Tests should not make real HTTP requests.
 * MSW intercepts requests at the network level, making tests reliable
 * and fast while testing the actual HTTP logic in repositories.
 */
import { setupServer } from 'msw/node';

import { authHandlers } from './handlers/auth.handlers';
import { employeeHandlers } from './handlers/employee.handlers';

export const server = setupServer(
  ...authHandlers,
  ...employeeHandlers,
);
