import { useEffect, useRef, useState } from 'react';

const welcomeMessage =
  'გამარჯობა, თქვენ მიიღებთ პირდაპირ ექიმისგან პასუხს, სამუშაო საათებია 09:00 - 18:00 ყველა სხვა კითხვაზე პასუხს მომდევნო სამუშაო დღეს მიიღებთ';

type DemoSender = 'patient' | 'doctor';

export interface Message {
  id: number;
  sender: DemoSender | 'clinic';
  text: string;
  sentAt: Date;
}

export function useChat(isOpen: boolean) {
  const [sender, setSender] = useState<DemoSender>('patient');
  const [messages, setMessages] = useState<Message[]>([]);
  const nextId = useRef(1);
  const hasWelcome = messages.some((message) => message.sender === 'clinic');

  useEffect(() => {
    if (!isOpen || hasWelcome) return;
    const timer = window.setTimeout(() => {
      const welcome: Message = {
        id: nextId.current++,
        sender: 'clinic',
        text: welcomeMessage,
        sentAt: new Date(),
      };
      setMessages((previous) => [...previous, welcome]);
    }, 2000);
    return () => window.clearTimeout(timer);
  }, [hasWelcome, isOpen]);

  function send(text: string) {
    const sentAt = new Date();
    const message: Message = { id: nextId.current++, sender, text, sentAt };

    setMessages((previous) => [...previous, message]);
  }

  return { sender, setSender, messages, send };
}
