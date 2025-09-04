import { h } from 'preact';
import { useStore } from '../store/store.jsx';
import clsx from 'clsx';

export function Sidebar() {
  const { state, actions } = useStore();

  const onSelect = (tag) => () => actions.setActiveTag(tag);

  return (
    <aside class="sidebar">
      <div class="sidebar-section">
        <div class="sidebar-title">Tags</div>
        <button class={clsx('tag-chip', !state.activeTag && 'active')} onClick={onSelect('')}>
          All
        </button>
        <div class="tags-list">
          {state.tags.map((t) => (
            <button key={t} class={clsx('tag-chip', state.activeTag === t && 'active')} onClick={onSelect(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
