import { useState, type ReactNode } from 'react';

interface PageLayoutProps {
  children: ReactNode;
}

const NAV_LINKS = [
  { label: 'ექიმები', active: true },
  { label: 'ჩემი ვიზიტები', active: false },
  { label: 'პაციენტის ბარათი', active: false },
];

/*
  გვერდის განლაგება — ყველა ეკრანს ერგება:
  - მობილური (< 768px): ლოგო + მენიუს ღილაკი, მენიუ იხსნება ქვემოთ
  - ტაბლეტი (md, ≥ 768px): ლოგო + ნავიგაცია
  - კომპიუტერი (lg, ≥ 1024px): ლოგო + ნავიგაცია + მომხმარებელი
*/
export default function PageLayout({ children }: PageLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-page">
      <header className="border-b border-line bg-white">
        <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xl font-bold leading-none text-white">
              +
            </span>
            <span className="text-base font-bold text-ink">MediCare</span>
          </a>

          <nav aria-label="მთავარი ნავიგაცია" className="hidden flex-1 items-center justify-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`text-sm font-medium ${link.active ? 'text-primary' : 'text-ink hover:text-primary'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-hero text-sm font-medium text-primary">
              პ
            </span>
            <span className="text-sm font-medium text-ink">პაციენტი</span>
          </div>

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
          <nav aria-label="მობილური ნავიგაცია" className="flex flex-col gap-3 border-t border-line px-4 py-3 md:hidden">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href="#"
                className={`text-sm font-medium ${link.active ? 'text-primary' : 'text-ink'}`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
    </div>
  );
}
