'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/search', label: 'Search' },
  { href: '/candidates', label: 'Candidates' },
  { href: '/upload', label: 'Upload' },
  { href: '/settings', label: 'Settings' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          <a href="/" className="font-display text-xl text-[var(--text-primary)] tracking-tight">
            Sift
          </a>

          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
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
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
