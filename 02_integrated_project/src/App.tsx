import React, { useState } from 'react';
import { Doctor } from './shared/types/doctor';
import { DoctorDirectory } from './features/doctors/components/DoctorDirectory';

export default function App() {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const handleBook = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              +
            </div>
            <span className="font-bold text-lg text-gray-900">MedPortal</span>
          </div>
          <span className="text-xs font-medium text-gray-500">ტელემედიცინის პლატფორმა</span>
        </div>
      </header>

      <main className="flex-1">
        <DoctorDirectory onBook={handleBook} />
      </main>

      {selectedDoctor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">ვიზიტის დაჯავშნა</h3>
            <p className="text-sm text-gray-600 mb-4">
              არჩეული ექიმი: <span className="font-semibold text-gray-900">{selectedDoctor.fullName}</span> ({selectedDoctor.specialty})
            </p>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDoctor(null)}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                დახურვა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
