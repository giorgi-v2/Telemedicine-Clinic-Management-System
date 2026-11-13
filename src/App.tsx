import PageLayout from './shared/ui/PageLayout';
import DoctorDirectory from './features/doctors/components/DoctorDirectory';
import type { Doctor } from './shared/types/doctor';

export default function App() {
  // ეთოსთან დასაკავშირებელი წერტილი: აქ შეინახება არჩეული ექიმი და გაიხსნება ჯავშნის მოდალი.
  const handleBook = (doctor: Doctor) => {
    console.log('onBook:', doctor);
  };

  return (
    <PageLayout>
      <DoctorDirectory onBook={handleBook} />
    </PageLayout>
  );
}
