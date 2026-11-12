
import {useId} from 'react';
import type {ChangeEvent} from 'react';
import {fieldClasses} from './fieldStyles';

interface FormFieldProps{label:string;name:string;value:string;onChange:(value:string)=>void;onBlur?:()=>void;error?:string;multiline?:boolean;disabled?:boolean}

export function FormField({label,name,value,onChange,onBlur,error,multiline=false,disabled=false}:FormFieldProps){
const id=useId(),errorId=`${id}-error`,classes=fieldClasses(Boolean(error));
const handleChange=(e:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>onChange(e.target.value);
return <div className="mb-4">
<label htmlFor={id} className="mb-2 block text-[13px] font-semibold text-ink">{label}</label>
{multiline?
<textarea id={id} name={name} rows={4} value={value} disabled={disabled} onChange={handleChange} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} className={`${classes} min-h-28 resize-y`}/>:
<input id={id} name={name} type="text" value={value} disabled={disabled} onChange={handleChange} onBlur={onBlur} aria-invalid={Boolean(error)} aria-describedby={error?errorId:undefined} className={classes}/>}
{error&&<p id={errorId} role="alert" className="mt-2 text-[13px] text-danger">{error}</p>}
</div>;
}
