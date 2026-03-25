import { Suspense } from 'react';
import CandidatesTable from '@/components/candidates-table';

function CandidatesFallback() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[var(--border-primary)] border-t-[var(--text-primary)] rounded-full animate-spin" />
    </div>
  );
}

export default function CandidatesPage() {
  return (
    <Suspense fallback={<CandidatesFallback />}>
      <CandidatesTable />
    </Suspense>
  );
}
