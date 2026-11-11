# MediCare — ტელემედიცინისა და კლინიკის მართვის პორტალი

## პროექტის მიმოხილვა
სასწავლო frontend დემო (სცენარი 4: Telemedicine & Clinic Management System). პაციენტს შეუძლია ნახოს
პირადი ბარათი, სამედიცინო ისტორია, ვიზიტის დანიშნულებები და ჯავშნები, ასევე დაარედაქტიროს ჩანაწერი
და დანიშნულება. მონაცემები ხელოვნურია (`public/data/*.json`); რეალური სერვერი ან მრავალმომხმარებლიანი
ჯავშანი ამ დემოს მოცულობაში არ შედის.

---

## გუნდის წევრები და როლები
* **გუნდის ნომერი:** [ჩაწერეთ]
* **სტუდენტი 1:** ელენე [გვარი] — *ექიმების დირექტორია და ფილტრაცია* (`DoctorDirectory`, `DoctorCard`, `useFetchDoctors`)
* **სტუდენტი 2:** ეთო [გვარი] — *ვიზიტის დაჯავშნა* (`BookingModal`, `BookingForm`, `useBookingForm`, `booking.api.ts`)
* **სტუდენტი 3:** სანდრო [გვარი] — *პაციენტის ბარათი, ისტორია და Redux Toolkit* (`PatientDashboard`, `RecordCard`, `useMedicalRecords`, store, `bookingsSlice`)
* **სტუდენტი 4:** გიორგი [გვარი] — *სადემონსტრაციო ჩატი, დებაგინგი და წარმადობა* (`ChatWidget`, `MessageItem`, `useChat`)

---

## ტექნოლოგიური სტეკი
* **Core:** React 19 (Vite 8), TypeScript (strict)
* **Styling:** Tailwind CSS v4 (layout, ფერები, responsive) + SCSS Modules (კომპონენტების კონკრეტული სტილები)
* **State Management:** Redux Toolkit (`createSlice`, `createAsyncThunk`), react-redux typed hooks (`.withTypes`)
* **Data Fetching:** Fetch API + AbortController (სატესტო მონაცემები: ლოკალური JSON `public/data`)
* **Tools:** Git/GitHub, oxlint, Vitest, Chrome DevTools / Redux DevTools

---

## ლოკალურად გაშვება
```bash
git clone <repository-url>
cd <repository-folder>
npm ci            # package-lock.json-ის ზუსტი ვერსიები
npm run dev       # დეველოპმენტ რეჟიმი
npm run build     # tsc -b && vite build → dist/
npm run preview   # production ვერსიის შემოწმება
npm run lint      # oxlint
npm test          # Vitest (slice, thunk, ვალიდაცია)
```

---

## სანდროს მოდული: როგორ მუშაობს
```
api (fetch + ვალიდაცია) → thunk (Promise.all, signal) → slice (requestId დაცვა) → useMedicalRecords → კომპონენტები
```
* `src/features/patient/api/medicalRecords.api.ts` — `getPatient`, `getMedicalRecords`, `getPrescriptions`, `getDoctors`; `response.ok` და პასუხის სტრუქტურის შემოწმება.
* `store/medicalRecordsThunks.ts` — `fetchMedicalData`: დამოუკიდებელი მოთხოვნები `Promise.all`-ით, `thunkAPI.signal` ყველა fetch-ზე.
* `store/medicalRecordsSlice.ts` — `recordAdded`, `recordUpdated`, `prescriptionUpdated` + pending/fulfilled/rejected; მხოლოდ აქტიური `requestId`-ის პასუხი მიიღება.
* `src/app/bookingsSlice.ts` — `bookingAdded`, `fetchBookings`, `selectBookingsByPatient`.
* ძებნა, ღია modal და ფორმის დროებითი მნიშვნელობები რჩება კომპონენტებში (`useState`), ისტორია და ჯავშნები — Redux-ში.

### მონაცემების შენახვის ქცევა (ზუსტად)
* **ჯავშნები:** ინახება ეთოს `booking.api.ts` localStorage ადაპტერში; refresh-ის შემდეგ ბრუნდება და id-ით არ დუბლირდება.
* **სამედიცინო ჩანაწერებისა და დანიშნულებების რედაქტირება:** ინახება მხოლოდ Redux-ში, მიმდინარე სესიის განმავლობაში.
  გვერდის განახლებისას ან სხვა პაციენტზე გადასვლისა და უკან დაბრუნებისას მონაცემები JSON-იდან ხელახლა იტვირთება და
  ცვლილებები ქრება. (განახლების შემდეგ შენარჩუნება ცალკე შესათანხმებელი ამოცანაა.)

### დროებითი ჩანაცვლებები (გუნდის ფაილები)
ამ ფაილებს ჩემი მოდული იყენებს, მაგრამ სხვა წევრებს ეკუთვნის. მერჯისას ჩაანაცვლეთ მათი ვერსიებით:
| ფაილი | მფლობელი | რას ვვარაუდობ |
|---|---|---|
| `src/shared/types/booking.ts` | ეთო | `id, patientId, doctorId, slotId, date (YYYY-MM-DD), time (HH:mm), status` |
| `src/app/booking.api.ts`, `public/data/bookings.json` | ეთო | `getBookings(): Promise<Booking[]>` |
| `src/shared/types/doctor.ts`, `public/data/doctors.json` | ელენე | `id, fullName, specialty` |
| `src/layout/*`, `src/App.tsx` | საერთო | ჰედერი, ნავიგაცია, ექიმებისა და ვიზიტების placeholder-ები, დემო-გადამრთველი პაციენტისთვის |

---

## მნიშვნელოვანი ბმულები და მტკიცებულებები
* **Live Demo:** [ჩასვით ბმული]
* **GitHub Repository:** [ჩასვით ბმული]
* **ჩემი ინდივიდუალური Branch:** `feature/patient-records`
* **ბოლო Commit-ის ჰეში:** [`git rev-parse --short HEAD`]
