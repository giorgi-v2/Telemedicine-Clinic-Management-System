
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFormik, type FormikHelpers } from 'formik';

import type {
  AppointmentSlot,
  BookingFormValues,
} from '../../../shared/types/booking';

import { getSlots } from '../api/booking.api';
import { getTomorrowKey } from '../utils/bookingDates';
import { bookingSchema } from '../validation/bookingSchema';

export interface BookingStatus {
  type: 'success' | 'error';
  message: string;
}

export function useBookingForm(doctorId: string) {
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const initialValues = useMemo<BookingFormValues>(
    () => ({
      date: getTomorrowKey(),
      slotId: '',
      comment: '',
    }),
    []
  );

  const handleSubmit = useCallback(
    async (
      values: BookingFormValues,
      helpers: FormikHelpers<BookingFormValues>
    ) => {
      helpers.setStatus(undefined);

      try {
        // ხელახლა ვამოწმებთ არჩეული საათის ხელმისაწვდომობას.
        const freshSlots = await getSlots(doctorId, values.date);

        const selected = freshSlots.find(
          (slot) =>
            slot.id === values.slotId &&
            slot.doctorId === doctorId &&
            slot.date === values.date &&
            slot.isAvailable
        );

        if (!selected) {
          helpers.setFieldError(
            'slotId',
            'არჩეული საათი მიუწვდომელია. აირჩიე სხვა დრო.'
          );
          await helpers.setFieldTouched('slotId', true, false);
          return;
        }

        helpers.setStatus({
          type: 'success',
          message:
            `მონაცემები შემოწმებულია: ${values.date}, ${selected.time}. ` +
            'შემდეგ ეტაპზე დავამატებთ ჯავშნის შენახვას.',
        } satisfies BookingStatus);
      } catch {
        helpers.setStatus({
          type: 'error',
          message: 'მონაცემების შემოწმება ვერ მოხერხდა. სცადე ხელახლა.',
        } satisfies BookingStatus);
      }
    },
    [doctorId]
  );

  const formik = useFormik<BookingFormValues>({
    initialValues,
    validationSchema: bookingSchema,
    onSubmit: handleSubmit,
  });

  const selectedDate = formik.values.date;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    if (selectedDate) {
      getSlots(doctorId, selectedDate, controller.signal)
        .then((data) => {
          if (active) {
            setSlots(data);
            setError('');
          }
        })
        .catch((err: unknown) => {
          if (active) {
            setSlots([]);
            setError(
              err instanceof Error
                ? err.message
                : 'საათების ჩატვირთვა ვერ მოხერხდა.'
            );
          }
        })
        .finally(() => {
          if (active) {
            setLoading(false);
          }
        });
    }

    return () => {
      active = false;
      controller.abort();
    };
  }, [doctorId, selectedDate, retryKey]);

  const changeDate = (date: string) => {
    if (!date || formik.isSubmitting) return;

    void formik.setFieldValue('date', date, false);
    void formik.setFieldValue('slotId', '', false);
    void formik.setFieldTouched('slotId', false, false);

    formik.setErrors({});
    formik.setStatus(undefined);
    setSlots([]);
    setError('');
    setLoading(true);
  };

  const retry = () => {
    setSlots([]);
    setError('');
    setLoading(true);
    setRetryKey((previous) => previous + 1);
  };

  const visibleSlots = slots.filter(
    (slot) =>
      slot.doctorId === doctorId &&
      slot.date === selectedDate
  );

  return {
    formik,
    slots: visibleSlots,
    loading,
    error,
    changeDate,
    retry,
  };
}
