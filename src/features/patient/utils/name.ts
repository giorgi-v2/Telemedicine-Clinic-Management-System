
export function getInitials(fullName:string):string{
return fullName.trim().split(/\s+/).filter(Boolean).slice(0,2).map(w=>Array.from(w)[0]).join('');
}

export function getShortName(fullName:string):string{
const [first,last]=fullName.trim().split(/\s+/);
if(!first)return '';
if(!last)return first;
return `${first} ${Array.from(last)[0]}.`;
}
