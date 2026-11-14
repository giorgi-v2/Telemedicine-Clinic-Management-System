
import type {MedicalRecord,Prescription} from '../../../shared/types/medicalRecord';
import {formatLongDate} from '../utils/date';
import {Button} from './Button';
import styles from './PatientDashboard.module.scss';
import {StateMessage} from './StateMessage';

interface PrescriptionListProps{record:MedicalRecord|null;prescriptions:Prescription[];onEdit:()=>void}

export function PrescriptionList({record,prescriptions,onEdit}:PrescriptionListProps){
return <section aria-labelledby="prescriptions-title" className="rounded-xl border border-line bg-white p-5 sm:p-6">
<h2 id="prescriptions-title" className="text-2xl font-bold text-ink">დანიშნულებები</h2>
{record&&<p className="mt-3 text-xs font-medium text-brand-600">ვიზიტი · {formatLongDate(record.visitDate)}</p>}
{prescriptions.length===0?
<div className="mt-4"><StateMessage bare title="დანიშნულებები არ არის" description="ამ ჩანაწერს დანიშნულება ჯერ არ აქვს."/></div>:
<>
<ul className={`${styles.prescriptionList} mt-4`}>
{prescriptions.map(p=><li key={p.id} className={styles.prescriptionItem}>
<p className={`${styles.wrapText} text-xl font-bold text-ink`}>{p.medication}</p>
<p className={`${styles.wrapText} mt-2 text-[15px] text-muted`}>{p.instructions}</p>
</li>)}
</ul>
<Button onClick={onEdit} className="mt-5 w-full">დანიშნულების რედაქტირება</Button>
</>}
</section>;
}
