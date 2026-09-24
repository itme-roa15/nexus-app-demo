import {
  HeadContent,
  Link,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Suspense, useState, useEffect } from 'react'
import {
  ShoppingBag,
  Search,
  Sparkles,
  Layers,
  ShieldCheck,
  Heart,
} from 'lucide-react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import appCss from '../styles/app.css?url'
import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'NEXUS | High-Performance Gear Catalog',
      },
      {
        name: 'description',
        content:
          'Ultra-fast static-first e-commerce catalog powered by TanStack Start, React 19, SQLite WAL mode, and Drizzle ORM.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  shellComponent: RootDocument,
})

function NavigationBar() {
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nexus_cart_count')
      if (saved) setCartCount(Number(saved))
    } catch {
      // ignore
    }

    const handler = () => {
      try {
        const saved = localStorage.getItem('nexus_cart_count')
        if (saved) setCartCount(Number(saved))
      } catch {
        // ignore
      }
    }
    window.addEventListener('nexus_cart_updated', handler)
    return () => window.removeEventListener('nexus_cart_updated', handler)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-line bg-surface-strong/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-xl no-underline"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="size-4.5" />
            </div>
            <span className="font-extrabold text-foreground tracking-wider uppercase">
              NEXUS
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              activeProps={{ className: 'text-primary font-semibold' }}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground no-underline"
            >
              Home
            </Link>
            <Link
              to="/products"
              activeProps={{ className: 'text-primary font-semibold' }}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground no-underline"
            >
              Catalog
            </Link>
            <Link
              to="/products"
              search={{ category: 'Audio' }}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground no-underline"
            >
              Audio
            </Link>
            <Link
              to="/products"
              search={{ category: 'Electronics' }}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground no-underline"
            >
              Electronics
            </Link>
          </nav>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-4">
          <Link
            to="/products"
            className="flex items-center gap-2 rounded-full border border-line bg-card/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground no-underline"
          >
            <Search className="size-3.5" />
            <span className="hidden sm:inline">Search gear...</span>
          </Link>

          <Link
            to="/products"
            className="relative flex size-9 items-center justify-center rounded-full border border-line bg-card text-foreground transition hover:border-primary/40 no-underline"
            title="Cart"
          >
            <ShoppingBag className="size-4" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4.5 items-center justify-center rounded-full bg-primary font-bold text-[10px] text-primary-foreground animate-in zoom-in-50">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line bg-card/40 py-12 text-sm text-muted-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-bold text-foreground">
              <Sparkles className="size-4 text-primary" />
              <span>NEXUS STORE</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Static-first, edge-ready e-commerce catalog powered by TanStack
              Start, React 19, SQLite WAL mode, and Drizzle ORM.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">
              Catalog
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/products"
                  search={{ category: 'Audio', page: 1 }}
                  className="hover:text-foreground no-underline"
                >
                  High-End Audio
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: 'Electronics', page: 1 }}
                  className="hover:text-foreground no-underline"
                >
                  Workspace Electronics
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: 'Wearables', page: 1 }}
                  className="hover:text-foreground no-underline"
                >
                  Smart Wearables
                </Link>
              </li>
              <li>
                <Link
                  to="/products"
                  search={{ category: 'Home & Living', page: 1 }}
                  className="hover:text-foreground no-underline"
                >
                  Home & Desk Living
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Server Function Boundaries</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Layers className="size-3.5 text-primary" />
                <span>SQLite WAL Concurrency</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="size-3.5 text-primary" />
                <span>Type-Safe File Routing</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-xs text-foreground uppercase tracking-wider mb-3">
              Status
            </h4>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Catalog Database Online (WAL)</span>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Deterministic, zero-fluff schema with Drizzle migrations.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-line/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} NEXUS Store. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">TanStack Start • React 19 • SQLite</p>
        </div>
      </div>
    </footer>
  )
}

function LoadingFallback() {
  return (
    <div className="flex min-h-[60vh] w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading catalog...
        </p>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <NavigationBar />
        <main className="flex-1">
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </main>
        <SiteFooter />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
