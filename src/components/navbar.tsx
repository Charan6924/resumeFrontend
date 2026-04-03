'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const navItems = [
  { href: '/search', label: 'Search' },
  { href: '/candidates', label: 'Candidates' },
  { href: '/upload', label: 'Upload' },
  { href: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) return null;

  return (
    <nav className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="font-display text-xl text-[var(--text-primary)] tracking-tight">
            Sift
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 text-sm font-medium rounded-lg transition-colors
                    ${isActive
                      ? 'text-[var(--text-primary)] bg-[var(--bg-tertiary)]'
                      : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }
                  `}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-[var(--border-primary)] px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`
                  px-4 py-2.5 text-sm font-medium rounded-lg transition-colors
                  ${isActive
                    ? 'text-[var(--text-primary)] bg-[var(--bg-tertiary)]'
                    : 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
