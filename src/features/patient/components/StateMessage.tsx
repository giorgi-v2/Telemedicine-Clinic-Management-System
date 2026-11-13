
import {Button} from './Button';

interface StateMessageProps{title:string;description:string;tone?:'neutral'|'danger';actionLabel?:string;onAction?:()=>void;role?:'status'|'alert';bare?:boolean}

const TITLE_CLASSES={neutral:'text-ink',danger:'text-danger'} as const;

export function StateMessage({title,description,tone='neutral',actionLabel,onAction,role='status',bare=false}:StateMessageProps){
const frame=bare?'':'rounded-xl border border-line bg-white px-5 py-4';
return <div className="@container">
<div role={role} className={`flex flex-col gap-3 @md:flex-row @md:items-center @md:justify-between ${frame}`}>
<div className="min-w-0">
<p className={`text-base font-bold ${TITLE_CLASSES[tone]}`}>{title}</p>
<p className="mt-1 text-[13px] text-muted">{description}</p>
</div>
{actionLabel&&onAction&&<Button onClick={onAction} className="shrink-0 @md:min-w-36">{actionLabel}</Button>}
</div>
</div>;
}
