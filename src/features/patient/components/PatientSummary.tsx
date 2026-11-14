
import type {Patient} from '../../../shared/types/patient';
import {formatLongDate} from '../utils/date';
import {getInitials} from '../utils/name';

interface PatientSummaryProps{patient:Patient}

export function PatientSummary({patient}:PatientSummaryProps){
return <section aria-label="პაციენტის ინფორმაცია" className="flex items-center gap-4 rounded-2xl bg-brand-50 px-5 py-6 sm:gap-8 sm:px-10 sm:py-8">
<div aria-hidden="true" className="w-10 shrink-0 text-center text-xl font-bold text-brand-600 sm:w-12 sm:text-2xl">{getInitials(patient.fullName)}</div>
<div className="min-w-0">
<h2 className="text-xl font-bold text-ink sm:text-[22px]">{patient.fullName}</h2>
<p className="mt-1.5 text-[15px] text-muted">დაბადების თარიღი: {formatLongDate(patient.birthDate)}</p>
<p className="mt-1 text-xs text-muted">პაციენტის ნომერი: {patient.id}</p>
</div>
</section>;
}
