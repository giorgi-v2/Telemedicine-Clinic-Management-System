import { useMemo, useState, type ReactNode } from 'react';
import Button from '../../../shared/ui/Button';
import type { Doctor } from '../../../shared/types/doctor';
import { useFetchDoctors } from '../hooks/useFetchDoctors';
import DoctorCard from './DoctorCard';
import DoctorFilters from './DoctorFilters';

interface DoctorDirectoryProps {
  onBook: (doctor: Doctor) => void;
  onChat: (doctor: Doctor) => void;
}

interface StatePanelProps {
  title: string;
  text: string;
  isError?: boolean;
  action?: ReactNode;
}

// ერთნაირი პანელი ცარიელი შედეგის, შეცდომისა და ჩატვირთვისთვის
function StatePanel({ title, text, isError = false, action }: StatePanelProps) {
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className="flex flex-col gap-3 rounded-2xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h2 className={`text-base font-semibold ${isError ? 'text-danger' : 'text-ink'}`}>{title}</h2>
        <p className="mt-1 text-sm text-muted">{text}</p>
      </div>
      {action}
    </div>
  );
}

// ჩატვირთვისას ბარათების ადგილას ნაცრისფერი ბლოკები ჩანს
function SkeletonCard() {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4">
      <div className="aspect-[4/3] w-full rounded-xl bg-line" />
      <div className="h-4 w-1/2 rounded bg-line" />
      <div className="h-11 w-full rounded-lg bg-line" />
    </div>
  );
}

// ბარათების ბადე: მობილური — 1 სვეტი, ტაბლეტი (md) — 2, კომპიუტერი (lg) — 3
const GRID_CLASSES = 'grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3';

export default function DoctorDirectory({ onBook, onChat }: DoctorDirectoryProps) {
  const { doctors, isLoading, error, reload } = useFetchDoctors();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');

  const specialties = useMemo(
    () => [...new Set(doctors.map((doctor) => doctor.specialty))],
    [doctors],
  );

  // წარმოებული მონაცემი: ახალ state-ს არ ვქმნით, ვითვლით doctors/search/specialty-დან
  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesName = doctor.fullName.toLowerCase().includes(query);
      const matchesSpecialty = specialty === '' || doctor.specialty === specialty;

      return matchesName && matchesSpecialty;
    });
  }, [doctors, search, specialty]);

  const clearFilters = () => {
    setSearch('');
    setSpecialty('');
  };

  let content: ReactNode;

  if (isLoading) {
    content = (
      <div className="mt-6 flex flex-col gap-4">
        <StatePanel title="მიმდინარეობს ჩატვირთვა" text="გთხოვთ დაელოდოთ, ექიმების სია იტვირთება." />
        <div className={GRID_CLASSES}>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  } else if (error) {
    content = (
      <div className="mt-6">
        <StatePanel
          isError
          title="ჩატვირთვის შეცდომა"
          text={error}
          action={
            <Button variant="outline" onClick={reload}>
              ხელახლა ცდა
            </Button>
          }
        />
      </div>
    );
  } else if (filteredDoctors.length === 0) {
    content = (
      <div className="mt-6">
        <StatePanel
          title="შედეგი ვერ მოიძებნა"
          text="სცადეთ სხვა სახელი ან სპეციალობა."
          action={
            <Button variant="outline" onClick={clearFilters}>
              ფილტრების გასუფთავება
            </Button>
          }
        />
      </div>
    );
  } else {
    content = (
      <>
        <p aria-live="polite" className="mt-6 text-sm text-muted">
          ნაპოვნია {filteredDoctors.length} ექიმი
        </p>
        <div className={`mt-3 ${GRID_CLASSES}`}>
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} onChat={onChat} />
          ))}
        </div>
      </>
    );
  }

  return (
    <section>
      <div className="rounded-3xl bg-hero p-6 sm:p-8 lg:px-12 lg:py-10">
        <p className="text-sm font-medium text-primary">ჩვენი გუნდი</p>
        <h1 className="mt-2 text-3xl font-bold text-ink sm:text-4xl">ჩვენი ექიმები</h1>
        <p className="mt-2 text-sm text-muted sm:text-base">
          აირჩიე შენთვის სასურველი ექიმი და დაჯავშნე ვიზიტი.
        </p>
      </div>

      <DoctorFilters
        search={search}
        specialty={specialty}
        specialties={specialties}
        onSearchChange={setSearch}
        onSpecialtyChange={setSpecialty}
        onClear={clearFilters}
      />

      {content}
    </section>
  );
}
