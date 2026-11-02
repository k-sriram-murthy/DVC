# DVC Construction Project Management — Implementation Plan

**Product:** Devi Vasantha Constructions (DVC) mobile-first project management app  
**Repo:** https://github.com/k-sriram-murthy/DVC  
**PRD:** `docs/prd-v1.md`  
**Mockups:** `docs/mockups/screen-mockups-reference.png` (visual guide only — not pixel-perfect)  
**Status:** Greenfield scaffold (Phase 0 / Phase 1 foundations)

---

## 1. Inspection outcome

| Check | Result |
| --- | --- |
| Repository contents | Empty / greenfield (no prior app code to preserve) |
| School-app isolation | Confirmed — DVC is a standalone repo and database |
| Existing stack | None — stack chosen below |
| Logo | None supplied — use text branding only (no invented permanent logo) |

---

## 2. Stack choice

| Layer | Choice | Rationale |
| --- | --- | --- |
| Mobile | **Expo (React Native) + TypeScript** | Fast Android/iOS setup, camera/upload APIs, single TS codebase, good for small-team maintenance |
| API | **Node.js + TypeScript + Fastify** | Typed REST, low boilerplate, strong plugin ecosystem, easy RBAC middleware |
| ORM / migrations | **Prisma** | Clear schema ↔ PRD mapping, migration history, type-safe queries |
| Database | **PostgreSQL** | Relational integrity for invoices/payments/allocations; decimal money types |
| Monorepo | **pnpm workspaces** | Shared types/utils/tokens without publishing packages |
| Auth | **JWT access + refresh tokens; bcrypt password hashes** | Role comes from the server; no client role picker |
| Local files | Local protected uploads dir (Phase 1); object storage later | Avoid public web-dir exposure |

**Not chosen:** PHP/MariaDB (no existing PHP stack to preserve); full ERP frameworks; client-side role selection.

---

## 3. Architecture

```
apps/
  mobile/          Expo RN app (role-aware navigation shells)
  api/             Fastify REST API + Prisma + RBAC middleware
packages/
  shared/          Types, INR/date formatters, design tokens, validation enums
```

### Request flow

1. Mobile → `Authorization: Bearer <accessToken>`
2. API `authenticate` plugin loads user + role from JWT
3. `requireRole(...)` / `assertProjectAccess(projectId)` enforce server-side RBAC and project scope
4. Handlers return authoritative totals (never trust client-calculated money)
5. Sensitive mutations write `audit_logs`

### Design tokens (PRD palette)

- Deep navy (nav / headings)
- White / warm off-white surfaces
- Teal (secondary actions)
- Green / amber / red (status — never colour alone)
- Light grey (dividers / secondary text)

Tokens live in `packages/shared` and are imported by the mobile theme.

### Locale helpers (shared)

- Currency: Indian grouping (`₹1,24,500`, L / Cr helpers)
- Dates: `DD MMM YYYY`

### Financial model invariant (from day one)

- **Invoices/expenses** and **payments** are separate tables
- **Payment allocations** link payments ↔ expenses (partial pays, multi-invoice pays, advances)
- UI for full allocation workflows may be Phase 2; schema ships in Phase 1

---

## 4. Phase breakdown

### Phase 0 — Foundations (this PR)

- Monorepo + README (how to run)
- Prisma schema + initial migration for core PRD tables
- Auth skeleton (register/login/me, bcrypt, JWT) — **role from backend**
- RBAC + project-scoped access middleware stubs
- Design tokens + shared INR / date utils
- Mobile splash + login + role-aware navigation shells (Director / PM / Site Supervisor / Customer)
- Placeholder home screens per role (no fake ERP breadth)
- Expense entry screen **structure** for the PRD fast path (Material / Labour tabs, project/vendor/amount/invoice/photo hooks)

### Phase 1 — Auth, users, projects (ship next)

- Director user management (create users, assign roles)
- Projects CRUD + assignments (PM / Site Supervisor / Customer)
- Soft archive; project list filters (Active / On Hold / Completed)
- Seed script with demo Director account (dev only)

**Phase 1 ships:** runnable API + mobile shells, real schema, secure auth, project assignment APIs, structured expense form UI wired to draft/submit stubs.

### Phase 2 — Expense workflow (core product)

- Vendors CRUD
- Expense create (fast path), drafts, submit, list, detail
- Invoice photo upload (local private storage)
- Separate payment recording + allocations
- Duplicate-detection warnings (not hard rejects)
- Authoritative outstanding / paid totals from allocations

### Phase 3 — Approvals

- Configurable simple approval policy (SS → optional PM → Director)
- Approval queue UI; reject requires reason
- No self-approval; audit every decision
- Notifications for submit / approve / reject

### Phase 4 — Dashboards & progress

- Director / PM / SS / Customer dashboards with **live** aggregates
- Activities + weighted progress updates (history retained)
- Site photos with Internal / Customer Visible
- Budget categories + project budget versions (no silent overwrite)

### Phase 5 — Reports & hardening

- Project / vendor / payment / outstanding / progress reports
- CSV export (PDF where practical)
- Rate limiting, upload hardening, backup docs
- Offline reliability: preserve form state, retry, no double-submit (finish PRD §15 when available)

---

## 5. What Phase 1 intentionally defers

| Deferred | Why |
| --- | --- |
| Full payment allocation UI | Schema present; UX is Phase 2 |
| Vendor advances UX | Schema stub; avoid fake accounting |
| Live dashboard charts | Need real expense data first |
| Approvals engine | Needs expense submit path |
| Reports / CSV | Depends on financial data |
| Push / SMS / WhatsApp | Explicitly out of initial scope |
| OCR for invoices | Optional later; not required |
| Object storage / production deploy | Local uploads first |
| Offline sync queue | Clear errors + draft preserve first |
| Pixel-perfect mockup clone | Mockups are a design guide only |

---

## 6. Risks and issues

1. **GitHub access for this agent run** — repo may be private; agent needs credentials or linked environment to push/PR.
2. **Partial PRD** — §15+ (offline) truncated; do not invent offline sync beyond stated minimum.
3. **Money correctness** — floating point forbidden; use `Decimal` / fixed precision; server owns totals.
4. **IDOR** — project-scoped checks on every resource path from day one (stubs → real queries).
5. **Role picker in mockups** — visual only; implementing it as auth would be a security bug.
6. **Scope creep into ERP** — prefer solid expense fast-path over breadth.
7. **File privacy** — never serve uploads from a public static directory without auth.

---

## 7. Acceptance criteria for the scaffold PR

- [x] Implementation plan in Project store `docs/implementation-plan.md`
- [ ] Empty-repo confirmation documented
- [ ] pnpm monorepo: `apps/api`, `apps/mobile`, `packages/shared`
- [ ] Prisma migration covering core tables (users, projects, assignments, vendors, expenses, payments, allocations, activities, photos, approvals, audit, …)
- [ ] Auth with hashed passwords; `/me` returns role from server
- [ ] API middleware stubs for RBAC + project access
- [ ] Mobile role-aware nav shells + expense fast-path form skeleton
- [ ] README with local run instructions
- [ ] Branch + PR against `main`

---

## 8. How to run (summary)

See repository `README.md` after scaffold lands. Typical flow:

```bash
pnpm install
# configure apps/api/.env (DATABASE_URL, JWT secrets)
pnpm --filter @dvc/api db:migrate
pnpm --filter @dvc/api db:seed   # optional
pnpm --filter @dvc/api dev
pnpm --filter @dvc/mobile start  # Expo
```
