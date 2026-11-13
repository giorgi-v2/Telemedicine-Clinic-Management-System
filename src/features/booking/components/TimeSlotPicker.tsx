
import type { AppointmentSlot } from '../../../shared/types/booking';
import styles from './TimeSlotPicker.module.scss';

interface TimeSlotPickerProps {
  slots: AppointmentSlot[];
  selectedSlotId: string;
  loading: boolean;
  error: string;
  onSelect: (slot: AppointmentSlot) => void;
  onRetry: () => void;
}

export default function TimeSlotPicker({
  slots,
  selectedSlotId,
  loading,
  error,
  onSelect,
  onRetry,
}: TimeSlotPickerProps) {
  if (loading) {
    return (
      <p className="py-6 text-sm text-slate-500" role="status">
        თავისუფალი საათები იტვირთება...
      </p>
    );
  }

  if (error) {
    return (
      <div className="py-5" role="alert">
        <p className="text-sm text-red-600">{error}</p>

        <button
          type="button"
          className="mt-3 rounded-lg bg-sky-600 px-4 py-2 text-white"
          onClick={onRetry}
        >
          ხელახლა ცდა
        </button>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="py-6 text-sm text-slate-500" role="status">
        ამ თარიღისთვის ვიზიტის საათები არ არის.
        აირჩიე სხვა დღე.
      </p>
    );
  }

  return (
    <div>
      <div className={styles.timeGrid} role="group" aria-label="ვიზიტის დრო">
        {slots.map((slot) => {
          const selected = slot.id === selectedSlotId;

          return (
            <button
              key={slot.id}
              type="button"
              disabled={!slot.isAvailable}
              aria-pressed={selected}
              aria-label={`${slot.time} — ${
                slot.isAvailable ? 'თავისუფალი' : 'დაკავებული'
              }`}
              className={[
                styles.timeSlot,
                selected ? styles.selected : '',
                !slot.isAvailable ? styles.booked : '',
              ].join(' ')}
              onClick={() => onSelect(slot)}
            >
              {slot.time}
            </button>
          );
        })}
      </div>

      <div className={styles.legend}>
        <span>ლურჯი — არჩეული</span>
        <span>ნაცრისფერი — დაკავებული</span>
      </div>
    </div>
  );
}
