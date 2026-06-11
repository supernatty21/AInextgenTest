# nextjs-wha-app-starter

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2.7 (App Router) |
| UI | React 19.2.7, shadcn/ui (Radix Luma style, Remixicon icons) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`) |
| DB | MariaDB via Prisma v7 (driver adapter pattern) |
| Auth | better-auth (email+password, Prisma adapter) |
| State | zustand with localStorage persist (cart) |
| Forms | react-hook-form + zod |
| Lang | Thai (UI), TypeScript 5 |

## Commands

```sh
npm run dev      # next dev
npm run build    # next build (run `npx prisma generate` first)
npm run lint     # eslint (flat config, ESLint v9)
npm run start    # next start
```

No test suite configured.

## Project structure

```
src/
  app/
    (front)/     # public pages — own <html> layout (Navbar)
      about/
      cart/
      course/    # loading.tsx + error.tsx boundaries, external API fetch
      product/   # Prisma DB query (dynamic via connection())
      page.tsx   # Hero
    (auth)/      # login/signup — separate <html> layout (Prompt font)
      login/
      signup/
    api/auth/    # better-auth API route [...all]/route.ts
    globals.css  # Tailwind v4 + shadcn import
  components/    # shared components (navbar, hero, ui/*)
  lib/           # auth, prisma client, cart-store, utils
prisma/
  schema.prisma
generated/prisma # Prisma client output (.gitignore'd)
```

Two route groups each define their own `<html>` — both import `globals.css`.

## Prisma v7 quirks

- **Generator**: `prisma-client` (NOT `prisma-client-js`)
- **Output**: `../generated/prisma` — import from `../../generated/prisma/client`
- **Config**: `prisma.config.ts` (new in v7), not `prisma/schema.prisma` alone
- **Adapter**: MariaDB driver adapter (`@prisma/adapter-mariadb`) — pass `DATABASE_URL` to adapter, not `PrismaClient` directly
- **Generate**: run `npx prisma generate` before every `next build`
- **Env**: `dotenv/config` loaded manually in both `prisma.config.ts` and `src/lib/prisma.ts`
- **Client**: singleton pattern in `src/lib/prisma.ts`

## Auth

- better-auth with `prismaAdapter` + MySQL provider
- `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` in `.env`
- API route: `src/app/api/auth/[...all]/route.ts`
- Client: `createAuthClient()` in `src/lib/auth-client.ts`
- Server: `auth.api.getSession()` with `headers()` in server components

## Styling

- Tailwind v4: `@import "tailwindcss"` in CSS (no `tailwind.config.ts`)
- CSS source: `src/app/globals.css` — also imports `tw-animate-css` and `shadcn/tailwind.css`
- PostCSS plugin: `@tailwindcss/postcss`
- shadcn components in `src/components/ui/` — `components.json` uses Radix Luma style

## Cart

- zustand store persisted to `localStorage` under key `skill-cart`
- Types: `CartItem { productId, name, price, qty }`
- Store: `src/lib/cart-store.ts`

## Important gotchas

- `next.config.ts` enables `cacheComponents: true` (Next.js 16 feature) and configures `images.remotePatterns` for `www.fffuel.co` and `api.codingthailand.com`
- `eslint.config.mjs` uses flat config (ESLint v9) with `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- Dynamic pages (`product/page.tsx`, `course/page.tsx`) call `await connection()` to signal dynamic rendering
- `course/page.tsx` fetches from `https://api.codingthailand.com/api/course` with `next: { revalidate: 3600 }`
- `.env` is in `.gitignore` — copy from `.env.example` for local dev (contains DB creds + auth secrets)
- `generated/prisma/` is `.gitignore`'d — regenerate after schema changes
- No test files or test deps exist anywhere
- `@/*` path alias maps to `./src/*`

## Docker

Multi-stage build (see `Dockerfile`):
1. `npm ci` deps (node:24-alpine)
2. `npx prisma generate` + `npm run build`
3. Runs standalone server with `generated/` and `prisma/` copied (non-root user)

## Rules
- seperate the Typescript file to the folder src/types
- Setting file name of Typescript (.ts) should be the example course-services.ts. (services is folder name)
- do not use command npx prisma db push