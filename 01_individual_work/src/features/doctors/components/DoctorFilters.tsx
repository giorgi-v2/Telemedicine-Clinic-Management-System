import React from 'react';

interface DoctorFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  specialty: string;
  onSpecialtyChange: (value: string) => void;
  specialties: string[];
  onReset: () => void;
}

export const DoctorFilters: React.FC<DoctorFiltersProps> = ({
  search,
  onSearchChange,
  specialty,
  onSpecialtyChange,
  specialties,
  onReset,
}) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl border border-gray-100 shadow-sm mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="w-full md:w-1/2">
        <label htmlFor="search-doctor" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          ექიმის ძებნა
        </label>
        <input 
          id="search-doctor"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="ჩაწერეთ სახელი..."
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      <div className="w-full md:w-1/3">
        <label htmlFor="specialty-select" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
          სპეციალობა
        </label>
        <select
          id="specialty-select"
          value={specialty}
          onChange={(e) => onSpecialtyChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all cursor-pointer"
        >
          <option value="">ყველა სპეციალობა</option>
          {specialties.map((spec) => (
            <option key={spec} value={spec}>
              {spec}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full md:w-auto flex items-end self-end">
        <button
          type="button"
          onClick={onReset}
          className="w-full md:w-auto px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-sm transition-colors cursor-pointer"
        >
          გასუფთავება
        </button>
      </div>
    </div>
  );
};
