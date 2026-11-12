import { useState, useEffect } from 'react';
import { Doctor } from '../../../shared/types/doctor';
import { getDoctors } from '../api/doctors.api';

export function useFetchDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    
    setIsLoading(true);
    setError(null);

    getDoctors(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) {
          setDoctors(data);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || 'მოხდა უცნობი შეცდომა');
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return { doctors, isLoading, error };
}
