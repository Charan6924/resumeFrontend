import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <p className="text-6xl font-display font-semibold text-[var(--text-muted)]">404</p>
      <h1 className="mt-4 text-xl font-medium text-[var(--text-primary)]">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--text-tertiary)]">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 px-5 py-2.5 text-sm font-medium rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] hover:bg-[var(--border-primary)] transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
