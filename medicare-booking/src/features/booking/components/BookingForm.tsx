
import type { FormikProps } from 'formik';

import type {
  AppointmentSlot,
  BookingFormValues,
} from '../../../shared/types/booking';

import { toDateKey } from '../utils/bookingDates';
import type { BookingStatus } from '../hooks/useBookingForm';

import Calendar from './Calendar';
import TimeSlotPicker from './TimeSlotPicker';

interface BookingFormProps {
  formik: FormikProps<BookingFormValues>;
  slots: AppointmentSlot[];
  loading: boolean;
  error: string;
  onDateChange: (date: string) => void;
  onRetry: () => void;
}

export default function BookingForm({
  formik,
  slots,
  loading,
  error,
  onDateChange,
  onRetry,
}: BookingFormProps) {
  const dateError = formik.touched.date && formik.errors.date;
  const slotError = formik.touched.slotId && formik.errors.slotId;
  const status = formik.status as BookingStatus | undefined;

  return (
    <form onSubmit={formik.handleSubmit} noValidate>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <section>
          <h3 className="mb-4 text-lg font-bold">
            1. აირჩიე თარიღი
          </h3>

          <label
            htmlFor="visit-date"
            className="mb-2 block text-sm font-semibold"
          >
            ვიზიტის თარიღი
          </label>

          <input
            id="visit-date"
            name="date"
            type="date"
            value={formik.values.date}
            min={toDateKey(new Date())}
            onChange={(event) => onDateChange(event.target.value)}
            onBlur={formik.handleBlur}
            disabled={formik.isSubmitting}
            aria-invalid={Boolean(dateError)}
            aria-describedby={dateError ? 'date-error' : undefined}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
          />

          {dateError && (
            <p id="date-error" role="alert" className="mt-2 text-sm text-red-600">
              {dateError}
            </p>
          )}

          <Calendar
            value={formik.values.date}
            onChange={onDateChange}
          />
        </section>

        <section>
          <h3 className="mb-4 text-lg font-bold">
            2. აირჩიე დრო
          </h3>

          <p className="mb-5 text-sm text-slate-500">
            თავისუფალი და დაკავებული საათები
          </p>

          <TimeSlotPicker
            slots={slots}
            selectedSlotId={formik.values.slotId}
            loading={loading}
            error={error}
            onRetry={onRetry}
            onSelect={(slot) => {
              if (formik.isSubmitting) return;

              void formik.setFieldValue('slotId', slot.id);
              formik.setStatus(undefined);
            }}
          />

          {slotError && (
            <p role="alert" className="mt-3 text-sm text-red-600">
              {slotError}
            </p>
          )}

          {formik.values.slotId && (
            <p className="mt-4 text-sm font-medium text-sky-700">
              არჩეული დრო:{' '}
              {slots.find(
                (slot) => slot.id === formik.values.slotId
              )?.time}
            </p>
          )}
        </section>
      </div>

      <div className="mt-8">
        <label
          htmlFor="comment"
          className="mb-2 block text-sm font-semibold"
        >
          დამატებითი კომენტარი
        </label>

        <textarea
          id="comment"
          name="comment"
          rows={4}
          maxLength={500}
          placeholder="აღწერე ვიზიტის მიზანი (არასავალდებულო)"
          value={formik.values.comment}
          disabled={formik.isSubmitting}
          onChange={(event) => {
            formik.handleChange(event);
            formik.setStatus(undefined);
          }}
          onBlur={formik.handleBlur}
          className="w-full resize-y rounded-xl border border-slate-300 bg-white p-4 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />

        <p className="mt-2 text-right text-xs text-slate-500">
          {formik.values.comment.length} / 500 სიმბოლო
        </p>

        {formik.touched.comment && formik.errors.comment && (
          <p role="alert" className="text-sm text-red-600">
            {formik.errors.comment}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={formik.isSubmitting || loading || Boolean(error)}
        className="mt-6 w-full rounded-xl bg-sky-600 px-6 py-4 font-semibold text-white transition-colors hover:bg-sky-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {formik.isSubmitting
          ? 'მონაცემები მოწმდება...'
          : 'ჯავშნის მონაცემების შემოწმება'}
      </button>

      {status && (
        <p
          role={status.type === 'error' ? 'alert' : 'status'}
          className={`mt-4 rounded-xl p-4 text-sm ${
            status.type === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-sky-50 text-sky-800'
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
}
