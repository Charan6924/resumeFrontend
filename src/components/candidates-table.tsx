'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

interface Candidate {
  id: string;
  name: string;
  email: string;
  summary: string;
  resume_file_url: string;
  uploadedAt: Date;
}

type SortField = 'name' | 'uploadedAt';
type SortDirection = 'asc' | 'desc';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__|_/g, '')
    .replace(/#+\s/g, '')
    .replace(/\|/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

interface ParsedSummary {
  role: string;
  location: string;
  excerpt: string;
}

function parseSummary(raw: string, candidateName: string): ParsedSummary {
  let text = stripMarkdown(raw);

  // Remove the candidate name from the start
  if (text.startsWith(candidateName)) {
    text = text.slice(candidateName.length).trim();
  }

  // Remove email addresses
  text = text.replace(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g, '');
  // Remove phone numbers
  text = text.replace(/\+?[\d\s\-().]{10,}/g, '');
  // Remove leftover separators
  text = text.replace(/[·|,]\s*[·|,]/g, '·').replace(/^\s*[·|,\-–]\s*/gm, '').trim();
  text = text.replace(/\s{2,}/g, ' ').trim();

  // Extract location: pattern like "City, ST" or "City, State"
  const locationMatch = text.match(/([A-Z][a-zA-Z\s]+,\s*[A-Z]{2}(?:\s|$))/);
  const location = locationMatch ? locationMatch[1].trim() : '';
  if (location) text = text.replace(location, '').trim();

  // The role is likely the first sentence-like chunk before a location-type break
  // Heuristic: role = first 2-5 words that look like a title (before "–", "-", or known keywords)
  const roleMatch = text.match(/^([^.\n]{5,60}?)(?:\s*[–\-]\s|\s+(?:Email|Phone|Professional|Summary|I am|With \d)|$)/);
  const role = roleMatch ? roleMatch[1].replace(/^[\s·,]+|[\s·,]+$/g, '').trim() : '';
  if (role) text = text.slice(role.length).trim();

  // Clean up remaining text
  const excerpt = text.replace(/^[\s·,\-–]+/, '').replace(/\s{2,}/g, ' ').trim();

  return { role, location, excerpt };
}

export default function CandidatesTable() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null);

  const filter = searchParams.get('filter') || '';
  const sortField = (searchParams.get('sort') as SortField) || 'uploadedAt';
  const sortDirection = (searchParams.get('dir') as SortDirection) || 'desc';

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    async function fetchCandidates() {
      setLoading(true);
      setFetchError(null);
      try {
        const token = await user!.getIdToken();
        const res = await fetch('/api/candidates?limit=100', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`Failed to load candidates (${res.status})`);
        const json = await res.json();
        console.log('candidates response:', json);
        if (cancelled) return;
        const rows = Array.isArray(json) ? json : (json.data ?? []);
        const mapped: Candidate[] = rows.map((c: Record<string, unknown>) => ({
          id: c.id as string,
          name: (c.name as string) || 'Unknown',
          email: (c.email as string) || '',
          summary: (c.summary as string) || '',
          resume_file_url: (c.resume_file_url as string) || '',
          uploadedAt: new Date((c.created_at as string) || Date.now()),
        }));
        setCandidates(mapped);
      } catch (err) {
        if (!cancelled) setFetchError(err instanceof Error ? err.message : 'Failed to load');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchCandidates();
    const onFocus = () => fetchCandidates();
    window.addEventListener('focus', onFocus);
    return () => { cancelled = true; window.removeEventListener('focus', onFocus); };
  }, [user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Delete this candidate?')) return;
    try {
      const token = await user?.getIdToken();
      const res = await fetch(`/api/candidates/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    }
  };

  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/candidates?${params.toString()}`);
  };

  const setFilter = (value: string) => updateParams({ filter: value });
  const setSortField = (value: SortField) => updateParams({ sort: value });
  const setSortDirection = (value: SortDirection) => updateParams({ dir: value });

  const filteredAndSorted = useMemo(() => {
    const lowerFilter = filter.toLowerCase();

    const filtered = candidates.filter((candidate) => {
      if (!filter) return true;
      return (
        candidate.name.toLowerCase().includes(lowerFilter) ||
        candidate.email.toLowerCase().includes(lowerFilter) ||
        candidate.summary.toLowerCase().includes(lowerFilter)
      );
    });

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'uploadedAt') {
        comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [candidates, filter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--border-primary)] border-t-[var(--text-primary)] rounded-full animate-spin" />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-[var(--text-secondary)] mb-4">{fetchError}</p>
          <button onClick={() => window.location.reload()} className="text-[var(--text-primary)] font-medium hover:underline">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8 opacity-0 animate-fade-up">
          <div>
            <h1 className="font-display text-4xl text-[var(--text-primary)] mb-2 tracking-tight">
              Candidates
            </h1>
            <p className="text-[var(--text-tertiary)]">
              {filteredAndSorted.length} candidate{filteredAndSorted.length !== 1 ? 's' : ''}
              {filter && <span className="text-[var(--text-muted)]"> matching &ldquo;{filter}&rdquo;</span>}
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-xl text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-500 transition-all"
            />
          </div>
        </div>

        {filteredAndSorted.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-16 text-center opacity-0 animate-fade-up stagger-2">
            <p className="text-[var(--text-tertiary)] text-lg mb-4">No candidates match your search</p>
            <button
              onClick={() => setFilter('')}
              className="text-[var(--text-primary)] font-medium hover:underline"
            >
              Clear filter
            </button>
          </div>
        ) : (
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl overflow-hidden opacity-0 animate-fade-up stagger-2">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[var(--border-primary)]">
                    <th
                      className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      Candidate{renderSortIndicator('name')}
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Summary
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Resume
                    </th>
                    <th
                      className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                      onClick={() => handleSort('uploadedAt')}
                    >
                      Added{renderSortIndicator('uploadedAt')}
                    </th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-primary)]">
                  {filteredAndSorted.map((candidate) => (
                    <tr
                      key={candidate.id}
                      className="hover:bg-[var(--bg-tertiary)] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--text-secondary)] font-medium text-sm">
                            {getInitials(candidate.name)}
                          </div>
                          <div>
                            <span className="text-[var(--text-primary)] font-medium">
                              {candidate.name}
                            </span>
                            <div className="text-[var(--text-muted)] text-sm mt-0.5">
                              {candidate.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        className="px-6 py-5 max-w-sm cursor-pointer group"
                        onClick={(e) => { e.stopPropagation(); setExpandedSummary(candidate.id); }}
                      >
                        {(() => {
                          const { role, location, excerpt } = parseSummary(candidate.summary, candidate.name);
                          return (
                            <div className="space-y-1">
                              <div className="flex items-center flex-wrap gap-x-2 gap-y-1">
                                {role && (
                                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
                                    {role}
                                  </span>
                                )}
                                {location && (
                                  <span className="text-xs text-[var(--text-muted)]">{location}</span>
                                )}
                              </div>
                              {excerpt && (
                                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed group-hover:text-[var(--text-primary)] transition-colors">
                                  {excerpt}
                                </p>
                              )}
                              {!role && !excerpt && (
                                <span className="text-sm text-[var(--text-muted)]">—</span>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-6 py-5">
                        {candidate.resume_file_url && (
                          <a
                            href={candidate.resume_file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                          >
                            View
                          </a>
                        )}
                      </td>
                      <td className="px-6 py-5 text-[var(--text-muted)] text-sm">
                        {formatDate(candidate.uploadedAt)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button
                          onClick={(e) => handleDelete(candidate.id, e)}
                          className="text-xs text-[var(--text-muted)] hover:text-red-500 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {expandedSummary && (() => {
        const candidate = candidates.find(c => c.id === expandedSummary);
        if (!candidate) return null;
        const { role, location } = parseSummary(candidate.summary, candidate.name);
        const fullText = stripMarkdown(candidate.summary)
          .replace(/[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}/g, '')
          .replace(/\+?[\d\s\-().]{10,}/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim();
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={() => setExpandedSummary(null)}
          >
            <div
              className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-2xl p-6 max-w-lg w-full shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-[var(--text-primary)] font-semibold text-lg">{candidate.name}</h2>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    {role && (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-primary)]">
                        {role}
                      </span>
                    )}
                    {location && <span className="text-xs text-[var(--text-muted)]">{location}</span>}
                  </div>
                </div>
                <button
                  onClick={() => setExpandedSummary(null)}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors text-lg leading-none mt-0.5"
                >
                  ✕
                </button>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">
                {fullText}
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
