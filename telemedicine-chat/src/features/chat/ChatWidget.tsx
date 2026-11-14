import {
  faComments,
  faPaperPlane,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { ChatIcon } from "./ChatIcon";
import { getChatReply, welcomeMessage } from "./chatReplies";
import type { ChatBooking } from "./chatReplies";
import styles from "./ChatWidget.module.scss";

export interface ChatWidgetProps {
  patientId: string;
  getBookings: () => readonly ChatBooking[];
}

interface Message {
  sender: "assistant" | "patient";
  text: string;
  sentAt: Date;
}

const messageLimit = 1000;
const timeFormat = new Intl.DateTimeFormat("ka-GE", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function ChatWidget(props: ChatWidgetProps) {
  return <ChatSession key={props.patientId} {...props} />;
}

function ChatSession({ patientId, getBookings }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const headingId = useId();
  const inputId = useId();
  const errorId = useId();
  const hasWelcome = messages.length > 0;
  const length = Array.from(draft).length;
  const tooLong = length > messageLimit;
  const canSend = hasWelcome && !tooLong && Boolean(draft.trim());

  useEffect(() => {
    if (!isOpen || hasWelcome) return;
    const timer = window.setTimeout(() => {
      setMessages([
        { sender: "assistant", text: welcomeMessage, sentAt: new Date() },
      ]);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [hasWelcome, isOpen]);

  useEffect(() => {
    if (isOpen && list.current) {
      list.current.scrollTop = list.current.scrollHeight;
    }
  }, [isOpen, messages]);

  function open() {
    dialog.current?.showModal();
    setIsOpen(true);
  }

  function close() {
    setIsOpen(false);
    dialog.current?.close();
  }

  function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;
    const text = draft.trim();
    const sentAt = new Date();
    const reply = getChatReply(text, patientId, getBookings, sentAt);
    setMessages((previous) => [
      ...previous,
      { sender: "patient", text, sentAt },
      { sender: "assistant", text: reply, sentAt },
    ]);
    setDraft("");
  }

  function handleComposerKey(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key !== "Enter" ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    )
      return;
    event.preventDefault();
    if (canSend) event.currentTarget.form?.requestSubmit();
  }

  return (
    <>
      <button
        className={
          styles.launcher + " inline-flex items-center justify-center gap-2"
        }
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={open}
      >
        <ChatIcon icon={faComments} />
        ჩატის გახსნა
      </button>

      <dialog
        className={styles.dialog}
        ref={dialog}
        aria-labelledby={headingId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
      >
        <div className="flex h-full min-w-0 flex-col">
          <header
            className={
              styles.header +
              " flex shrink-0 items-center justify-between gap-3"
            }
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={styles.avatar + " grid shrink-0 place-items-center"}
              >
                <ChatIcon icon={faComments} />
              </span>
              <div className="min-w-0">
                <h2 id={headingId}>ონლაინ ჩატ ასისტენტი</h2>
                <p>MediCare</p>
              </div>
            </div>
            <button
              type="button"
              className={styles.close + " grid shrink-0 place-items-center"}
              aria-label="ჩატის დახურვა"
              onClick={close}
            >
              <ChatIcon icon={faXmark} />
            </button>
          </header>

          <div
            className={styles.messages + " min-h-0 flex-1 overflow-y-auto"}
            ref={list}
            tabIndex={0}
            aria-label="შეტყობინებები"
          >
            <ol
              className="flex flex-col gap-3"
              role="log"
              aria-label="საუბრის ისტორია"
            >
              {messages.map(({ sender, text, sentAt }, index) => (
                <li
                  className={
                    sender === "patient"
                      ? styles.patientBubble
                      : styles.assistantBubble
                  }
                  key={index}
                >
                  <div
                    className={
                      styles.meta + " flex flex-wrap items-baseline gap-x-2"
                    }
                  >
                    <strong>
                      {sender === "patient" ? "თქვენ" : "ასისტენტი"}
                    </strong>
                    <time dateTime={sentAt.toISOString()}>
                      {timeFormat.format(sentAt)}
                    </time>
                  </div>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
          </div>

          <form
            className={styles.composer + " grid shrink-0 gap-2"}
            onSubmit={send}
          >
            <label htmlFor={inputId}>შეტყობინება</label>
            <textarea
              id={inputId}
              rows={2}
              value={draft}
              placeholder="დაწერეთ შეტყობინება..."
              aria-invalid={tooLong || undefined}
              aria-describedby={tooLong ? errorId : undefined}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={handleComposerKey}
            />
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <span className={styles.count}>
                  {length} / {messageLimit}
                </span>
                {tooLong && (
                  <p className={styles.error} id={errorId} role="alert">
                    შეტყობინება მაქსიმუმ {messageLimit} სიმბოლოს უნდა შეიცავდეს.
                  </p>
                )}
              </div>
              <button
                className={
                  styles.send +
                  " ml-auto inline-flex items-center justify-center gap-2"
                }
                type="submit"
                disabled={!canSend}
              >
                გაგზავნა
                <ChatIcon icon={faPaperPlane} />
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
