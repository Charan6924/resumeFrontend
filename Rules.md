# Next.js Project Generation: LLM Standard Operating Procedure (SOP) v2.2

This document outlines the strict sequential process and architectural guidelines an LLM must follow when scaffolding, structuring, or generating code for a Next.js project. 

## Phase 1: Project Architecture & Folder Structure
1. **Separation of Concerns:** Keep the `app/` directory strictly for routing purposes (route definitions, layouts, loading, and error states). 
2. **Root Application Code:** Store all core application logic, UI components, libraries, and utilities in shared folders at the root of the project (e.g., `src/components`, `src/lib`, `src/hooks`).
3. **Standard Configurations:** Assume `npx create-next-app@latest` defaults: TypeScript, ESLint, App Router, and `@/*` import aliases.

## Phase 2: Routing & Navigation
1. **Dynamic Route Optimization:** Always add a `loading.tsx` file to dynamic routes. This enables partial prefetching, triggers immediate navigation feedback, and displays a temporary UI while the route renders server-side.
2. **Contextual Prefetching Strategy:**
   - **Large Applications:** Configure Next.js `<Link>` components to prefetch *only* on hover (`prefetch={false}`) to save bandwidth and reduce unnecessary background requests.
   - **Small/Medium Applications:** Use the default regular prefetching.
3. **Error Handling:** Implement strict error boundaries (`error.tsx`) at appropriate route segments to catch and isolate uncaught exceptions without breaking the entire application.
4. **Parallel Routes & Intercepting Routes:** Use Parallel Routes (`@slot` folders) when a layout must render multiple independent pages simultaneously — e.g., dashboards with separately loading panels, or split-view UIs. Use Intercepting Routes (the `(.)`, `(..)`, `(...)` conventions) to render a route in an overlay or modal context while preserving the underlying page's URL and state. A common and correct pattern is combining both to implement URL-driven modals (e.g., `/photos/[id]` intercepted to show a modal while the feed remains visible beneath it).

## Phase 3: Component Rendering & Suspense
1. **Leaf-Node Interactivity:** Treat all components as Server Components by default. Push the `'use client'` directive as far down the component tree as possible. Only apply it to specific, small interactive components rather than marking large chunks of the UI as Client Components.
2. **Streaming & Suspense:** Actively wrap slow-loading, data-dependent components in React `<Suspense>` boundaries with a designated fallback UI to progressively stream the page to the user.

## Phase 4: Data Fetching & Caching
1. **Parallel Fetching:** When a route requires multiple independent data sources, initiate the requests concurrently (e.g., using `Promise.all()`) rather than awaiting them sequentially.
2. **Multi-Level Caching:** Implement a rigorous caching strategy at both the **Data Level** (using `fetch` cache options like `force-cache` or `next.revalidate`) and the **UI Level** (leveraging Next.js Full Route Cache and Router Cache) to maximize efficiency.
3. **Cache Invalidation After Mutations:** After any Server Action that mutates data, always call `revalidatePath(path)` or `revalidateTag(tag)` to purge stale cached data. Failing to do so will cause the UI to display outdated content even after a successful mutation. Prefer `revalidateTag` for granular, targeted invalidation; use `revalidatePath` when the entire route's data should be considered stale.

## Phase 5: Styling, CSS, & Asset Optimization
1. **CSS Import Isolation:** Contain CSS imports to a single JavaScript/TypeScript entry file. Import global styles and Tailwind stylesheets exclusively at the root of the application (e.g., in the root `layout.tsx`). Note: With **Tailwind v4**, global CSS is managed via a single `@import "tailwindcss"` directive in your CSS entry file rather than the legacy `tailwind.config.js` + `@tailwind` directives pattern. The `@import` cascade still matters for non-Tailwind styles, but Tailwind itself no longer requires ordering vigilance in the same way.
2. **Styling Hierarchy:**
   - Use **Tailwind CSS** for the vast majority of styling needs, utilizing its utility classes for common design patterns.
   - Use **CSS Modules** (`<name>.module.css` instead of `<name>.tsx`) only for highly specific, complex component styles where Tailwind utilities fall short.
   - Extract shared/repeating styles into shared UI components to avoid duplicate code.
3. **CSS Tooling Rules:**
   - Disable linters or formatters (like ESLint's `sort-imports`) that auto-sort CSS imports, as CSS import order dictates rendering priority for non-Tailwind stylesheets.
   - Utilize the `cssChunking` option in `next.config.js` to gain granular control over how CSS files are chunked and delivered.
4. **Font Optimization:** Exclusively use **variable fonts** via `next/font` for optimal performance, reduced network payloads, and maximum design flexibility.
5. **Image Optimization:** Always use `next/image` instead of raw `<img>` tags. Enforce the following rules on every usage:
   - Always provide `width` and `height` attributes (or use `fill` with a positioned parent) to prevent Cumulative Layout Shift (CLS).
   - Add the `priority` prop to any image that is above the fold or part of the Largest Contentful Paint (LCP) element to disable lazy loading and trigger an early fetch.
   - Use the `sizes` prop when images are displayed at varying widths across breakpoints to ensure the browser fetches the smallest adequate variant.

## Phase 6: State Management Strategy
1. **URL State as Default:** Prioritize using URL Search Parameters (`?query=val`) for state that needs to be shareable, bookmarkable, or accessible on the server (e.g., pagination, search queries, active tabs).
2. **Server State:** Rely on Next.js native `fetch` caching and Server Components for reading data. Do not duplicate server data into client-side stores.
3. **Client State Hierarchy:**
   - **Local State:** Use `useState` for highly localized, ephemeral UI state (e.g., dropdown open/closed).
   - **Global UI State:** Prefer **Zustand or Jotai** over native React Context for broader client state (e.g., themes, complex multistep forms). React Context re-renders all consumers on every state change and does not scale well — use it only for truly static or rarely-changing values (e.g., a theme string or locale). Push all providers as far down the component tree as possible to limit re-render scope regardless of which solution is chosen.

## Phase 7: Data Mutations & API Conventions
1. **Server Actions First:** Default to using Server Actions (`'use server'`) for data mutations, form submissions, and database updates. Place these in a dedicated `src/actions/` directory or co-locate them with the components they serve.
2. **Route Handlers (`route.ts`):** Restrict the use of traditional API endpoints (`app/api/.../route.ts`) to specific use cases:
   - External webhooks (e.g., Stripe, Clerk).
   - Public-facing REST APIs for third-party consumption.
   - Dynamic asset generation (e.g., generating sitemaps, RSS feeds, or OG images).
3. **Optimistic Updates:** When implementing Server Actions that mutate UI data, use `useOptimistic` paired with `useTransition` — the two are effectively mandatory together. Wrap the Server Action call inside `startTransition` from `useTransition` to mark it as a non-blocking transition, then use `useOptimistic` within that transition to apply the immediate visual update while the server request processes in the background.
4. **Server Action Loading & Error States:** Always handle pending and error states explicitly for Server Actions:
   - Use the `useFormStatus` hook inside form-based interactions to read the `pending` boolean and disable inputs or show a loading indicator while the action is in-flight.
   - Return structured error objects from actions (e.g., `{ error: string } | { data: T }`) rather than throwing. Throwing inside a Server Action will bubble to the nearest `error.tsx` boundary, which is the wrong UX for expected validation or business logic failures.

## Phase 8: Security
1. **Server-Side Authorization in Every Action:** Never trust IDs, roles, or ownership data passed from the client. Every Server Action and Route Handler must independently verify the current session and re-fetch the relevant resource server-side to confirm the authenticated user has permission to perform the operation. Passing a resource ID from the client is a hint, not a proof of ownership — treat it accordingly.
2. **No Sensitive Logic in Client Components:** Never place secrets, authorization checks, or business-critical logic inside Client Components. Anything in a Client Component is shipped to the browser. Keep validation, permission checks, and sensitive computations exclusively in Server Components, Server Actions, or Route Handlers.
