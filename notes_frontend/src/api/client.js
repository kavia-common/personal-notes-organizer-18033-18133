import axios from 'axios';
import { getApiBaseUrl } from '../main.jsx';

/**
 * Axios instance configured with backend base URL.
 */
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

// PUBLIC_INTERFACE
export const NotesAPI = {
  /** Fetch list of notes with optional search and tag filtering. */
  async list({ q = '', tag = '' } = {}) {
    const params = {};
    if (q) params.q = q;
    if (tag) params.tag = tag;
    const { data } = await api.get('/notes', { params });
    return data;
  },
  /** Get a single note by id. */
  async get(id) {
    const { data } = await api.get(`/notes/${encodeURIComponent(id)}`);
    return data;
  },
  /** Create a new note. Body: { title, content, tags: string[] } */
  async create(note) {
    const { data } = await api.post('/notes', note);
    return data;
  },
  /** Update an existing note by id. */
  async update(id, updates) {
    const { data } = await api.put(`/notes/${encodeURIComponent(id)}`, updates);
    return data;
  },
  /** Delete a note by id. */
  async remove(id) {
    await api.delete(`/notes/${encodeURIComponent(id)}`);
    return true;
  },
};

// PUBLIC_INTERFACE
export const TagsAPI = {
  /** Fetch all tags. */
  async list() {
    const { data } = await api.get('/tags');
    return data;
  },
};
