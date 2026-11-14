import Button from '../../../shared/ui/Button';
import Input from '../../../shared/ui/Input';

interface DoctorFiltersProps {
  search: string;
  specialty: string;
  specialties: string[];
  onSearchChange: (value: string) => void;
  onSpecialtyChange: (value: string) => void;
  onClear: () => void;
}

export default function DoctorFilters({
  search,
  specialty,
  specialties,
  onSearchChange,
  onSpecialtyChange,
  onClear,
}: DoctorFiltersProps) {
  return (
    // მობილურზე ველები ერთმანეთის ქვემოთაა, md-დან — ერთ ხაზზე
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-[1fr_16rem_auto] md:items-end">
      <Input
        id="doctor-search"
        label="ექიმის სახელი"
        type="search"
        placeholder="მოძებნე ექიმი..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
      />

      <div>
        <label htmlFor="doctor-specialty" className="mb-1 block text-sm font-medium text-ink">
          სპეციალობა
        </label>
        <select
          id="doctor-specialty"
          value={specialty}
          onChange={(event) => onSpecialtyChange(event.target.value)}
          className="h-11 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink focus:border-primary"
        >
          <option value="">ყველა სპეციალობა</option>
          {specialties.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <Button variant="outline" onClick={onClear} className="w-full md:w-auto">
        გასუფთავება
      </Button>
    </div>
  );
}
