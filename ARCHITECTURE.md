# Enterprise Frontend Architecture

> Production-grade React + TypeScript application using Clean Architecture,
> Domain-Driven Design, and Hexagonal Architecture principles.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Dependency Flow](#dependency-flow)
3. [Folder Structure](#folder-structure)
4. [Layer Responsibilities](#layer-responsibilities)
5. [Request Lifecycle](#request-lifecycle)
6. [Authentication Flow](#authentication-flow)
7. [State Management Flow](#state-management-flow)
8. [Error Handling Flow](#error-handling-flow)
9. [Migration Guides](#migration-guides)
10. [Testing Guide](#testing-guide)
11. [Coding Standards](#coding-standards)
12. [Performance Guide](#performance-guide)
13. [Security Best Practices](#security-best-practices)
14. [Scalability Strategy](#scalability-strategy)
15. [Deployment Guide](#deployment-guide)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        UI Layer                          │
│              src/app/  +  src/modules/*/pages/           │
├─────────────────────────────────────────────────────────┤
│                   Feature Modules                        │
│   src/modules/{feature}/{hooks,components,store,service} │
├─────────────────────────────────────────────────────────┤
│                    Core Services                         │
│                    src/core/config/                      │
├─────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                    │
│   src/infrastructure/{http,storage,auth,cache,...}       │
├─────────────────────────────────────────────────────────┤
│                Third-Party Libraries                     │
│         axios | zustand | react-query | sonner           │
└─────────────────────────────────────────────────────────┘
```

**The golden rule: dependencies only flow downward.** A feature module never
imports from another feature module. Infrastructure never imports from modules.

---

## Dependency Flow

```
EmployeeListPage
  └── useEmployeeList (hook)
        └── useQueryWrapper (cache abstraction)
              └── employeeService.getEmployees()
                    └── employeeRepository.findAll()
                          └── httpClient.get()
                                └── AxiosHttpClient → axios
```

Each arrow represents a layer boundary. To replace `axios`:

1. Create `FetchHttpClient` implementing `IHttpClient`
2. Change one line in `HttpClientFactory.create()`
3. Done — zero changes in any feature module.

---

## Folder Structure

```
src/
├── app/                     # Application shell
│   ├── guards/              # Route guards (ProtectedRoute, PublicRoute, PermissionGuard)
│   ├── layout/              # AppLayout — sidebar + main content shell
│   ├── pages/               # App-level pages (Dashboard, 404)
│   ├── providers/           # Provider composition (AppProviders)
│   └── router/              # AppRouter — route tree
│
├── core/                    # Pure configuration, no side effects
│   └── config/
│       ├── env.ts           # Zod-validated environment variables
│       ├── api.ts           # API endpoints and config constants
│       ├── routes.ts        # Route constants + buildRoute helper
│       ├── permissions.ts   # Permission/role constants + helpers
│       └── features.ts      # Feature flag constants
│
├── infrastructure/          # Third-party wrappers — THE ONLY PLACE libs are used
│   ├── http/                # IHttpClient, AxiosHttpClient, FetchHttpClient, HttpError
│   ├── storage/             # IStorage, LocalStorageAdapter, SessionStorageAdapter
│   ├── auth/                # IAuthService, JwtAuthService, AuthFactory
│   ├── cache/               # useQueryWrapper, useMutationWrapper (TanStack Query wrappers)
│   ├── notification/        # INotificationService, SonnerNotificationAdapter
│   ├── logger/              # ILogger, ConsoleLogger, LoggerFactory
│   └── analytics/           # IAnalyticsService, NoopAnalyticsAdapter, AnalyticsFactory
│
├── modules/                 # Feature modules — each self-contained DDD bounded context
│   ├── auth/
│   │   ├── components/      # LoginForm
│   │   ├── constants/       # AUTH_QUERY_KEYS, AUTH_ERROR_CODES
│   │   ├── hooks/           # useAuth, useCurrentUser
│   │   ├── pages/           # LoginPage, ForgotPasswordPage, ResetPasswordPage
│   │   ├── routes/          # AuthRoutes (lazy loaded)
│   │   ├── services/        # AuthDomainService
│   │   ├── store/           # useAuthStore (Zustand hidden)
│   │   ├── types/           # Auth module types
│   │   ├── utils/           # isTokenExpired, getSafeRedirectPath
│   │   ├── validators/      # loginSchema, resetPasswordSchema
│   │   └── index.ts         # Public API boundary
│   │
│   └── employee/
│       ├── components/      # EmployeeForm, EmployeeTable, EmployeeStatusBadge
│       ├── constants/       # EMPLOYEE_QUERY_KEYS, status labels
│       ├── hooks/           # useEmployeeList, useCreateEmployee, etc.
│       ├── pages/           # EmployeeListPage, EmployeeDetailPage
│       ├── repository/      # IEmployeeRepository, EmployeeRepository
│       ├── routes/          # EmployeeRoutes (lazy loaded)
│       ├── services/        # EmployeeService (business logic)
│       ├── store/           # useEmployeeStore (Zustand hidden)
│       ├── types/           # Employee domain types
│       ├── utils/           # getEmployeeInitials, getYearsOfService
│       ├── validators/      # createEmployeeSchema, updateEmployeeSchema
│       └── index.ts         # Public API boundary
│
├── shared/                  # Cross-cutting, module-agnostic code
│   ├── ui/                  # AppButton, AppInput, AppTable, AppModal, AppDrawer, ...
│   ├── form/                # AppForm, AppTextField, AppSelectField, AppDatePicker, ...
│   ├── errors/              # ErrorBoundary
│   └── hooks/               # useDebounce, useDisclosure, usePagination, usePermissions
│
├── styles/                  # Global CSS + design tokens
│   ├── global.css           # Reset, base styles, CSS variables
│   └── variables.css        # Design token definitions
│
├── types/                   # Global domain types (no library types)
│   ├── common.types.ts      # ID, PaginatedResponse, AppError, etc.
│   └── auth.types.ts        # AuthUser, AuthTokens, LoginCredentials
│
└── tests/                   # Test infrastructure
    ├── setup.ts             # Vitest global setup + MSW server
    ├── mocks/               # MSW handlers
    │   └── handlers/        # auth.handlers, employee.handlers
    ├── utils/               # renderWithProviders
    └── {infrastructure|modules|shared}/  # Test files mirroring src/
```

---

## Layer Responsibilities

### `src/app/`

**Why it exists:** Composes the application. Routes, layout, providers, guards.

| Allowed dependencies                                        | Forbidden dependencies  |
| ----------------------------------------------------------- | ----------------------- |
| shared/, modules/_/routes, modules/_/pages, infrastructure/ | Direct third-party libs |

**Best practice:** `App.tsx` should be 5 lines. All setup goes in `AppProviders`.

**Anti-pattern:** Business logic, API calls, or state management in layout/router files.

---

### `src/core/config/`

**Why it exists:** Single source of truth for all configuration. No side effects.

| Allowed                       | Forbidden                               |
| ----------------------------- | --------------------------------------- |
| zod (for env validation only) | axios, react-query, zustand, any UI lib |

**Best practice:** Use `ROUTES.EMPLOYEES` not `'/employees'`. Rename a route in one place.

**Anti-pattern:** Putting API call logic, service instantiation, or UI logic here.

---

### `src/infrastructure/`

**Why it exists:** The ONLY place third-party libraries are imported.
Each sub-system provides an interface (Port) and one or more implementations (Adapters).

| Allowed                                                          | Forbidden                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------- |
| axios, react-query, zustand, sonner (within their adapters only) | React components, business logic, feature-specific code |

**Best practice:** Every infrastructure service exports a singleton (e.g., `httpClient`, `notify`, `logger`).

**Anti-pattern:** Feature modules importing `from 'axios'` or `from 'zustand'` directly.

**Switching a library:**

- HTTP: Change `HttpClientFactory.create()` — return `FetchHttpClient` instead of `AxiosHttpClient`
- Notifications: Change `NotificationFactory.create()` — return `ToastifyAdapter`
- State: Rewrite `*Store.ts` files using Redux instead of Zustand
- Cache: Rewrite `use*Wrapper.ts` files using SWR instead of TanStack Query

---

### `src/modules/{feature}/`

**Why it exists:** Encapsulates a complete business domain. Independently portable.

| Allowed                                                                  | Forbidden                                                          |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| @infrastructure/* (via abstractions), @shared/_, @core/config/_, @/types | axios, fetch, localStorage, react-query, zustand, UI libs directly |

**Best practice:** Only export through `index.ts`. Other modules import `from '@modules/employee'`, never from deep paths.

**Anti-pattern:** Module A importing from `@modules/moduleB/internal/SomeFile`.

---

### `src/shared/`

**Why it exists:** Cross-cutting concerns shared by all modules.
UI components, form components, hooks, error boundaries.

| Allowed                                                                 | Forbidden                              |
| ----------------------------------------------------------------------- | -------------------------------------- |
| react-hook-form (in form/ only), @infrastructure/cache (in hooks/ only) | Feature-specific logic, axios, zustand |

**Best practice:** AppButton, not `<button>`. AppInput, not `<input>`. Switching UI libraries = changing shared/ui only.

---

## Request Lifecycle

```
User action (click "Save Employee")
  │
  ▼
EmployeeListPage.handleCreateSubmit()
  │   (calls useCreateEmployee hook)
  ▼
useCreateEmployee → useMutationWrapper
  │   (TanStack Query hidden behind wrapper)
  ▼
employeeService.createEmployee(dto)
  │   (business logic: logging, transformation)
  ▼
employeeRepository.create(dto)
  │   (data access only, no logic)
  ▼
httpClient.post('/employees', dto)
  │   (IHttpClient interface)
  ▼
AxiosHttpClient.post()
  │   (only file that calls axios)
  ▼
axios.post() → HTTP request
  │
  ▼  [Response]
  │
AxiosHttpClient normalizes response → HttpResponse<Employee>
  │
employeeRepository returns Employee
  │
employeeService logs success, returns Employee
  │
useMutationWrapper invalidates EMPLOYEE_QUERY_KEYS.lists()
  │
TanStack Query refetches list
  │
EmployeeTable re-renders with new data
  │
notify.success("Employee created")   ← SonnerNotificationAdapter
```

---

## Authentication Flow

```
User visits /employees (requires auth)
  │
  ▼
ProtectedRoute checks authService.isAuthenticated()
  │   (reads in-memory access token)
  ├── Not authenticated → Navigate to /login?from=/employees
  └── Authenticated → render children
        │
        ▼
User visits /login
  │
  ▼
LoginPage → LoginForm (useAuth hook)
  │
  ▼
useAuth.login(credentials)
  │
  ▼
authService.login(credentials)       ← JwtAuthService
  │
  ▼
httpClient.post('/auth/login')
  │
  ▼  [tokens + user returned]
  │
JwtAuthService:
  - Stores access token IN MEMORY (not localStorage — XSS safe)
  - Sets Authorization header on httpClient
  - Stores user profile in localStorage (not the token)
  - Optionally stores refresh token
  │
  ▼
useAuth returns success → navigate to /employees
  │
  ▼
Subsequent requests automatically include Bearer token
  │
Token expiry → JwtAuthService.refreshToken() → new access token
```

---

## State Management Flow

```
                    Component
                       │
              useEmployeeStore()  ← public API only
                       │
                       ▼
              employeeStore.ts    ← Zustand hidden here
                       │
           ┌───────────┤
           │           │
    loadEmployees()  createEmployee()
           │           │
           ▼           ▼
      employeeService (business logic)
           │
           ▼
      employeeRepository (data access)
           │
           ▼
         httpClient
           │
           ▼
           axios

Store exposes ONLY:
  - employees: Employee[]
  - isLoading: boolean
  - loadEmployees()
  - createEmployee()
  - updateEmployee()
  - deleteEmployee()

Store NEVER exposes:
  - dispatch, setState, create, subscribe
```

---

## Error Handling Flow

```
Any error anywhere in the app:

  axios error
      │
      ▼
  AxiosHttpClient.normalizeError()
      │   Maps to HttpError with: statusCode, errorCode, message
      ▼
  Repository throws HttpError
      │
      ▼
  Service catches, logs via logger, re-throws or returns null
      │
      ▼
  Store catches, sets error state, calls notify.error()
      │
  ┌───┴────────────┐
  │                │
  Component     React ErrorBoundary
  shows error   catches render errors
  from store
```

**Network errors** → HttpError(NETWORK_ERROR) → notify.error("Check connection")
**Auth errors** → HttpError(UNAUTHORIZED) → redirect to login
**Validation** → Zod schema → field-level messages via AppTextField
**Unexpected** → ErrorBoundary → friendly error page + logger.fatal()

---

## Migration Guides

### Replace Axios with Fetch

1. `src/infrastructure/http/FetchHttpClient.ts` already exists ✓
2. Open `HttpClientFactory.ts`
3. Change: `return new AxiosHttpClient()` → `return new FetchHttpClient()`
4. Remove `axios` from `package.json`
5. **Zero changes** in any feature module, service, or repository.

### Replace Zustand with Redux Toolkit

1. For each `*Store.ts`, rewrite using `createSlice` + `configureStore`
2. Keep the same exported hook name (`useEmployeeStore`)
3. Keep the same public methods (`loadEmployees`, `createEmployee`, etc.)
4. **Zero changes** in components or services.

### Replace TanStack Query with SWR

1. Rewrite `useQueryWrapper.ts`, `useMutationWrapper.ts`, `useInfiniteQueryWrapper.ts`
2. Keep the same interface (same return shape: `{ data, isLoading, isError, ... }`)
3. Update `QueryClientConfig.ts` and `QueryProvider.tsx`
4. **Zero changes** in feature hooks or pages.

### Replace Sonner with React Toastify

1. Create `ToastifyNotificationAdapter.ts` implementing `INotificationService`
2. Open `NotificationFactory.ts`, change `return new SonnerNotificationAdapter()`
3. Update `NotificationProvider.tsx` to render Toastify's container instead
4. **Zero changes** in any feature module.

### Replace UI Library (e.g., add Material UI)

1. Create MUI implementations of each component in `shared/ui/`
   (e.g., `AppButton` renders `<MuiButton>` instead of native `<button>`)
2. **Zero changes** in any feature module — they already use `AppButton`.

---

## Testing Guide

### Test Pyramid

```
         /\
        /  \   E2E (Playwright) — full user journeys
       /────\
      /      \  Integration — repository + MSW handler pairs
     /────────\
    /          \ Unit — validators, utils, services (mocked deps)
   /────────────\
  / Component    \ — pages, forms, UI components with RTL
 /────────────────\
```

### Running Tests

```bash
npm test                # single run
npm run test:watch      # watch mode
npm run test:coverage   # with V8 coverage report (target: 90%)
npm run test:ui         # Vitest UI
```

### Test File Conventions

| Test type   | Location                                 | Example                      |
| ----------- | ---------------------------------------- | ---------------------------- |
| Unit        | `tests/{layer}/{module}/`                | `employeeService.test.ts`    |
| Component   | `tests/shared/ui/` or `tests/modules/*/` | `AppButton.test.tsx`         |
| Repository  | `tests/modules/{module}/`                | `EmployeeRepository.test.ts` |
| Store       | `tests/modules/{module}/`                | `employeeStore.test.ts`      |
| Integration | `tests/modules/{module}/`                | Uses MSW + real repository   |

### MSW Patterns

```ts
// Override a handler for one test
import { server } from '@/tests/mocks/server';
import { http, HttpResponse } from 'msw';

it('handles server error', async () => {
  server.use(
    http.get('*/employees', () => HttpResponse.json({ message: 'Server error' }, { status: 500 })),
  );
  // ...
});
```

### renderWithProviders

Always use `renderWithProviders` instead of RTL's `render`:

```ts
import { renderWithProviders } from '@/tests/utils/renderWithProviders';

it('renders employee list', async () => {
  const { findAllByRole } = renderWithProviders(<EmployeeListPage />);
  const rows = await findAllByRole('row');
  expect(rows.length).toBeGreaterThan(1);
});
```

---

## Coding Standards

### Naming

| Construct        | Convention                                       | Example                   |
| ---------------- | ------------------------------------------------ | ------------------------- |
| Component        | PascalCase                                       | `EmployeeTable`           |
| Hook             | camelCase with `use` prefix                      | `useEmployeeList`         |
| Interface        | `I` prefix                                       | `IHttpClient`             |
| Type             | PascalCase                                       | `EmployeeStatus`          |
| Constant         | SCREAMING_SNAKE                                  | `EMPLOYEE_QUERY_KEYS`     |
| CSS module class | camelCase                                        | `.headerActions`          |
| File             | kebab-case for config, PascalCase for components | `env.ts`, `AppButton.tsx` |

### Import Order (enforced by ESLint)

```ts
// 1. React
import { useState } from 'react';

// 2. Third-party (infrastructure boundary only)
import { create } from 'zustand';

// 3. Internal — ordered by depth (@core → @infrastructure → @shared → @modules → relative)
import { ROUTES } from '@core/config/routes';
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import { AppButton } from '@shared/ui/AppButton';
import type { Employee } from '../types';
```

### Component Pattern

```tsx
// ✅ Correct
export const EmployeeTable = memo(function EmployeeTable({
  employees,
  onEdit,
}: EmployeeTableProps) {
  // ... pure presentational, no side effects
});

// ❌ Wrong — anonymous function makes debugging harder
export default memo(({ employees }) => { ... });
```

### Forbidden Imports in Feature Modules

ESLint enforces these via `no-restricted-imports`. Any violation is a build error:

```ts
// ❌ Never in src/modules/**
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { create } from 'zustand';
import { toast } from 'sonner';
import localStorage from ...;

// ✅ Always use abstractions
import { httpClient } from '@infrastructure/http/HttpClientFactory';
import { useQueryWrapper } from '@infrastructure/cache/useQueryWrapper';
import { useEmployeeStore } from '../store';
import { notify } from '@infrastructure/notification/NotificationFactory';
import { storage } from '@infrastructure/storage/StorageService';
```

---

## Performance Guide

### Route Lazy Loading (already implemented)

Every page is lazy-loaded. The initial bundle only loads the shell + providers.

### Code Splitting Strategy

`vite.config.ts` defines manual chunks:

- `react-vendor`: react + react-dom
- `router-vendor`: react-router-dom
- `query-vendor`: @tanstack/react-query
- `form-vendor`: react-hook-form + zod
- Each module route chunk is split automatically by lazy()

### Memoization Rules

- Use `memo()` on every component that receives props and renders frequently
- Use `useMemo()` for expensive derived values (filtering/sorting large arrays)
- Use `useCallback()` for functions passed as props to memoized children
- Never wrap everything — profile first with React DevTools

### Request Caching

TanStack Query (via `useQueryWrapper`) caches all GET requests:

- `staleTime: 5 minutes` — data stays fresh, no refetch
- `gcTime: 10 minutes` — removed from cache after inactivity
- Mutations automatically `invalidateKeys` to refetch affected queries

### Debouncing

Search inputs use `useDebounce(value, 400)`. This reduces API calls from
one-per-keystroke to one-per-400ms pause.

### Image Optimization

- All images use `loading="lazy"` attribute
- `AppAvatar` defers off-screen avatar images
- Use `width` + `height` attributes to prevent layout shift (CLS)

---

## Security Best Practices

### XSS Prevention

- React escapes all JSX output by default — never use `dangerouslySetInnerHTML`
- All user input passes through Zod validators before use
- Token stored in memory (not localStorage) — inaccessible to injected scripts

### CSRF Protection

`AxiosHttpClient` reads `XSRF-TOKEN` from cookies and sets `X-CSRF-Token` header
on every non-GET request automatically.

### Secure Token Storage

| Token         | Storage                      | Reason                            |
| ------------- | ---------------------------- | --------------------------------- |
| Access token  | In-memory only               | XSS cannot steal it               |
| Refresh token | httpOnly cookie (server-set) | JS cannot access httpOnly cookies |
| User profile  | localStorage                 | Non-sensitive, survives refresh   |

### Content Security Policy

Add to your web server / CDN:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.yourcompany.com;
  frame-ancestors 'none';
```

### Input Validation

Never trust user input. All form data passes through Zod schemas before
reaching the service layer. Server-side validation is always the authority.

### Permission Guards

```tsx
// Route level
<Route element={<ProtectedRoute />}>

// UI level — hides buttons the user can't use
<PermissionGuard permission={PERMISSIONS.EMPLOYEE_DELETE}>
  <AppButton variant="danger">Delete</AppButton>
</PermissionGuard>
```

---

## Scalability Strategy

### Adding a New Feature Module

```bash
src/modules/payroll/
  components/
  constants/
  hooks/
  pages/
  repository/     # IPayrollRepository + PayrollRepository
  routes/         # PayrollRoutes (lazy)
  services/       # PayrollService
  store/          # usePayrollStore
  types/
  utils/
  validators/
  index.ts
```

1. Create the module following the employee module as template
2. Add routes to `AppRouter.tsx`
3. Add navigation link to `AppLayout.tsx`
4. Add permissions to `permissions.ts`

### Adding a New Infrastructure Provider

Example: adding Datadog logging:

```ts
// 1. Create src/infrastructure/logger/DatadogLogger.ts
export class DatadogLogger implements ILogger {
  debug(message, context) { datadogLogs.logger.debug(message, context); }
  // ...
}

// 2. Update LoggerFactory.ts
case 'datadog': return new DatadogLogger();

// 3. Set VITE_LOG_PROVIDER=datadog in .env
// Zero other changes.
```

### Micro-Frontend Preparation

Each module is already structured to be independently portable:

- No cross-module imports (all via `index.ts` boundary)
- Self-contained routes, components, state, and API calls
- Module `index.ts` is the public API contract

To extract a module as a micro-frontend:

1. Copy the module folder to a new repo
2. Install the same `@infrastructure/*` packages
3. Mount the module's `Routes` component in the host shell

---

## Deployment Guide

### Environment Variables

All env vars are Zod-validated at startup. Missing required vars = fail loudly.

```bash
# Development
cp .env.example .env
# Fill in values, then:
npm run dev
```

### Build

```bash
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
```

Build output is in `dist/`. It's a static SPA — deploy to any CDN.

### Recommended Stack

- **CDN**: Cloudflare Pages, Vercel, AWS CloudFront + S3
- **API**: Configure `VITE_API_BASE_URL` to point to your backend
- **SPA routing**: Configure CDN to serve `index.html` for all 404s

### GitHub Actions CI/CD

`.github/workflows/ci.yml` runs on every push/PR:

1. Type check
2. Lint
3. Format check
4. Tests with coverage
5. Build (on main/develop only)

### Semantic Versioning

Commits follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(employee): add bulk delete action
fix(auth): token refresh race condition
chore(deps): update axios to 1.10
```

`commitlint` enforces this on every commit via the husky hook.
