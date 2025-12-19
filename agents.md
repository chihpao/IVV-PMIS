# AGENTS.md 

## TL;DR
This is a Next.js 14 full-stack Jira clone using Appwrite.
Main domain logic lives under `features/` and shared libs under `lib/`.

## Project map
- `features/` : domain modules (auth, members, projects, tasks, workspaces)
- `lib/`      : appwrite/hono/oauth/session middleware utilities
- `components/` : shared UI components (shadcn + custom)
- `config/`   : db/index config
- `app/`      : Next.js routes (App Router)

## Rules
- Make minimal, targeted changes. Prefer small PR-sized diffs.
- Do NOT refactor unrelated code.
- If you touch auth/login/oauth, explain the user-facing impact.
- Keep types strict; no `any` unless necessary with a comment.

## Verification
- Install deps with the project's package manager (check `package.json` / lockfile).
- After changes, run:
  - `lint`
  - `typecheck` (if exists)
  - minimal reproduction steps for the feature
- If you add env vars, update `.env.example` and mention them.

## Common tasks
- Auth / OAuth related code often touches:
  - `features/auth/**`
  - `lib/oauth.ts`, `lib/appwrite.ts`, `lib/session-middleware.ts`
