import React from 'react';
import { Doctor } from '../../../shared/types/doctor';
import styles from './DoctorCard.module.scss';

interface DoctorCardProps {
  doctor: Doctor;
  onBook: (doctor: Doctor) => void;
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor, onBook }) => {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 p-5 flex flex-col items-center text-center shadow-sm ${styles.doctorCard}`}>
      <div className="w-24 h-24 rounded-full overflow-hidden bg-blue-50 mb-4 border-2 border-blue-100">
        <img 
          src={doctor.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'} 
          alt={doctor.fullName}
          className={`w-full h-full ${styles.avatar}`}
        />
      </div>
      
      <h3 className="font-semibold text-lg text-gray-800 mb-1">{doctor.fullName}</h3>
      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full mb-5">
        {doctor.specialty}
      </span>
      
      <button 
        type="button" 
        onClick={() => onBook(doctor)}
        className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors cursor-pointer text-sm shadow-sm"
      >
        დაჯავშნა
      </button>
    </div>
  );
};
