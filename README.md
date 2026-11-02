# Devi Vasantha Constructions (DVC)

Mobile-first construction project management for Devi Vasantha Constructions Pvt. Ltd.

This repository is a **greenfield scaffold** (foundations only). It is not a complete ERP.

## Stack

| Layer | Choice |
| --- | --- |
| Mobile | Expo (React Native) + TypeScript |
| API | Node.js + TypeScript + Fastify |
| DB | PostgreSQL + Prisma migrations |
| Monorepo | pnpm workspaces (`apps/api`, `apps/mobile`, `packages/shared`) |

## What this scaffold includes

- Prisma schema + migration for core PRD tables (users, projects, assignments, vendors, expenses, payments, allocations, activities, photos, approvals, audit, …)
- Secure auth skeleton (bcrypt hashes, JWT). **Role comes from the backend** — no client role picker
- Server-side RBAC + project-scoped access middleware stubs
- Design tokens (deep navy / teal palette) and shared **INR** + **DD MMM YYYY** formatters
- Role-aware navigation shells: Director, Project Manager, Site Supervisor, Customer
- Add Expense screen structured for the PRD fast path (Material / Labour)

## Intentionally deferred

Full expense persistence, payment allocation UI, approvals engine, live dashboards/charts, reports, OCR, push notifications, object storage, and offline sync queue. See Project Context `docs/implementation-plan.md`.

## Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16+ (local)

## Local setup

### 1. Install

```bash
pnpm install
```

### 2. Database

Create a database and user (example):

```bash
sudo -u postgres psql -c "CREATE USER dvc WITH PASSWORD 'dvc_dev' SUPERUSER;"
sudo -u postgres psql -c "CREATE DATABASE dvc OWNER dvc;"
```

Copy env and migrate:

```bash
cp apps/api/.env.example apps/api/.env
pnpm db:generate
pnpm --filter @dvc/api exec prisma migrate dev --name init
pnpm db:seed
```

### 3. Run API

```bash
pnpm dev:api
# http://localhost:3001/health
```

Demo users (password `ChangeMe123!`):

- `director@dvc.local`
- `pm@dvc.local`
- `supervisor@dvc.local`
- `customer@dvc.local`

### 4. Run mobile

```bash
pnpm dev:mobile
```

On a physical device, point the API at your machine:

```bash
EXPO_PUBLIC_API_URL=http://<your-lan-ip>:3001 pnpm dev:mobile
```

## Branding

No permanent company logo is inventored here. The app uses **text branding** (“Devi Vasantha Constructions”) on splash/login.

## Security notes

- Never store plaintext passwords
- Enforce role and project access on the API — do not rely on hiding UI controls
- Invoices/expenses and payments are separate tables; allocations link them
- Keep this app isolated from any school application data
