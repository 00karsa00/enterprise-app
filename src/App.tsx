/**
 * App.tsx — the application root.
 *
 * WHY: App.tsx contains almost no logic — it just composes providers and router.
 * All setup is delegated to AppProviders and AppRouter.
 * This keeps App.tsx clean and easy to understand at a glance.
 */
import { AppProviders } from './app/providers/AppProviders';
import { AppRouter } from './app/router/AppRouter';
import './styles/global.css';

function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}

export default App;
