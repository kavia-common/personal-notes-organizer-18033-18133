import { h } from 'preact';
import { useState } from 'preact/hooks';

export function TagInput({ value = [], onChange, disabled = false }) {
  const [v, setV] = useState('');

  const addTag = (t) => {
    const tag = (t || '').trim();
    if (!tag) return;
    if (!value.includes(tag)) {
      onChange?.([...value, tag]);
    }
    setV('');
  };

  const removeTag = (tag) => {
    onChange?.(value.filter((t) => t !== tag));
  };

  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(v);
    } else if (e.key === 'Backspace' && !v && value.length > 0) {
      removeTag(value[value.length - 1]);
    }
  };

  return (
    <div class="tag-input">
      <div class="chips">
        {value.map((t) => (
          <span class="chip" key={t}>
            {t}
            {!disabled && (
              <button class="chip-x" onClick={() => removeTag(t)} aria-label={`Remove ${t}`}>
                ×
              </button>
            )}
          </span>
        ))}
        <input
          class="chip-input"
          type="text"
          value={v}
          onInput={(e) => setV(e.currentTarget.value)}
          onKeyDown={onKeyDown}
          onBlur={() => addTag(v)}
          placeholder="Add tags"
          disabled={disabled}
        />
      </div>
    </div>
  );
}
