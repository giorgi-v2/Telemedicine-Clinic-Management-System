import { useEffect, useState } from 'react';
import { getDoctors } from '../api/doctors.api';
import type { Doctor } from '../../../shared/types/doctor';

const ERROR_MESSAGE = 'ექიმების სია ვერ ჩაიტვირთა. გთხოვთ სცადოთ ხელახლა.';

export function useFetchDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // "ხელახლა ცდის" ღილაკი ამ მნიშვნელობას ცვლის და useEffect თავიდან გაეშვება
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setIsLoading(true);
    setError(null);

    getDoctors(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setDoctors(data);
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(ERROR_MESSAGE);
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const reload = () => setAttempt((value) => value + 1);

  return { doctors, isLoading, error, reload };
}
