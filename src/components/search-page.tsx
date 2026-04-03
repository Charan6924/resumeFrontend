'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12 opacity-0 animate-fade-up">
          <h1 className="font-display text-5xl md:text-6xl text-[var(--text-primary)] mb-4 tracking-tight">
            Find your next<br />
            <span className="text-orange-500">great hire</span>
          </h1>
          <p className="text-[var(--text-tertiary)] text-lg max-w-md mx-auto">
            Describe what you&apos;re looking for in natural language
          </p>
        </div>

        <form onSubmit={handleSearch} className="opacity-0 animate-fade-up stagger-2">
          <div className={`
            relative bg-[var(--bg-secondary)] rounded-2xl border transition-all duration-300
            ${isFocused
              ? 'border-neutral-400 dark:border-neutral-500'
              : 'border-[var(--border-primary)]'
            }
          `}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your ideal candidate..."
              className="w-full px-6 py-5 bg-transparent text-[var(--text-primary)] text-lg placeholder-[var(--text-muted)] focus:outline-none rounded-2xl"
            />
          </div>

          <button
            type="submit"
            disabled={!query.trim()}
            className={`
              mt-4 w-full py-4 rounded-xl font-medium transition-all duration-200
              ${query.trim()
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed'
              }
            `}
          >
            Search
          </button>
        </form>

        <div className="mt-16 grid grid-cols-3 gap-8 opacity-0 animate-fade-up stagger-3">
          {[
            { value: '10K+', label: 'Resumes' },
            { value: '95%', label: 'Accuracy' },
            { value: '<2s', label: 'Search' },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="font-display text-3xl text-[var(--text-primary)] mb-1">{stat.value}</div>
              <div className="text-sm text-[var(--text-muted)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
