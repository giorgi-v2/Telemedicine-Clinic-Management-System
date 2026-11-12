import { Doctor } from '../../../shared/types/doctor';

export async function getDoctors(signal?: AbortSignal): Promise<Doctor[]> {
  const response = await fetch('/data/doctors.json', { signal });
  
  if (!response.ok) {
    throw new Error('ვერ მოხერხდა ექიმების მონაცემების ჩამოტვირთვა');
  }

  const data = await response.json();
  
  if (!Array.isArray(data)) {
    throw new Error('არასწორი მონაცემთა ფორმატი');
  }

  return data as Doctor[];
}
