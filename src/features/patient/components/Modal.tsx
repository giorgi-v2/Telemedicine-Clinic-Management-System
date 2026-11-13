
import {useEffect,useId,useRef} from 'react';
import type {ReactNode} from 'react';
import styles from './Modal.module.scss';

interface ModalProps{title:string;description:string;onClose:()=>void;isBusy?:boolean;children:ReactNode}

export function Modal({title,description,onClose,isBusy=false,children}:ModalProps){
const dialogRef=useRef<HTMLDialogElement>(null),titleId=useId(),descriptionId=useId();

useEffect(()=>{
const d=dialogRef.current;
if(!d)return;
const prev=document.activeElement instanceof HTMLElement?document.activeElement:null;
if(!d.open)d.showModal();
return()=>{if(d.open)d.close();if(prev?.isConnected)prev.focus()};
},[]);

return <dialog ref={dialogRef} className={styles.dialog} aria-labelledby={titleId} aria-describedby={descriptionId}
onCancel={e=>{e.preventDefault();if(!isBusy)onClose()}}
onClick={e=>{if(e.target===e.currentTarget&&!isBusy)onClose()}}>
<div className={`${styles.panel} rounded-2xl border border-line bg-white p-6 sm:p-8`}>
<h2 id={titleId} className="text-[26px] leading-tight font-bold text-ink sm:text-3xl">{title}</h2>
<p id={descriptionId} className="mt-4 mb-5 text-[15px] text-muted">{description}</p>
{children}
</div>
</dialog>;
}
