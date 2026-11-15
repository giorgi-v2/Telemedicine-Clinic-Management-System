import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';

interface PageLayoutProps {
  children: ReactNode;
  onNavigate: () => void;
}

const NAV_LINKS = [
  { label: 'ექიმები', to: '/doctors' },
  { label: 'ჩემი ვიზიტები', to: '/appointments' },
  { label: 'პაციენტის ბარათი', to: '/patient' },
];

export default function PageLayout({
  children,
  onNavigate,
}: PageLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavigate = () => {
    onNavigate();
    setIsMenuOpen(false);
  };

  const navClass = (isActive: boolean) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-primary' : 'text-ink hover:text-primary'
    }`;

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <NavLink
            to="/doctors"
            onClick={handleNavigate}
            className="flex items-center gap-3"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xl font-bold text-white">
              +
            </span>
            <span className="text-base font-bold text-ink">
              MediCare
            </span>
          </NavLink>

          <nav
            aria-label="მთავარი ნავიგაცია"
            className="hidden flex-1 items-center justify-center gap-8 md:flex"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavigate}
                className={({ isActive }) => navClass(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <NavLink
            to="/patient"
            onClick={handleNavigate}
            className="hidden items-center gap-2 lg:flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hero text-sm font-medium text-primary">
              პ
            </span>
            <span className="text-sm font-medium text-ink">
              პაციენტი
            </span>
          </NavLink>

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
              <NavLink
                key={link.to}
                to={link.to}
                onClick={handleNavigate}
                className={({ isActive }) => `${navClass(isActive)} text-left`}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-24 sm:px-6 lg:pt-8">
        {children}
      </main>
    </div>
  );
}
