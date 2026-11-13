import type { Doctor } from '../../../shared/types/doctor';

const DOCTORS_URL = `${import.meta.env.BASE_URL}data/doctors.json`;

// runtime შემოწმება: JSON-ის ობიექტს ექიმის სწორი ველები აქვს თუ არა
function isDoctor(value: unknown): value is Doctor {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as Record<string, unknown>;

  return (
    typeof item.id === 'string' &&
    typeof item.fullName === 'string' &&
    typeof item.specialty === 'string' &&
    (item.photoUrl === undefined || typeof item.photoUrl === 'string')
  );
}

export async function getDoctors(signal?: AbortSignal): Promise<Doctor[]> {
  const response = await fetch(DOCTORS_URL, { signal });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data) || !data.every(isDoctor)) {
    throw new Error('Invalid doctors data');
  }

  return data;
}
