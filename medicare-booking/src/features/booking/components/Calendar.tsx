
import { useEffect, useMemo, useState } from 'react';
import {
  fromDateKey,
  isPastDate,
  toDateKey,
} from '../utils/bookingDates';
import styles from './Calendar.module.scss';

interface CalendarProps {
  value: string;
  onChange: (date: string) => void;
}

const weekDays = [
  'ორ', 'სამ', 'ოთხ', 'ხუთ', 'პარ', 'შაბ', 'კვ'
];

export default function Calendar({
  value,
  onChange,
}: CalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(() => {
    const selected = fromDateKey(value);
    return new Date(
      selected.getFullYear(),
      selected.getMonth(),
      1
    );
  });

  useEffect(() => {
    const date = fromDateKey(value);
    setVisibleMonth(
      new Date(date.getFullYear(), date.getMonth(), 1)
    );
  }, [value]);

  const days = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const offset = (firstDay.getDay() + 6) % 7;
    const totalDays = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: offset }, () => null),
      ...Array.from(
        { length: totalDays },
        (_, index) => index + 1
      ),
    ];
  }, [visibleMonth]);

  const monthLabel = new Intl.DateTimeFormat('ka-GE', {
    month: 'long',
    year: 'numeric',
  }).format(visibleMonth);

  const today = new Date();

  const canGoPrevious =
    visibleMonth.getFullYear() > today.getFullYear() ||
    (
      visibleMonth.getFullYear() === today.getFullYear() &&
      visibleMonth.getMonth() > today.getMonth()
    );

  const changeMonth = (amount: number) => {
    setVisibleMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + amount,
          1
        )
    );
  };

  return (
    <div className={styles.calendar}>
      <div className={styles.heading}>
        <strong>{monthLabel}</strong>

        <div className={styles.navigation}>
          <button
            type="button"
            aria-label="წინა თვე"
            disabled={!canGoPrevious}
            onClick={() => changeMonth(-1)}
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="შემდეგი თვე"
            onClick={() => changeMonth(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {weekDays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className={styles.days}>
        {days.map((day, index) => {
          if (day === null) {
            return (
              <span
                key={`empty-${index}`}
                aria-hidden="true"
              />
            );
          }

          const date = new Date(
            visibleMonth.getFullYear(),
            visibleMonth.getMonth(),
            day
          );

          const dateKey = toDateKey(date);
          const selected = dateKey === value;
          const disabled = isPastDate(date);

          return (
            <button
              key={dateKey}
              type="button"
              disabled={disabled}
              aria-pressed={selected}
              aria-label={dateKey}
              className={[
                styles.day,
                selected ? styles.selected : '',
                disabled ? styles.disabled : '',
              ].join(' ')}
              onClick={() => onChange(dateKey)}
            >
              {day}
            </button>
          );
        })}
      </div>

      <p className={styles.legend}>
        ლურჯი — არჩეული დღე · ნაცრისფერი — გასული დღე
      </p>
    </div>
  );
}
