import { h, render } from 'preact';
import { useEffect } from 'preact/hooks';
import Router from 'preact-router';
import './styles/theme.css';
import './styles/layout.css';
import './styles/components.css';
import { AppShell } from './ui/AppShell.jsx';
import { NotesPage } from './pages/NotesPage.jsx';
import { StoreProvider, useStore } from './store/store.jsx';

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns API base URL from environment or defaults.
   * Uses VITE_API_BASE_URL env (define in .env).
   */
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
}

function Routes() {
  const { actions } = useStore();

  useEffect(() => {
    // Initial load: notes and tags
    actions.loadInitial();
  }, []);

  return (
    <Router>
      <NotesPage path="/" />
      <NotesPage path="/tag/:tagId" />
      <NotesPage path="/note/:id" />
    </Router>
  );
}

function Root() {
  return (
    <StoreProvider>
      <AppShell>
        <Routes />
      </AppShell>
    </StoreProvider>
  );
}

const root = document.getElementById('app');
render(<Root />, root);
