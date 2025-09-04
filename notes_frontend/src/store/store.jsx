import { h, createContext } from 'preact';
import { useContext, useMemo, useReducer } from 'preact/hooks';
import { NotesAPI, TagsAPI } from '../api/client';

const initial = {
  notes: [],
  tags: [],
  activeTag: '',
  query: '',
  selectedId: null,
  loading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.value, error: null };
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.message || 'Unknown error' };
    case 'SET_NOTES':
      return { ...state, notes: action.notes, loading: false };
    case 'SET_TAGS':
      return { ...state, tags: action.tags };
    case 'SET_QUERY':
      return { ...state, query: action.query };
    case 'SET_ACTIVE_TAG':
      return { ...state, activeTag: action.tag || '' };
    case 'SELECT':
      return { ...state, selectedId: action.id };
    case 'UPSERT_NOTE': {
      const idx = state.notes.findIndex((n) => n.id === action.note.id);
      const notes = [...state.notes];
      if (idx >= 0) notes[idx] = action.note;
      else notes.unshift(action.note);
      return { ...state, notes };
    }
    case 'REMOVE_NOTE': {
      const notes = state.notes.filter((n) => n.id !== action.id);
      const selectedId = state.selectedId === action.id ? null : state.selectedId;
      return { ...state, notes, selectedId };
    }
    default:
      return state;
  }
}

const StoreCtx = createContext(null);

// PUBLIC_INTERFACE
export function StoreProvider({ children }) {
  /** Provider for global store context. */
  const [state, dispatch] = useReducer(reducer, initial);

  const actions = useMemo(() => {
    const api = {
      async loadInitial() {
        dispatch({ type: 'SET_LOADING', value: true });
        try {
          const [tags, notes] = await Promise.all([TagsAPI.list(), NotesAPI.list()]);
          dispatch({ type: 'SET_TAGS', tags });
          dispatch({ type: 'SET_NOTES', notes });
        } catch (e) {
          dispatch({ type: 'SET_ERROR', message: e?.message });
        }
      },
      setQuery(query) {
        dispatch({ type: 'SET_QUERY', query });
        api.refresh();
      },
      setActiveTag(tag) {
        dispatch({ type: 'SET_ACTIVE_TAG', tag });
        api.refresh();
      },
      select(id) {
        dispatch({ type: 'SELECT', id });
      },
      async refresh() {
        dispatch({ type: 'SET_LOADING', value: true });
        try {
          const notes = await NotesAPI.list({ q: state.query, tag: state.activeTag });
          dispatch({ type: 'SET_NOTES', notes });
        } catch (e) {
          dispatch({ type: 'SET_ERROR', message: e?.message });
        }
      },
      async createNote() {
        const payload = { title: 'Untitled note', content: '', tags: state.activeTag ? [state.activeTag] : [] };
        try {
          const note = await NotesAPI.create(payload);
          dispatch({ type: 'UPSERT_NOTE', note });
          dispatch({ type: 'SELECT', id: note.id });
          api.refreshTags();
          return note;
        } catch (e) {
          dispatch({ type: 'SET_ERROR', message: e?.message });
          return null;
        }
      },
      async updateNote(id, updates) {
        try {
          const note = await NotesAPI.update(id, updates);
          dispatch({ type: 'UPSERT_NOTE', note });
          api.refreshTags();
          return note;
        } catch (e) {
          dispatch({ type: 'SET_ERROR', message: e?.message });
          return null;
        }
      },
      async deleteNote(id) {
        try {
          await NotesAPI.remove(id);
          dispatch({ type: 'REMOVE_NOTE', id });
          api.refreshTags();
          api.refresh();
        } catch (e) {
          dispatch({ type: 'SET_ERROR', message: e?.message });
        }
      },
      async refreshTags() {
        try {
          const tags = await TagsAPI.list();
          dispatch({ type: 'SET_TAGS', tags });
        } catch {
          // ignore
        }
      },
    };
    return api;
  }, [state.query, state.activeTag, state.selectedId]);

  const value = useMemo(() => ({ state, dispatch, actions }), [state, actions]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

// PUBLIC_INTERFACE
export function useStore() {
  /** Hook to access store and actions. */
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
