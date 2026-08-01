/**
 * RouterProvider — wraps the app with BrowserRouter.
 *
 * ⚠️ ONLY THIS FILE IS ALLOWED TO IMPORT BrowserRouter ⚠️
 */
import type { ReactNode } from 'react';

import { BrowserRouter } from 'react-router-dom';

interface RouterProviderProps {
  children: ReactNode;
}

export function RouterProvider({ children }: RouterProviderProps) {
  return <BrowserRouter>{children}</BrowserRouter>;
}
