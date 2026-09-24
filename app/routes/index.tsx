import { createFileRoute, Link } from '@tanstack/react-router'
import { getProductsFn } from '../server/functions/get-products'
import {
  ArrowRight,
  Database,
  Layers,
  ShieldCheck,
  Sparkles,
  Star,
  CheckCircle2,
} from 'lucide-react'

export const Route = createFileRoute('/')({
  loader: async () => {
    return await getProductsFn({
      data: {
        pageSize: 4,
        sortBy: 'featured',
      },
    })
  },
  component: HomePage,
})

function HomePage() {
  const { products } = Route.useLoaderData()

  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-line/60 bg-gradient-to-b from-card/30 via-background to-background pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(79,184,178,0.18),rgba(255,255,255,0))]" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary mb-8 shadow-xs">
            <Sparkles className="size-3.5" />
            <span>Next-Gen Static-First Architecture</span>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12]">
            Engineering-Grade Gear for High-Performance Living.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
            Ultra-responsive catalog built on{' '}
            <span className="font-semibold text-foreground">
              TanStack Start
            </span>
            , <span className="font-semibold text-foreground">React 19</span>,
            and{' '}
            <span className="font-semibold text-foreground">
              SQLite WAL Mode
            </span>{' '}
            with Drizzle ORM.
          </p>

          {/* Call to Actions - Redirecting to /products */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-sm text-primary-foreground shadow-sm transition hover:bg-primary/90 hover:shadow-md no-underline"
            >
              <span>Explore Products</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              to="/products"
              search={{ sortBy: 'featured', page: 1 }}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-card px-6 py-3 font-semibold text-sm text-foreground shadow-xs transition hover:border-primary/50 hover:bg-card/80 no-underline"
            >
              <span>Featured Drops</span>
            </Link>
          </div>

          {/* Trust Metrics */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-xs text-muted-foreground border-t border-line/40 pt-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Full-Document SSR</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Static Prerendered Routes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>Strict Server Boundaries</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>URL as Single Source of Truth</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
              Curated Selection
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Featured Highlights
            </h2>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline no-underline"
          >
            <span>View All Products</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <Link
              key={item.id}
              to="/products/$productId"
              params={{ productId: String(item.id) }}
              className="group flex flex-col rounded-xl border border-line bg-card overflow-hidden shadow-xs transition hover:border-primary/40 hover:shadow-lg no-underline"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-muted">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                />
                <span className="absolute top-2.5 left-2.5 rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-xs">
                  {item.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center gap-1 text-amber-500 text-xs mb-1">
                  <Star className="size-3.5 fill-current" />
                  <span className="font-semibold text-foreground">
                    {item.rating}
                  </span>
                </div>
                <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition">
                  {item.name}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-line/60">
                  <span className="font-bold text-base text-foreground">
                    ${item.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition">
                    View &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Architecture Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="rounded-2xl border border-line bg-card/60 p-8 sm:p-12">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Built on Modern Systems Architecture
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Designed with strict separation of server boundaries,
              deterministic local-first database access, and zero-fluff
              engineering principles.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-xl border border-line bg-background p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Database className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">
                SQLite WAL Concurrency
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Enabled{' '}
                <code className="text-xs">PRAGMA journal_mode = WAL;</code> for
                non-blocking concurrent reads and writes, achieving
                sub-millisecond local execution.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-background p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">
                Absolute Server Boundaries
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                All database drivers and queries run inside typed{' '}
                <code className="text-xs">createServerFn</code> RPCs,
                guaranteeing zero driver code leaks into client bundles.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-background p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                <Layers className="size-5" />
              </div>
              <h3 className="font-bold text-sm text-foreground">
                URL as Single Source of Truth
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Search queries, categories, price range, and pagination live
                strictly in URL query parameters, validated with strict Zod
                schemas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Redirect / CTA Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full text-center">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/90 to-primary px-8 py-12 text-primary-foreground shadow-lg">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Ready to Explore the Catalog?
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/80">
              Browse our full inventory with real-time filtering, instant
              category switching, and detailed specifications.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-lg bg-background px-6 py-3 font-semibold text-sm text-foreground shadow-sm transition hover:bg-background/90 no-underline"
              >
                <span>Go to Product Catalog</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
