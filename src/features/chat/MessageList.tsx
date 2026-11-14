import { useEffect, useRef } from 'react';
import type { Message } from './useChat';
import styles from './ChatWidget.module.scss';

const senderLabels: Record<Message['sender'], string> = {
  patient: 'პაციენტი',
  doctor: 'ექიმი',
  clinic: 'MediCare',
};

const timeFormat = new Intl.DateTimeFormat('ka-GE', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

function MessageItem({ message }: { message: Message }) {
  return (
    <li className={message.sender === 'patient' ? styles.patientBubble : styles.receivedBubble}>
      <div className="mb-2 flex flex-wrap items-baseline gap-x-2 text-xs">
        <span>{senderLabels[message.sender]}</span>
        <time dateTime={message.sentAt.toISOString()}>
          {timeFormat.format(message.sentAt)}
        </time>
      </div>
      <p>{message.text}</p>
    </li>
  );
}

export function MessageList({ messages, isOpen }: { messages: Message[]; isOpen: boolean }) {
  const messageList = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = messageList.current;
    if (isOpen && list) list.scrollTop = list.scrollHeight;
  }, [isOpen, messages]);

  return (
    <div
      className={`${styles.messages} min-h-0 flex-1 overflow-y-auto p-4`}
      ref={messageList}
      tabIndex={0}
      aria-label="შეტყობინებები"
    >
      {messages.length === 0 && (
        <p className="text-sm text-muted">შეტყობინებები ჯერ არ არის.</p>
      )}
      <ol className="flex flex-col gap-3" role="log" aria-label="საუბრის ისტორია">
        {messages.map((message) => <MessageItem key={message.id} message={message} />)}
      </ol>
    </div>
  );
}
