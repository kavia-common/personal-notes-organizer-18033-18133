import { h } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { useStore } from '../store/store';
import { RichTextEditor } from '../ui/editor/RichTextEditor.jsx';
import { TagInput } from '../ui/TagInput.jsx';
import clsx from 'clsx';

export function NotesPage() {
  const { state, actions } = useStore();
  const [localNote, setLocalNote] = useState(null);
  const [editing, setEditing] = useState(false);
  const titleRef = useRef(null);

  const selected = useMemo(() => {
    return state.notes.find((n) => n.id === state.selectedId) || null;
  }, [state.notes, state.selectedId]);

  useEffect(() => {
    if (selected) {
      setLocalNote({ ...selected });
      setEditing(false);
    } else {
      setLocalNote(null);
      setEditing(false);
    }
  }, [selected?.id]);

  const onSelect = (id) => () => actions.select(id);
  const onEdit = () => {
    setEditing(true);
    setTimeout(() => titleRef.current?.focus(), 0);
  };
  const onDelete = () => {
    if (selected && confirm('Delete this note?')) {
      actions.deleteNote(selected.id);
    }
  };
  const onSave = async () => {
    if (!localNote) return;
    const payload = {
      title: localNote.title || 'Untitled note',
      content: localNote.content || '',
      tags: localNote.tags || [],
    };
    await actions.updateNote(localNote.id, payload);
    setEditing(false);
  };

  const onChangeTitle = (e) => setLocalNote((n) => ({ ...n, title: e.currentTarget.value }));
  const onChangeContent = (html) => setLocalNote((n) => ({ ...n, content: html }));
  const onChangeTags = (tags) => setLocalNote((n) => ({ ...n, tags }));

  return (
    <div class="notes-page">
      <section class="notes-list">
        <div class="list-header">
          <div class="list-title">Notes</div>
          <div class="list-meta">{state.loading ? 'Loading...' : `${state.notes.length} items`}</div>
        </div>
        <ul class="items">
          {state.notes.map((n) => (
            <li key={n.id} class={clsx('item', state.selectedId === n.id && 'selected')} onClick={onSelect(n.id)}>
              <div class="item-title">{n.title || 'Untitled note'}</div>
              <div
                class="item-preview"
                dangerouslySetInnerHTML={{
                  __html: (n.content || '').replace(/<[^>]+>/g, '').slice(0, 80),
                }}
              />
              {Array.isArray(n.tags) && n.tags.length > 0 && (
                <div class="item-tags">
                  {n.tags.map((t) => (
                    <span key={t} class="mini-chip">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section class="editor-panel">
        {!selected && (
          <div class="empty-state">
            <p>Select a note from the list, or create a new one.</p>
            <button class="btn btn-primary" onClick={() => actions.createNote()}>
              + New note
            </button>
          </div>
        )}

        {selected && (
          <div class="editor-wrap">
            <div class="editor-header">
              {editing ? (
                <input
                  ref={titleRef}
                  class="title-input"
                  value={localNote?.title || ''}
                  onInput={onChangeTitle}
                  placeholder="Note title"
                />
              ) : (
                <h2 class="title">{selected.title || 'Untitled note'}</h2>
              )}
              <div class="editor-actions">
                {!editing && (
                  <button class="btn" onClick={onEdit}>
                    Edit
                  </button>
                )}
                {editing && (
                  <button class="btn btn-primary" onClick={onSave}>
                    Save
                  </button>
                )}
                <button class="btn btn-danger" onClick={onDelete}>
                  Delete
                </button>
              </div>
            </div>

            <div class="tags-row">
              <TagInput value={localNote?.tags || []} onChange={onChangeTags} disabled={!editing} />
            </div>

            <RichTextEditor
              value={editing ? localNote?.content || '' : selected.content || ''}
              onChange={onChangeContent}
              readOnly={!editing}
            />
          </div>
        )}
      </section>
    </div>
  );
}
