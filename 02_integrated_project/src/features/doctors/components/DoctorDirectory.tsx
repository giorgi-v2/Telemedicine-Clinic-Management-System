import React, { useState, useMemo } from 'react';
import { Doctor } from '../../../shared/types/doctor';
import { useFetchDoctors } from '../hooks/useFetchDoctors';
import { DoctorCard } from './DoctorCard';
import { DoctorFilters } from './DoctorFilters';

interface DoctorDirectoryProps {
  onBook: (doctor: Doctor) => void;
}

export const DoctorDirectory: React.FC<DoctorDirectoryProps> = ({ onBook }) => {
  const { doctors, isLoading, error } = useFetchDoctors();
  const [search, setSearch] = useState<string>('');
  const [specialty, setSpecialty] = useState<string>('');

  const specialties = useMemo(() => {
    return [...new Set(doctors.map((doc) => doc.specialty))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const matchesName = doctor.fullName.toLowerCase().includes(query);
      const matchesSpecialty = specialty === '' || doctor.specialty === specialty;

      return matchesName && matchesSpecialty;
    });
  }, [doctors, search, specialty]);

  const handleReset = () => {
    setSearch('');
    setSpecialty('');
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">ჩვენი ექიმები</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-xl border border-gray-100 p-6 h-64 animate-pulse flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
              <div className="w-3/4 h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded mb-6"></div>
              <div className="w-full h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl inline-block max-w-md">
          <p className="font-semibold mb-1">შეცდომა მონაცემების ჩატვირთვისას</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">ჩვენი ექიმები</h2>
        <p className="text-sm text-gray-500 mt-1">აირჩიეთ სასურველი სპეციალისტი და დაჯავშნეთ ვიზიტი ონლაინ</p>
      </div>

      <DoctorFilters 
        search={search}
        onSearchChange={setSearch}
        specialty={specialty}
        onSpecialtyChange={setSpecialty}
        specialties={specialties}
        onReset={handleReset}
      />

      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center shadow-sm">
          <p className="text-gray-600 font-medium text-lg">ექიმები მითითებული კრიტერიუმებით ვერ მოიძებნა</p>
          <p className="text-gray-400 text-sm mt-1">სცადეთ სხვა საძიებო სიტყვა ან ფილტრის შეცვლა</p>
          <button 
            type="button"
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            ფილტრების გასუფთავება
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard key={doctor.id} doctor={doctor} onBook={onBook} />
          ))}
        </div>
      )}
    </div>
  );
};
