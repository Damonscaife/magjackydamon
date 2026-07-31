# MagJacky

Production web application for MagJacky. This repository is the single source of truth for the site.

## Technology

- Next.js 16 with the App Router
- React 19
- TypeScript in strict mode
- Tailwind CSS 4
- ESLint and Prettier

## Project structure

```text
src/
  app/          Routes, layouts, metadata, and global styles
  components/   Reusable UI and layout components
  features/     Domain-focused application modules
  lib/          Shared utilities, integrations, and server-side helpers
  types/        Shared TypeScript types
public/         Static assets
```

Keep route files thin. Place reusable presentation in `components`, domain-specific code in `features`, shared infrastructure in `lib`, and cross-cutting types in `types`.

## Getting Started

Install dependencies and run the development server:

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

## Import aliases

Use `@/*` for imports rooted at `src`, for example `@/components/site-header`.
