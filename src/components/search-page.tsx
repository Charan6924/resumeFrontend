'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchResult {
  candidate_id: string;
  name: string;
  email: string;
  summary: string;
  score: number;
  resume_file_url: string;
}

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const urlQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (!urlQuery) {
      setResults(null);
      return;
    }
    let cancelled = false;
    async function runSearch() {
      setSearching(true);
      setSearchError(null);
      try {
        const { auth } = await import('@/lib/firebase');
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ query: urlQuery, top_k: 10, rerank: true }),
        });
        if (!res.ok) throw new Error(`Search failed (${res.status})`);
        const data = await res.json();
        if (!cancelled) setResults(data);
      } catch (err) {
        if (!cancelled) setSearchError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        if (!cancelled) setSearching(false);
      }
    }
    runSearch();
    return () => { cancelled = true; };
  }, [urlQuery]);

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

        {!urlQuery && (
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
        )}

        {urlQuery && (
          <div className="mt-8">
            {searching && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-[var(--border-primary)] border-t-[var(--text-primary)] rounded-full animate-spin" />
              </div>
            )}

            {searchError && (
              <div className="p-4 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-secondary)] text-sm">
                {searchError}
              </div>
            )}

            {results && results.length === 0 && !searching && (
              <div className="text-center py-12 text-[var(--text-tertiary)]">
                No candidates match your search
              </div>
            )}

            {results && results.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm text-[var(--text-muted)] mb-4">{results.length} result{results.length !== 1 ? 's' : ''}</p>
                {results.map((r) => (
                  <div
                    key={r.candidate_id}
                    className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-5 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[var(--text-primary)] font-medium">{r.name}</p>
                        <p className="text-[var(--text-muted)] text-sm mt-0.5">{r.email}</p>
                        {r.summary && (
                          <p className="text-[var(--text-secondary)] text-sm mt-2 leading-relaxed">{r.summary}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs font-medium text-[var(--text-muted)] bg-[var(--bg-tertiary)] px-2 py-1 rounded-lg">
                          {Math.round(r.score * 100)}%
                        </span>
                        {r.resume_file_url && (
                          <a
                            href={r.resume_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            View resume
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
