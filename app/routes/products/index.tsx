import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import { getProductsFn } from '../../server/functions/get-products'
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  ShoppingBag,
  ArrowUpDown,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'

const productSearchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating']).optional(),
  page: z.coerce.number().int().min(1).optional(),
})

export type ProductSearch = z.infer<typeof productSearchSchema>

export const Route = createFileRoute('/products/')({
  validateSearch: (search) => productSearchSchema.parse(search),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    return await getProductsFn({
      data: {
        query: deps.q,
        category: deps.category === 'all' ? undefined : deps.category,
        minPrice: deps.minPrice,
        maxPrice: deps.maxPrice,
        sortBy: deps.sortBy,
        page: deps.page,
        pageSize: 8,
      },
    })
  },
  component: ProductsCatalogPage,
})

function ProductsCatalogPage() {
  const { products, total, totalPages, categories, page } =
    Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })
  const [addedId, setAddedId] = useState<number | null>(null)

  // Direct URL state setters (URL as Single Source of Truth)
  const updateSearch = (updates: Partial<ProductSearch>) => {
    navigate({
      search: (prev) => ({
        ...prev,
        ...updates,
      }),
    })
  }

  const handleAddToCart = (e: React.MouseEvent, productId: number) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const current = Number(localStorage.getItem('nexus_cart_count') || 0)
      const next = current + 1
      localStorage.setItem('nexus_cart_count', String(next))
      window.dispatchEvent(new Event('nexus_cart_updated'))
      setAddedId(productId)
      setTimeout(() => setAddedId(null), 1500)
    } catch {
      // ignore
    }
  }

  const activeSort = search.sortBy ?? 'featured'
  const activeCategory = search.category ?? 'all'

  const hasActiveFilters =
    Boolean(search.q) ||
    activeCategory !== 'all' ||
    search.minPrice !== undefined ||
    search.maxPrice !== undefined ||
    activeSort !== 'featured'

  const clearAllFilters = () => {
    navigate({
      search: () => ({
        q: '',
        category: 'all',
        sortBy: 'featured',
        page: 1,
      }),
    })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Header and Breadcrumbs */}
      <div className="flex flex-col gap-2 mb-8">
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground no-underline">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">Catalog</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Product Catalog
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Showing {products.length} of {total} high-performance items.
            </p>
          </div>

          {/* Quick Sort Control */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
              <ArrowUpDown className="size-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={activeSort}
              onChange={(e) =>
                updateSearch({
                  sortBy: e.target.value as ProductSearch['sortBy'],
                  page: 1,
                })
              }
              className="rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="featured">Featured</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-card/60 p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search input */}
          <div className="relative w-full flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search gear by name, category, or specs..."
              value={search.q || ''}
              onChange={(e) => updateSearch({ q: e.target.value, page: 1 })}
              className="w-full rounded-lg border border-line bg-background py-2 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            {search.q && (
              <button
                type="button"
                onClick={() => updateSearch({ q: '', page: 1 })}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Price Range Presets */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
              Price:
            </span>
            <button
              type="button"
              onClick={() =>
                updateSearch({
                  minPrice: undefined,
                  maxPrice: undefined,
                  page: 1,
                })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                search.minPrice === undefined && search.maxPrice === undefined
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-line bg-background text-foreground hover:bg-card'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() =>
                updateSearch({ minPrice: 0, maxPrice: 100, page: 1 })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                search.minPrice === 0 && search.maxPrice === 100
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-line bg-background text-foreground hover:bg-card'
              }`}
            >
              Under $100
            </button>
            <button
              type="button"
              onClick={() =>
                updateSearch({ minPrice: 100, maxPrice: 300, page: 1 })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                search.minPrice === 100 && search.maxPrice === 300
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-line bg-background text-foreground hover:bg-card'
              }`}
            >
              $100 - $300
            </button>
            <button
              type="button"
              onClick={() =>
                updateSearch({ minPrice: 300, maxPrice: undefined, page: 1 })
              }
              className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition whitespace-nowrap ${
                search.minPrice === 300 && search.maxPrice === undefined
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-line bg-background text-foreground hover:bg-card'
              }`}
            >
              $300+
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-line/50">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Category:
          </span>
          <button
            type="button"
            onClick={() => updateSearch({ category: 'all', page: 1 })}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${
              activeCategory === 'all'
                ? 'bg-foreground text-background shadow-xs'
                : 'border border-line bg-background text-foreground hover:border-primary/40'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => updateSearch({ category: cat, page: 1 })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                activeCategory === cat
                  ? 'bg-foreground text-background shadow-xs'
                  : 'border border-line bg-background text-foreground hover:border-primary/40'
              }`}
            >
              {cat}
            </button>
          ))}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
            >
              <RotateCcw className="size-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-card/30 p-12 text-center my-8">
          <SlidersHorizontal className="size-10 text-muted-foreground/60 mb-3" />
          <h3 className="text-base font-bold text-foreground">
            No matching products found
          </h3>
          <p className="mt-1 text-xs text-muted-foreground max-w-sm">
            Try adjusting your search criteria, price range, or category filter
            to discover more products.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <RotateCcw className="size-3.5" />
            <span>Clear All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col rounded-xl border border-line bg-card overflow-hidden shadow-xs transition hover:border-primary/40 hover:shadow-md"
            >
              <Link
                to="/products/$productId"
                params={{ productId: String(item.id) }}
                className="relative aspect-square w-full overflow-hidden bg-muted block no-underline"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  loading="lazy"
                  className="size-full object-cover transition duration-300 group-hover:scale-105"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="rounded-md bg-background/90 px-2 py-0.5 text-[11px] font-semibold text-foreground backdrop-blur-xs">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="rounded-md bg-primary/90 px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground backdrop-blur-xs">
                      HOT
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 right-2.5 rounded-md bg-background/90 px-2 py-0.5 text-[10px] font-medium text-muted-foreground backdrop-blur-xs">
                  {item.stock > 10 ? 'In Stock' : `Low Stock: ${item.stock}`}
                </div>
              </Link>

              <div className="flex flex-1 flex-col p-4">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="size-3.5 fill-current" />
                    <span className="font-semibold text-foreground">
                      {item.rating}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">
                    {item.stock} units
                  </span>
                </div>

                <Link
                  to="/products/$productId"
                  params={{ productId: String(item.id) }}
                  className="font-semibold text-sm text-foreground line-clamp-1 hover:text-primary transition no-underline"
                >
                  {item.name}
                </Link>

                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="mt-auto pt-4 flex items-center justify-between border-t border-line/60">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase font-medium">
                      Price
                    </div>
                    <div className="font-bold text-base text-foreground">
                      ${item.price.toFixed(2)}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => handleAddToCart(e, item.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      addedId === item.id
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="size-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="size-3.5" />
                        <span>Add</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2 border-t border-line/60 pt-6">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => updateSearch({ page: page - 1 })}
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition hover:bg-card/80 disabled:opacity-40 disabled:pointer-events-none"
          >
            <ChevronLeft className="size-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-1 px-2 text-xs font-medium text-muted-foreground">
            <span>Page</span>
            <span className="font-bold text-foreground">{page}</span>
            <span>of</span>
            <span className="font-bold text-foreground">{totalPages}</span>
          </div>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => updateSearch({ page: page + 1 })}
            className="inline-flex items-center gap-1 rounded-lg border border-line bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-xs transition hover:bg-card/80 disabled:opacity-40 disabled:pointer-events-none"
          >
            <span>Next</span>
            <ChevronRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  )
}
