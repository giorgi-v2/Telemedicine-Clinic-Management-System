import { useCallback, useEffect, useRef, useState } from 'react'

/** "ინახება..." მდგომარეობის მოკლე ჩვენება დადასტურების წინ (დიზაინის 03.08 ეკრანი). */
const SAVE_FEEDBACK_MS = 350

export function useSaveFeedback(onSaved: () => void) {
  const [isSaving, setIsSaving] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onSavedRef = useRef(onSaved)

  useEffect(() => {
    onSavedRef.current = onSaved
  }, [onSaved])

  // კომპონენტის გაუქმებისას ტაიმერი არ უნდა დარჩეს.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  const startSaving = useCallback(() => {
    if (timer.current) return
    setIsSaving(true)
    timer.current = setTimeout(() => {
      timer.current = null
      onSavedRef.current()
    }, SAVE_FEEDBACK_MS)
  }, [])

  return { isSaving, startSaving }
}
