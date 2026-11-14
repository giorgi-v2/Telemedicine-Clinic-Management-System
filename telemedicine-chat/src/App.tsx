import { faComments, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ChatIcon } from "./features/chat/ChatIcon";
import { ChatWidget } from "./features/chat/ChatWidget";
import { readSavedBookings } from "./features/chat/readSavedBookings";
import "./App.css";

const patientId =
  new URLSearchParams(window.location.search).get("patient") ||
  "patient-demo-001";

export default function App() {
  return (
    <div className="chat-preview min-h-dvh">
      <header className="preview-header">
        <div className="preview-header__inner mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-bold">
            <span
              className="preview-brand-icon grid place-items-center"
              aria-hidden="true"
            >
              <ChatIcon icon={faPlus} />
            </span>
            MediCare
          </div>
          <span className="text-sm font-semibold">ონლაინ ჩატი</span>
        </div>
      </header>

      <main className="preview-main mx-auto">
        <section
          className="preview-content grid gap-6"
          aria-labelledby="preview-title"
        >
          <h1 id="preview-title">ონლაინ ჩატ ასისტენტი</h1>
          <p className="preview-intro">
            მიიღეთ ინფორმაცია ვიზიტის დაჯავშნისა და თქვენი მომდევნო ვიზიტის
            შესახებ.
          </p>

          <div className="preview-card flex items-start gap-4">
            <span
              className="preview-card-icon grid shrink-0 place-items-center"
              aria-hidden="true"
            >
              <ChatIcon icon={faComments} />
            </span>
            <div className="grid gap-2">
              <h2 className="font-semibold">როგორ დაგეხმაროთ?</h2>
              <p>
                გახსენით ჩატი და ჰკითხეთ ასისტენტს, როგორ დაჯავშნოთ ვიზიტი ან
                როდის არის თქვენი მომდევნო კონსულტაცია.
              </p>
            </div>
          </div>
        </section>

        <ChatWidget patientId={patientId} getBookings={readSavedBookings} />
      </main>
    </div>
  );
}
