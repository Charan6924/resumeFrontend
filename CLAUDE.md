# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Frontend for an AI-powered resume screening platform. Recruiters search candidates using natural language queries instead of rigid filters. This is the Next.js frontend that handles resume uploads and candidate search.

## Commands

- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Production build
- `npm run lint` - Run ESLint

## Architecture

- **Framework**: Next.js 16 with App Router, React 19, TypeScript 5
- **Styling**: Tailwind CSS 4 with utility classes only
- **Icons**: Lucide React

### Structure

- `app/layout.tsx` - Root layout with Navbar
- `app/page.tsx` - Entry point rendering Home component
- `components/` - Client components (`'use client'` directive)

### Patterns

- useState for local state management
- Handler functions named `handleX` for events
- File validation before processing (5MB limit, PDF/DOC/DOCX only)
- Loading states with disabled buttons during async operations
- Error/success feedback with colored alert boxes

## Code Style

- TypeScript interfaces for component props
- Tailwind utility classes (no custom CSS)
- Dark theme using neutral color palette (neutral-950/900/800)
- Path alias: `@/*` points to project root
