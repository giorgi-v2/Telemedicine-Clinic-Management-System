import { useId, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import Button from '../../shared/ui/Button';
import styles from './ChatWidget.module.scss';

const messageLimit = 1000;

export function MessageComposer({ onSend }: { onSend: (text: string) => void }) {
  const [draft, setDraft] = useState('');
  const inputId = useId();
  const errorId = useId();
  const length = Array.from(draft).length;
  const tooLong = length > messageLimit;
  const text = draft.trim();
  const canSend = !tooLong && text.length > 0;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    onSend(text);
    setDraft('');
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return;
    event.preventDefault();
    if (canSend) event.currentTarget.form?.requestSubmit();
  }

  return (
    <form className="grid shrink-0 gap-2 border-t border-line bg-page p-4" onSubmit={submit}>
      <label className="text-sm font-medium text-ink" htmlFor={inputId}>შეტყობინება</label>
      <textarea
        className={styles.input}
        id={inputId}
        rows={1}
        value={draft}
        placeholder="დაწერე შეტყობინება..."
        aria-invalid={tooLong || undefined}
        aria-describedby={tooLong ? errorId : undefined}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <span className="text-xs text-muted">{length} / {messageLimit}</span>
      {tooLong && (
        <p className="text-xs text-danger" id={errorId} role="alert">
          შეტყობინება მაქსიმუმ {messageLimit} სიმბოლოს უნდა შეიცავდეს.
        </p>
      )}
      <Button className={styles.send} type="submit" disabled={!canSend}>
        გაგზავნა
      </Button>
    </form>
  );
}
