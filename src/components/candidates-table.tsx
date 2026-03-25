'use client';

import { useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface Candidate {
  id: string;
  name: string;
  email: string;
  experience: string;
  skills: string[];
  education: string;
  uploadedAt: Date;
}

type SortField = 'name' | 'experience' | 'uploadedAt';
type SortDirection = 'asc' | 'desc';

const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    experience: '5 years as Senior Software Engineer',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS'],
    education: 'MS Computer Science, Stanford',
    uploadedAt: new Date('2024-02-15'),
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    experience: '3 years as Data Scientist',
    skills: ['Python', 'TensorFlow', 'SQL', 'Pandas'],
    education: 'PhD Statistics, MIT',
    uploadedAt: new Date('2024-02-18'),
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.r@email.com',
    experience: '7 years as Product Manager',
    skills: ['Agile', 'Roadmapping', 'Analytics', 'SQL'],
    education: 'MBA, Harvard Business School',
    uploadedAt: new Date('2024-02-20'),
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    experience: '2 years as Frontend Developer',
    skills: ['Vue.js', 'JavaScript', 'CSS', 'Figma'],
    education: 'BS Software Engineering, UCLA',
    uploadedAt: new Date('2024-02-22'),
  },
  {
    id: '5',
    name: 'Priya Patel',
    email: 'priya.patel@email.com',
    experience: '4 years as ML Engineer',
    skills: ['PyTorch', 'Python', 'MLOps', 'Docker'],
    education: 'MS Machine Learning, CMU',
    uploadedAt: new Date('2024-02-24'),
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james.w@email.com',
    experience: '8 years as Engineering Manager',
    skills: ['Leadership', 'System Design', 'Java', 'Kubernetes'],
    education: 'BS Computer Science, Berkeley',
    uploadedAt: new Date('2024-02-25'),
  },
];

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

export default function CandidatesTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get('filter') || '';
  const sortField = (searchParams.get('sort') as SortField) || 'uploadedAt';
  const sortDirection = (searchParams.get('dir') as SortDirection) || 'desc';

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

    const filtered = mockCandidates.filter((candidate) => {
      if (!filter) return true;
      return (
        candidate.name.toLowerCase().includes(lowerFilter) ||
        candidate.skills.some((skill) => skill.toLowerCase().includes(lowerFilter))
      );
    });

    return filtered.sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'experience') {
        const aYears = parseInt(a.experience) || 0;
        const bYears = parseInt(b.experience) || 0;
        comparison = aYears - bYears;
      } else if (sortField === 'uploadedAt') {
        comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [filter, sortField, sortDirection]);

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
                    <th
                      className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                      onClick={() => handleSort('experience')}
                    >
                      Experience{renderSortIndicator('experience')}
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Skills
                    </th>
                    <th className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      Education
                    </th>
                    <th
                      className="text-left px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                      onClick={() => handleSort('uploadedAt')}
                    >
                      Added{renderSortIndicator('uploadedAt')}
                    </th>
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
                      <td className="px-6 py-5 text-[var(--text-secondary)]">
                        {candidate.experience}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1.5 max-w-xs">
                          {candidate.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-xs font-medium rounded-lg"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[var(--text-secondary)]">
                        {candidate.education}
                      </td>
                      <td className="px-6 py-5 text-[var(--text-muted)] text-sm">
                        {formatDate(candidate.uploadedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
