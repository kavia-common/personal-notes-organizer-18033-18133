import { h } from 'preact';
import { useStore } from '../store/store.jsx';

export function TopBar() {
  const { state, actions } = useStore();

  return (
    <header class="topbar">
      <div class="brand">Notes</div>
      <div class="search">
        <input
          class="search-input"
          type="search"
          placeholder="Search notes..."
          value={state.query}
          onInput={(e) => actions.setQuery(e.currentTarget.value)}
          aria-label="Search notes"
        />
      </div>
      <div class="actions">
        <button class="btn btn-accent" onClick={() => actions.createNote()} aria-label="Create note">
          + New
        </button>
      </div>
    </header>
  );
}
