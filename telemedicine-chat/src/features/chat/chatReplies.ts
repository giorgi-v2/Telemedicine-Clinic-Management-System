export interface ChatBooking {
  patientId: string;
  date: string;
  time: string;
  status: string;
}

export const welcomeMessage =
  "გამარჯობა მე ვარ ონლაინ ჩატ ასისტენტი ყველა კითხვაზე შესაძლოა რომ ვერ გიპასუხოთ მე შემიძლია გასწავლოთ თუ როგორ დაიჯავშნოს ვიზიტი და გითხრათ შემდეგი ვიზიტის თარიღი, სხვა კითხვებთან დაკავშირებით გთხოვთ დაუკავშირდეთ ჩვენს კლინიკას +32 2 000 000.";

const greetingReply = "გამარჯობა, რით შემიძლია რომ დაგეხმაროთ?";
const bookingReply =
  "ვიზიტის დაჯავშნა შეგიძლიათ 'ჩემი ვიზიტები'ს გვერდიდან, აირჩიეთ სასურველი ექიმი თარიღი და თავისუფალ დროს კონსულტაციისთვის გიჩვეწნებთ.";
const clinicReply = "გთხოვთ დაუკავშირდეთ კლინიკას +32 2 000 000.";
const noBookingReply = "მომდევნო ვიზიტი არ გაქვთ დაჯავშნილი.";

function getNextBooking(
  bookings: readonly ChatBooking[],
  patientId: string,
  now: Date,
) {
  let next: { booking: ChatBooking; date: Date } | undefined;

  for (const booking of bookings) {
    if (booking.patientId !== patientId || booking.status !== "confirmed")
      continue;
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(booking.date) ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(booking.time)
    )
      continue;

    const date = new Date(booking.date + "T" + booking.time + ":00");
    if (Number.isNaN(date.getTime()) || date <= now) continue;

    const [year, month, day] = booking.date.split("-").map(Number);
    if (
      date.getFullYear() !== year ||
      date.getMonth() + 1 !== month ||
      date.getDate() !== day
    )
      continue;

    if (!next || date < next.date) next = { booking, date };
  }

  return next?.booking;
}

export function getChatReply(
  message: string,
  patientId: string,
  getBookings: () => readonly ChatBooking[],
  now = new Date(),
) {
  const question = message
    .normalize("NFKC")
    .toLocaleLowerCase("ka-GE")
    .replace(/[\p{P}\s]+/gu, " ")
    .trim();

  if (/^(გამარჯობა|გამარჯობათ|სალამი)$/.test(question)) return greetingReply;

  if (
    /^(ვიზიტის დაჯავშნა( (მსურს|მინდა))?|დამიჯავშნე ვიზიტი|როგორ (დავჯავშნო ვიზიტი|დავჯავშნო ჩემი ვიზიტი|დაიჯავშნოს ვიზიტი))$/.test(
      question,
    )
  ) {
    return bookingReply;
  }

  if (
    /^((ჩემი )?ვიზიტი|მაინტერესებს ჩემი ვიზიტის (თარიღი|საათი|დრო|თარიღი და საათი)|როდის (არის|მაქვს) ჩემი (შემდეგი |მომდევნო )?ვიზიტი)$/.test(
      question,
    )
  ) {
    const next = getNextBooking(getBookings(), patientId, now);
    if (!next) return noBookingReply;

    const [year, month, day] = next.date.split("-");
    return `თქვენი შემდეგი ვიზიტის დროა ${day}.${month}.${year}, ${next.time}.`;
  }

  return clinicReply;
}
