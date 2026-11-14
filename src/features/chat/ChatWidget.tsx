import { useEffect, useId, useRef } from 'react';
import type { Doctor } from '../../shared/types/doctor';
import Button from '../../shared/ui/Button';
import { MessageComposer } from './MessageComposer';
import { MessageList } from './MessageList';
import { useChat } from './useChat';
import styles from './ChatWidget.module.scss';

interface ChatWidgetProps {
  doctor: Doctor | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatWidget({ doctor, isOpen, onOpenChange }: ChatWidgetProps) {
  const launcher = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const dialogId = useId();
  const { sender, setSender, messages, send } = useChat(isOpen);

  useEffect(() => {
    if (isOpen) dialog.current?.querySelector('textarea')?.focus({ preventScroll: true });
  }, [isOpen]);

  function close() {
    onOpenChange(false);
    launcher.current?.focus({ preventScroll: true });
  }

  return (
    <div className={styles.widget}>
      <Button
        className={styles.launcher}
        ref={launcher}
        aria-label={isOpen ? 'ჩატის ჩაკეცვა' : 'ჩატის გახსნა'}
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-expanded={isOpen}
        onClick={() => onOpenChange(!isOpen)}
      >
        <svg width="25" height="25" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          strokeLinejoin="round" aria-hidden="true">
          {isOpen
            ? <path d="M6 6l12 12M18 6 6 18" />
            : <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-3A8.5 8.5 0 1 1 21 11.5Z" />}
        </svg>
      </Button>

      <dialog
        id={dialogId}
        className={styles.dialog}
        ref={dialog}
        open={isOpen}
        aria-labelledby={headingId}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
            event.preventDefault();
            close();
          }
        }}
      >
        <div className="flex h-full min-w-0 flex-col">
          <header className="flex min-h-20 shrink-0 items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <h2 id={headingId} className="break-words text-xl font-bold text-ink">
                {doctor?.fullName ?? 'ონლაინ ჩატი'}
              </h2>
              <p className="mt-1 text-xs text-primary">სადემონსტრაციო ჩატი</p>
            </div>
            <Button
              variant="outline"
              className="w-11 shrink-0"
              aria-label="ჩატის დახურვა"
              onClick={close}
            >
              <span aria-hidden="true">×</span>
            </Button>
          </header>

          <fieldset className="shrink-0 bg-hero p-4">
            <legend className="sr-only">გაგზავნის ავტორი</legend>
            <p className="mb-2 text-sm font-medium" aria-hidden="true">გაგზავნის ავტორი</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={sender === 'patient' ? 'primary' : 'outline'}
                aria-pressed={sender === 'patient'}
                onClick={() => setSender('patient')}
              >
                პაციენტი
              </Button>
              <Button
                variant={sender === 'doctor' ? 'primary' : 'outline'}
                aria-pressed={sender === 'doctor'}
                onClick={() => setSender('doctor')}
              >
                ექიმი
              </Button>
            </div>
          </fieldset>

          <MessageList messages={messages} isOpen={isOpen} />
          <MessageComposer onSend={send} />
        </div>
      </dialog>
    </div>
  );
}
