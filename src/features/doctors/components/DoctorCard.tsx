import Button from '../../../shared/ui/Button';
import type { Doctor } from '../../../shared/types/doctor';
import styles from './DoctorCard.module.scss';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

const DEFAULT_PHOTO = `${import.meta.env.BASE_URL}images/doctor.svg`;

export default function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  return (
    <article
      className={`${styles.card} flex flex-col gap-3 rounded-2xl border border-line bg-white p-4`}
    >
      <img
        src={doctor.photoUrl ?? DEFAULT_PHOTO}
        alt={doctor.fullName}
        width={320}
        height={240}
        className="aspect-[4/3] w-full rounded-xl object-cover"
      />
      <div>
        <h3 className="text-base font-semibold text-ink">{doctor.fullName}</h3>
        <p className="mt-1 text-sm text-muted">{doctor.specialty}</p>
      </div>
      <Button className="mt-auto w-full" onClick={() => onBook(doctor)}>
        ექიმთან დაჯავშნა
      </Button>
    </article>
  );
}
