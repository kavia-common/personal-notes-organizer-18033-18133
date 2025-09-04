import { h } from 'preact';
import { TopBar } from './TopBar.jsx';
import { Sidebar } from './Sidebar.jsx';
import { useStore } from '../store/store.jsx';

export function AppShell({ children }) {
  return (
    <div class="app-shell">
      <TopBar />
      <div class="app-body">
        <Sidebar />
        <main class="app-content">{children}</main>
      </div>
    </div>
  );
}
