
import * as Yup from 'yup';
import { toDateKey } from '../utils/bookingDates';

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export const bookingSchema = Yup.object({
  date: Yup.string()
    .required('აირჩიე ვიზიტის თარიღი.')
    .test(
      'valid-date',
      'თარიღი არასწორია.',
      (value) => !value || isValidDate(value)
    )
    .test(
      'not-past',
      'წარსული თარიღის არჩევა შეუძლებელია.',
      (value) =>
        !value ||
        !isValidDate(value) ||
        value >= toDateKey(new Date())
    ),

  slotId: Yup.string()
    .required('აირჩიე ვიზიტის დრო.'),

  comment: Yup.string()
    .trim()
    .max(500, 'კომენტარი მაქსიმუმ 500 სიმბოლოს უნდა შეიცავდეს.'),
});
