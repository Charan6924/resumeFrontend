# Sift

AI-powered resume screening platform. Recruiters search candidates using natural language queries instead of rigid filters.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Commands

- `npm run dev` - Start development server
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4
- **Fonts**: Inter (body) + Fraunces (display) via `next/font`
- **Icons**: Lucide React
- **Auth**: Firebase Authentication

## Architecture Conventions

This project follows the [Next.js LLM SOP v2.0](./Rules.md) conventions:

### Project Structure

- `app/` - Routing only (pages, layouts, loading states, error boundaries)
- `src/components/` - Reusable UI components
- `src/lib/` - Utilities and shared logic

### Rendering Strategy

- **Server Components by default** - Pages are Server Components that render client components
- **Leaf-node interactivity** - `'use client'` pushed to smallest interactive components
- **Suspense boundaries** - Components using `useSearchParams()` wrapped in `<Suspense>`
- **Loading states** - Every route has a `loading.tsx` for instant navigation feedback
- **Error boundaries** - Root-level `error.tsx` catches unhandled exceptions

### Navigation

- Uses Next.js `<Link>` components for client-side navigation with prefetching
- URL-based state for shareable/bookmarkable data (search queries, filters)

### Styling

- Tailwind CSS utility classes exclusively
- CSS imports contained to root `layout.tsx`
- CSS custom properties for theming (light/dark mode)
- Variable fonts via `next/font` for optimal performance

### State Management

- **URL state** - Search params for shareable state
- **Local state** - `useState` for ephemeral UI state
- **Context** - Auth and theme providers at root level

## Project Structure

```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Home page
├── loading.tsx         # Root loading state
├── error.tsx           # Error boundary
├── globals.css         # Global styles and CSS variables
├── login/
├── search/             # Suspense-wrapped search page
├── candidates/         # Suspense-wrapped candidates page
├── upload/
├── settings/
└── terms/

src/
├── components/
│   ├── navbar.tsx          # Navigation bar
│   ├── upload-page.tsx     # File upload interface
│   ├── search-page.tsx     # Search interface (URL state)
│   ├── candidates-table.tsx # Candidates list (URL state)
│   ├── settings-page.tsx   # Settings interface
│   ├── auth-guard.tsx      # Route protection
│   └── theme-provider.tsx  # Dark/light mode
└── lib/
    ├── auth-context.tsx    # Firebase auth context
    └── firebase.ts         # Firebase configuration
```
