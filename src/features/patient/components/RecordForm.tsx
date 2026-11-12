
import {useRef,useState} from 'react';
import type {FormEvent} from 'react';
import type {MedicalRecord,MedicalRecordChanges} from '../../../shared/types/medicalRecord';
import {useSaveFeedback} from '../hooks/useSaveFeedback';
import {hasErrors,validateRecordDraft} from '../utils/validation';
import {Button} from './Button';
import {FormField} from './FormField';

export interface RecordFormProps{record:MedicalRecord;onSubmit:(id:string,changes:MedicalRecordChanges)=>void;onCancel:()=>void}
type Touched=Record<keyof MedicalRecordChanges,boolean>;

export function RecordForm({record,onSubmit,onCancel}:RecordFormProps){
const [values,setValues]=useState<MedicalRecordChanges>({title:record.title,notes:record.notes});
const [touched,setTouched]=useState<Touched>({title:false,notes:false});
const [submitted,setSubmitted]=useState(false);
const formRef=useRef<HTMLFormElement>(null);
const {isSaving,startSaving}=useSaveFeedback(()=>onSubmit(record.id,{title:values.title.trim(),notes:values.notes.trim()}));
const errors=validateRecordDraft(values);
const show=(f:keyof MedicalRecordChanges)=>touched[f]||submitted?errors[f]:undefined;
const touch=(f:keyof MedicalRecordChanges)=>()=>setTouched(p=>({...p,[f]:true}));

const handleSubmit=(e:FormEvent<HTMLFormElement>)=>{
e.preventDefault();
if(isSaving)return;
setSubmitted(true);
if(hasErrors(errors)){
const field=formRef.current?.elements.namedItem(errors.title?'title':'notes');
if(field instanceof HTMLElement)field.focus();
return;
}
startSaving();
};

return <form ref={formRef} onSubmit={handleSubmit} noValidate>
<FormField label="სათაური" name="title" value={values.title} onChange={title=>setValues(p=>({...p,title}))} onBlur={touch('title')} error={show('title')} disabled={isSaving}/>
<FormField label="აღწერა" name="notes" multiline value={values.notes} onChange={notes=>setValues(p=>({...p,notes}))} onBlur={touch('notes')} error={show('notes')} disabled={isSaving}/>
<div className="mt-6 flex flex-col gap-3">
<Button type="submit" variant="primary" disabled={isSaving} className="w-full">{isSaving?'ინახება...':'ცვლილებების შენახვა'}</Button>
<Button onClick={onCancel} disabled={isSaving} className="w-full">გაუქმება</Button>
</div>
</form>;
}
