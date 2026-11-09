import { DEMO_PATIENTS } from '../app/demoPatients'
import { getInitials, getShortName } from '../features/patient/utils/name'

// Figma-ს ჰედერი. "ექიმები" და "ჩემი ვიზიტები" სხვა სტუდენტების მოდულებია და ამ პროექტში გამორთულია.
const NAV_ITEMS = [
  { label: 'ექიმები', active: false },
  { label: 'ჩემი ვიზიტები', active: false },
  { label: 'პაციენტის ბარათი', active: true },
] as const

interface AppHeaderProps {
  patientId: string
  onPatientChange: (patientId: string) => void
}

function Logo() {
  return (
    <div className="flex items-center gap-3">
      <span aria-hidden="true" className="grid size-9 place-items-center rounded-lg bg-brand-600 text-white sm:size-10">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="text-lg font-bold text-ink sm:text-xl">MediCare</span>
    </div>
  )
}

export function AppHeader({ patientId, onPatientChange }: AppHeaderProps) {
  const current = DEMO_PATIENTS.find((patient) => patient.id === patientId) ?? DEMO_PATIENTS[0]

  return (
    <header className="border-b border-line bg-white">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:h-20 sm:px-8 xl:px-0">
        <Logo />

        {/* Figma: მობილურზე მხოლოდ ლოგო ჩანს */}
        <nav aria-label="მთავარი ნავიგაცია" className="hidden sm:block">
          <ul className="flex list-none items-center gap-5 p-0 lg:gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                {item.active ? (
                  <span aria-current="page" className="px-1 py-2 text-sm font-semibold text-brand-600">
                    {item.label}
                  </span>
                ) : (
                  <span
                    aria-disabled="true"
                    title="სხვა სტუდენტის მოდული"
                    className="cursor-not-allowed px-1 py-2 text-sm font-semibold text-ink opacity-60"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* პროფილის ჩიპი + მშობლიური select დემო-პაციენტის გადასართავად */}
        <label className="relative hidden cursor-pointer items-center gap-3 rounded-full py-1 pr-2 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-brand-600 sm:flex">
          <span aria-hidden="true" className="grid size-10 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-600">
            {getInitials(current.fullName)}
          </span>
          <span aria-hidden="true" className="text-sm font-semibold text-ink">
            {getShortName(current.fullName)}
          </span>
          <span className="sr-only">დემო: პაციენტის არჩევა</span>
          <select
            value={patientId}
            onChange={(event) => onPatientChange(event.target.value)}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          >
            {DEMO_PATIENTS.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.fullName} ({patient.id})
              </option>
            ))}
          </select>
        </label>
      </div>
    </header>
  )
}
