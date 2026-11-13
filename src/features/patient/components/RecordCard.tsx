
import {memo} from 'react';
import type {MedicalRecord,Prescription} from '../../../shared/types/medicalRecord';
import {formatLongDate} from '../utils/date';
import {Button} from './Button';
import styles from './PatientDashboard.module.scss';

export interface RecordCardProps{record:MedicalRecord;prescriptions:Prescription[];onEdit:(record:MedicalRecord)=>void;doctorLabel?:string;onShowPrescriptions?:(recordId:string)=>void;isPrescriptionsShown?:boolean}

function RecordCardComponent({record,prescriptions,onEdit,doctorLabel,onShowPrescriptions,isPrescriptionsShown=false}:RecordCardProps){
const countLabel=prescriptions.length>0?`${prescriptions.length} დანიშნულება`:'დანიშნულების გარეშე';
return <article className={`${styles.recordCard} rounded-xl border border-line bg-white p-5 sm:p-6`}>
<time dateTime={record.visitDate} className="block text-xs font-medium text-brand-600">{formatLongDate(record.visitDate)}</time>
<h3 className={`${styles.wrapText} mt-3 text-xl font-bold text-ink`}>{record.title}</h3>
<p className={`${styles.wrapText} mt-3 text-sm font-semibold text-ink`}>{doctorLabel??'ექიმი მითითებული არ არის'}</p>
<p className={`${styles.notes} mt-3 text-[15px]`}>{record.notes}</p>
<div className="mt-4 flex flex-wrap items-center gap-3">
{onShowPrescriptions?<button type="button" aria-pressed={isPrescriptionsShown} aria-label={`${countLabel} — ვიზიტის დანიშნულებების ჩვენება`} onClick={()=>onShowPrescriptions(record.id)} className={`${styles.countBadge} cursor-pointer rounded-md bg-brand-100 px-3 py-1.5 text-xs font-medium text-brand-600`}>{countLabel}</button>:
<span className="rounded-md bg-brand-100 px-3 py-1.5 text-xs font-medium text-brand-600">{countLabel}</span>}
<Button onClick={()=>onEdit(record)} aria-label={`რედაქტირება: ${record.title}`} className="min-w-36">რედაქტირება</Button>
</div>
</article>;
}

export const RecordCard=memo(RecordCardComponent);
