
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { useFormik, type FormikHelpers } from 'formik';

import type {
  AppointmentSlot,
  Booking,
  BookingFormValues,
} from '../../../shared/types/booking';

import {
  createBooking,
  getSlots,
  SlotUnavailableError,
} from '../api/booking.api';

import {
  getTomorrowKey,
  toDateKey,
} from '../utils/bookingDates';

import { bookingSchema } from '../validation/bookingSchema';

export interface BookingStatus {
  type: 'error';
  message: string;
}

interface UseBookingFormArgs {
  doctorId: string;
  patientId: string;
  onBooked: (booking: Booking) => void;
}

export function useBookingForm({
  doctorId,
  patientId,
  onBooked,
}: UseBookingFormArgs) {
  const [slots, setSlots] = useState<AppointmentSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryKey, setRetryKey] = useState(0);

  const [successBooking, setSuccessBooking] =
    useState<Booking | null>(null);

  const initialValues = useMemo<BookingFormValues>(
    () => ({
      date: getTomorrowKey(),
      slotId: '',
      comment: '',
    }),
    []
  );

  // ჯავშნის გაგზავნა
  const handleSubmit = useCallback(
    async (
      values: BookingFormValues,
      helpers: FormikHelpers<BookingFormValues>
    ) => {
      helpers.setStatus(undefined);

      try {
        const booking = await createBooking({
          doctorId,
          patientId,
          date: values.date,
          slotId: values.slotId,
          comment: values.comment.trim(),
        });

        setSuccessBooking(booking);

        // მშობელ კომპონენტს ვატყობინებთ
        // ახალი ჯავშნის შექმნის შესახებ.
        onBooked(booking);
      } catch (err) {
        if (err instanceof SlotUnavailableError) {
          helpers.setFieldError('slotId', err.message);

          await helpers.setFieldTouched(
            'slotId',
            true,
            false
          );

          // განვაახლოთ საათების სია
          try {
            const updatedSlots = await getSlots(
              doctorId,
              values.date
            );

            setSlots(updatedSlots);
          } catch {
            setError('საათების განახლება ვერ მოხერხდა.');
          }

          return;
        }

        helpers.setStatus({
          type: 'error',
          message:
            err instanceof Error
              ? err.message
              : 'ჯავშნის შექმნა ვერ მოხერხდა.',
        } satisfies BookingStatus);
      }
    },
    [doctorId, patientId, onBooked]
  );

  const formik = useFormik<BookingFormValues>({
    initialValues,
    validationSchema: bookingSchema,
    onSubmit: handleSubmit,
  });

  const selectedDate = formik.values.date;

  // თავისუფალი დროების წამოღება
  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    if (selectedDate) {
      getSlots(doctorId, selectedDate, controller.signal)
        .then((data) => {
          if (!active) return;

          setSlots(data);
          setError('');
        })
        .catch((err: unknown) => {
          if (!active) return;

          setSlots([]);
          setError(
            err instanceof Error
              ? err.message
              : 'საათების ჩატვირთვა ვერ მოხერხდა.'
          );
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

  // თარიღის შეცვლა
  const changeDate = (date: string) => {
    if (
      !date ||
      date < toDateKey(new Date()) ||
      formik.isSubmitting
    ) {
      return;
    }

    void formik.setFieldValue('date', date, false);
    void formik.setFieldValue('slotId', '', false);
    void formik.setFieldTouched('slotId', false, false);

    formik.setErrors({});
    formik.setStatus(undefined);

    setSlots([]);
    setError('');
    setLoading(true);
  };

  // შეცდომის შემდეგ ხელახლა ჩატვირთვა
  const retry = () => {
    setSlots([]);
    setError('');
    setLoading(true);
    setRetryKey((previous) => previous + 1);
  };

  // ახალი ჯავშნის დასაწყებად ფორმის გასუფთავება
  const resetBooking = () => {
    formik.resetForm({
      values: {
        date: getTomorrowKey(),
        slotId: '',
        comment: '',
      },
    });

    setSuccessBooking(null);
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
    successBooking,
    resetBooking,
  };
}
