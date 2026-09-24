# TASK: Build a Static-First TanStack Start E-Commerce Application with SQLite

Build a production-grade, fullstack e-commerce catalog application using TanStack Start, TanStack Router with file-based routing, SQLite, Drizzle ORM, Tailwind CSS, and Zod.

---

## 1. Technical Stack & Core Requirements

- **Framework**: TanStack Start (powered by Vinxi/Nitro and TanStack Router).
- **Language**: TypeScript (strict mode, zero `any`).
- **Database & ORM**: SQLite (`better-sqlite3` or `@libsql/client`) managed via Drizzle ORM.
- **Routing**: File-based routes inside `app/routes/`.
- **Validation**: Zod for search params, server function inputs, and schema assertions.
- **Rendering & SSR**:
  - Full-document SSR via `createRootRoute` in `app/routes/__root.tsx`.
  - Static prerendering enabled for the catalog and product detail routes.
  - React Suspense boundaries for streaming hydration.
- **Server Boundaries**: All SQLite queries must execute inside typed server functions created via `createServerFn`. Direct database imports into client components or route presentation logic are strictly prohibited.

---

## 2. Target File Structure

```text
├── app/
│   ├── client.tsx               # Client hydration entry
│   ├── ssr.tsx                  # Server entry handler
│   ├── router.tsx               # Router factory
│   ├── routes/
│   │   ├── __root.tsx           # Document shell (Html, Head, Body, Outlet, Scripts)
│   │   ├── index.tsx            # Hero landing redirecting to /products
│   │   ├── products/
│   │   │   ├── index.tsx        # Product catalog (search params, filters, grid)
│   │   │   └── $productId.tsx   # Static product detail view
│   ├── server/
│   │   ├── db/
│   │   │   ├── client.ts        # SQLite connection singleton (WAL mode enabled)
│   │   │   └── schema.ts        # Drizzle schema (products table)
│   │   ├── functions/
│   │   │   ├── get-products.ts  # Typed server function with search/filter validation
│   │   │   └── get-product.ts   # Typed server function for single product lookup
│   │   └── seed.ts              # Idempotent SQLite seeding script
│   └── styles/
│       └── app.css              # Tailwind CSS styles
├── drizzle/                     # Migration files
├── drizzle.config.ts
├── app.config.ts                # TanStack Start / Vinxi config
├── package.json
└── tsconfig.json
```
