import { useEffect, useId, useRef } from 'react'
import type { ReactNode } from 'react'
import styles from './Modal.module.scss'

interface ModalProps {
  title: string
  description: string
  onClose: () => void
  /** შენახვის დროს დახურვა დროებით იბლოკება. */
  isBusy?: boolean
  children: ReactNode
}

export function Modal({ title, description, onClose, isBusy = false, children }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    if (!dialog.open) dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      // ფოკუსი უბრუნდება იმ ღილაკს, საიდანაც modal გაიხსნა.
      if (previouslyFocused?.isConnected) previouslyFocused.focus()
    }
  }, [])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      // Esc: ბრაუზერის ნაგულისხმევი დახურვა კი არა, React-ის state უნდა შეიცვალოს
      onCancel={(event) => {
        event.preventDefault()
        if (!isBusy) onClose()
      }}
      // დაწკაპება ფონზე (dialog ელემენტის გარეთ, panel-ის მიღმა)
      onClick={(event) => {
        if (event.target === event.currentTarget && !isBusy) onClose()
      }}
    >
      <div className={`${styles.panel} rounded-2xl border border-line bg-white p-6 sm:p-8`}>
        <h2 id={titleId} className="text-[26px] leading-tight font-bold text-ink sm:text-3xl">
          {title}
        </h2>
        <p id={descriptionId} className="mt-4 mb-5 text-[15px] text-muted">
          {description}
        </p>
        {children}
      </div>
    </dialog>
  )
}
