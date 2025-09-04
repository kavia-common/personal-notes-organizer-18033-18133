import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

function exec(cmd, val = null) {
  document.execCommand(cmd, false, val);
}

export function RichTextEditor({ value = '', onChange, readOnly = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== value) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    onChange?.(ref.current?.innerHTML || '');
  };

  const addLink = () => {
    const url = prompt('Enter URL');
    if (url) exec('createLink', url);
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div class="rte">
      <div class="rte-toolbar">
        <button class="btn-ghost" type="button" onClick={() => exec('bold')} disabled={readOnly}>
          <b>B</b>
        </button>
        <button class="btn-ghost" type="button" onClick={() => exec('italic')} disabled={readOnly}>
          <i>I</i>
        </button>
        <button class="btn-ghost" type="button" onClick={() => exec('underline')} disabled={readOnly}>
          <u>U</u>
        </button>
        <span class="sep" />
        <button class="btn-ghost" type="button" onClick={() => exec('insertUnorderedList')} disabled={readOnly}>
          • List
        </button>
        <button class="btn-ghost" type="button" onClick={() => exec('insertOrderedList')} disabled={readOnly}>
          1. List
        </button>
        <span class="sep" />
        <button class="btn-ghost" type="button" onClick={() => exec('formatBlock', '<h3>')} disabled={readOnly}>
          H3
        </button>
        <button class="btn-ghost" type="button" onClick={() => exec('formatBlock', '<p>')} disabled={readOnly}>
          P
        </button>
        <span class="sep" />
        <button class="btn-ghost" type="button" onClick={addLink} disabled={readOnly}>
          Link
        </button>
      </div>
      <div
        ref={ref}
        class="rte-editor"
        contentEditable={!readOnly}
        onInput={handleInput}
        onPaste={onPaste}
        spellcheck="true"
        role="textbox"
        aria-multiline="true"
      />
    </div>
  );
}
