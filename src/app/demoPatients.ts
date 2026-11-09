// დემო-გადამრთველისთვის: ავტორიზაცია არ არის, ამიტომ პაციენტი ამ სიიდან ირჩევა.
// PAT-003-ს ჩანაწერები არ აქვს — "ისტორია ცარიელია" მდგომარეობის სანახავად.
export interface DemoPatient {
  id: string
  fullName: string
}

export const DEMO_PATIENTS: readonly DemoPatient[] = [
  { id: 'PAT-001', fullName: 'გიორგი ბერიძე' },
  { id: 'PAT-002', fullName: 'მარიამ ჯავახიშვილი' },
  { id: 'PAT-003', fullName: 'ლუკა მამულაშვილი' },
]
