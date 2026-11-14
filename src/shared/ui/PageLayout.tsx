
import { useState, type ReactNode } from 'react';

export type Page = 'doctors' | 'appointments' | 'patient';

interface PageLayoutProps {
  children: ReactNode;
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const NAV_LINKS: { label: string; page: Page }[] = [
  { label: 'ექიმები', page: 'doctors' },
  { label: 'ჩემი ვიზიტები', page: 'appointments' },
  { label: 'პაციენტის ბარათი', page: 'patient' },
];

export default function PageLayout({
  children,
  activePage,
  onNavigate,
}: PageLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = (page: Page) => {
    onNavigate(page);
    setIsMenuOpen(false);
  };

  const navClass = (page: Page) =>
    `text-sm font-medium transition-colors ${
      activePage === page
        ? 'text-primary'
        : 'text-ink hover:text-primary'
    }`;

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate('doctors')}
            className="flex items-center gap-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xl font-bold text-white">
              +
            </span>
            <span className="text-base font-bold text-ink">
              MediCare
            </span>
          </button>

          <nav
            aria-label="მთავარი ნავიგაცია"
            className="hidden flex-1 items-center justify-center gap-8 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => navigate(link.page)}
                aria-current={
                  activePage === link.page ? 'page' : undefined
                }
                className={navClass(link.page)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => navigate('patient')}
            className="hidden items-center gap-2 lg:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hero text-sm font-medium text-primary">
              პ
            </span>
            <span className="text-sm font-medium text-ink">
              პაციენტი
            </span>
          </button>

          <button
            type="button"
            aria-label="მენიუ"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-xl text-primary md:hidden"
          >
            ≡
          </button>
        </div>

        {isMenuOpen && (
          <nav
            aria-label="მობილური ნავიგაცია"
            className="flex flex-col gap-3 border-t border-line px-4 py-3 md:hidden"
          >
            {NAV_LINKS.map((link) => (
              <button
                key={link.page}
                type="button"
                onClick={() => navigate(link.page)}
                aria-current={
                  activePage === link.page ? 'page' : undefined
                }
                className={`${navClass(link.page)} text-left`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        {children}
      </main>
    </div>
  );
}
