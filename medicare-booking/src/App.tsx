
import styles from './App.module.scss';

export default function App() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-16">
      <section
        className={`${styles.introCard} mx-auto max-w-2xl rounded-2xl bg-white p-8`}
      >
        <p className="mb-3 text-sm font-semibold text-sky-700">
          MediCare
        </p>

        <h1 className="text-3xl font-bold text-slate-900">
          ვიზიტის ონლაინ დაჯავშნა
        </h1>

        <p className="mt-4 text-slate-600">
          აირჩიე ექიმი, სასურველი თარიღი და ვიზიტის დრო.
        </p>
      </section>
    </main>
  );
}
