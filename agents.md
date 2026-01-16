# AGENTS.MD

## 1. Project Overview
**IVV-PMIS** is a specialized Project Management Information System (PMIS) for construction and engineering IV&V (Independent Verification and Validation).
- **Core Functionality**: Workspaces, Projects, Tasks (Kanban/Calendar/Table views), Members management.
- **Frontend**: Next.js 14 (App Router) + TypeScript.
- **Backend**: Appwrite (Database, Auth, Storage) via Hono API Gateway.
- **Styling**: Tailwind CSS + Shadcn UI (Custom "Warm Atelier" Design System).

## 2. Technology Stack & Key Libraries
| Category | Technology | Usage/Notes |
| :--- | :--- | :--- |
| **Framework** | Next.js 14 | App Router, Server Components (RSC) where possible. |
| **Language** | TypeScript | Strict verification enabled. `any` is forbidden. |
| **API** | Hono | Used as an API Gateway/Proxy for Appwrite. |
| **Backend/DB** | Appwrite | `node-appwrite` for server-side logic. |
| **State** | Tanstack Query | `QueryProvider` wraps the app. Handles all async data including auth. |
| **URL State** | Nuqs | URL search params management (filters, view modes). |
| **Styling** | Tailwind CSS | Utility-first. See `globals.css` for custom variables. |
| **UI Components**| Shadcn UI | Located in `src/components/ui`. |
| **Forms** | React Hook Form | Zod for validation. |
| **Dates** | date-fns | Date manipulation. |
| **i18n** | next-intl | Localization (zh-TW default). |

## 3. Architecture & Directory Structure
The project follows a **Feature-Based Architecture**.

### `src/features/` (Domain Logic)
Each folder contains `components`, `hooks`, `server`, `schemas`, etc.
- **auth/**: Login, Register, Session management.
- **workspaces/**: Workspace CRUD and switching.
- **projects/**: Project CRUD.
- **tasks/**: The comprehensive task system. Includes Kanban board, Calendar, and Table views.
- **members/**: Role-based access control and member management.

### `src/app/` (Routing)
- **(auth)/**: Authenticated layouts/pages (Sign-in/Sign-up).
- **(dashboard)/**: Main protected interface with Sidebar and Navbar.
- **(standalone)/**: Pages without the main dashboard layout (e.g., individual form pages).
- **api/**: Hono API routes (`[[...route]]/route.ts`).

### `src/lib/` (Core Utilities)
- **appwrite.ts**: Appwrite client initialization (`createSessionClient`, `createAdminClient`).
- **hono.ts**: Hono RPC client instance.
- **session-middleware.ts**: Hono middleware for session validation.
- **utils.ts**: `cn` helper and other shared logic.

## 4. Key Conventions & Rules
1.  **Strict Mode**: No `any`. Fix types properly.
2.  **Design System**:
    - Use variables from `globals.css` (e.g., `--bg-base`, `--text-primary`).
    - **"Warm Atelier" Theme**: Avoid pure black (#000) or white (#fff). Use the defined HSL/Hex variables.
    - Components should be "Straight Edge" (rounded-none) where appropriate for the industrial aesthetic.
3.  **Data Fetching**:
    - **Server Actions**: Used significantly for mutations.
    - **React Query**: Used for fetching data in client components.
4.  **Mutations**:
    - Always invalidate relevant queries after a successful mutation.
5.  **Internationalization**:
    - All user-facing text must be wrapped in `t()` from `useTranslations`.

## 5. Environment & Config
- **Env Vars**: Managed via `.env.local` (Appwrite Endpoint, Project ID, Secret Keys).
- **Site Config**: `src/config/` (Constants and site-wide settings).

---
*This file is optimized for AI agents to grasp the context immediately. Read this first before making structural changes.*
