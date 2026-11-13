
import type {Booking,BookingStatus} from '../types/booking';
import type {BookingsStatus} from '../../../app/bookingsSlice';
import {formatDayMonth} from '../utils/date';
import {Button} from './Button';
import styles from './PatientDashboard.module.scss';
import {StateMessage} from './StateMessage';

interface BookingListProps{bookings:Booking[];status:BookingsStatus;doctorLabels:Record<string,string>;onRetry:()=>void;onBrowseDoctors?:()=>void}

const STATUS_LABELS:Record<BookingStatus,string>={confirmed:'დადასტურებული',pending:'მოლოდინში',cancelled:'გაუქმებული'};
const STATUS_CLASSES:Record<BookingStatus,string>={confirmed:'bg-success-soft text-success',pending:'bg-brand-100 text-brand-700',cancelled:'bg-surface text-muted'};

export function BookingList({bookings,status,doctorLabels,onRetry,onBrowseDoctors}:BookingListProps){
const title=bookings.length>1?'მომავალი ვიზიტები':'მომავალი ვიზიტი';
return <section aria-labelledby="bookings-title" className="rounded-xl border border-line bg-white p-5 sm:p-6">
<h2 id="bookings-title" className="text-2xl font-bold text-ink">{title}</h2>
{status==='failed'?<div className="mt-4"><StateMessage bare role="alert" tone="danger" title="ჯავშნების ჩატვირთვის შეცდომა" description="ჯავშნები ვერ ჩაიტვირთა." actionLabel="ხელახლა ცდა" onAction={onRetry}/></div>
:bookings.length===0?(status==='pending'||status==='idle'?<div className="mt-4"><StateMessage bare title="ჯავშნები იტვირთება" description="ცოტა ხანში გამოჩნდება."/></div>
:<div className="mt-4"><StateMessage bare title="ჯავშნები არ არის" description="მომავალი ვიზიტის დასამატებლად აირჩიე ექიმი."/>{onBrowseDoctors&&<Button onClick={onBrowseDoctors} className="mt-4 w-full">ექიმების ნახვა</Button>}</div>)
:<ul className="mt-4 flex list-none flex-col gap-5 p-0">{bookings.map(b=><li key={b.id}>
<span className={`inline-block rounded-md px-3 py-1.5 text-xs font-medium ${STATUS_CLASSES[b.status]}`}>{STATUS_LABELS[b.status]}</span>
<p className="mt-3 text-xl font-bold text-ink"><time dateTime={`${b.date}T${b.time}`}>{formatDayMonth(b.date)} · {b.time}</time></p>
<p className={`${styles.wrapText} mt-2 text-[15px] text-muted`}>{doctorLabels[b.doctorId]??'ექიმი მითითებული არ არის'}</p>
<p className="mt-2 text-xs text-muted">ჯავშანი: {b.id}</p>
</li>)}</ul>}
</section>;
}
