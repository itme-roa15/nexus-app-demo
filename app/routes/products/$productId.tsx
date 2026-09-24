import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { getProductFn } from '../../server/functions/get-product'
import {
  ArrowLeft,
  Check,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
} from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/products/$productId')({
  loader: async ({ params }) => {
    const product = await getProductFn({
      data: {
        id: params.productId,
      },
    })

    if (!product) {
      throw notFound()
    }

    return { product }
  },
  notFoundComponent: ProductNotFound,
  component: ProductDetailPage,
})

function ProductDetailPage() {
  const { product } = Route.useLoaderData()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    try {
      const current = Number(localStorage.getItem('nexus_cart_count') || 0)
      const next = current + quantity
      localStorage.setItem('nexus_cart_count', String(next))
      window.dispatchEvent(new Event('nexus_cart_updated'))
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground no-underline">
          Home
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground no-underline">
          Catalog
        </Link>
        <span>/</span>
        <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
          {product.name}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column: Image */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-muted shadow-sm">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="size-full object-cover"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="rounded-lg bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-xs shadow-xs">
                {product.category}
              </span>
              {product.featured && (
                <span className="rounded-lg bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground shadow-xs">
                  FEATURED
                </span>
              )}
            </div>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition pt-2 no-underline"
          >
            <ArrowLeft className="size-4" />
            <span>Back to All Products</span>
          </Link>
        </div>

        {/* Right Column: Information & Actions */}
        <div className="flex flex-col">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {product.category}
            </span>
            <div className="flex items-center gap-1.5 text-amber-500 text-xs">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-current'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-foreground ml-1">
                {product.rating}
              </span>
              <span className="text-muted-foreground">
                (48 verified reviews)
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {product.name}
          </h1>

          {/* Price & Stock */}
          <div className="mt-4 flex items-baseline gap-4 pb-6 border-b border-line">
            <div className="text-3xl font-extrabold text-foreground">
              ${product.price.toFixed(2)}
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                In Stock ({product.stock} available)
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-foreground mb-2">
              Overview
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Specifications Highlight Box */}
          <div className="mt-6 rounded-xl border border-line bg-card/50 p-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider mb-3">
              Hardware Highlights
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500 shrink-0" />
                <span>Precision machined materials for durability</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500 shrink-0" />
                <span>Zero-configuration compatibility</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="size-3.5 text-emerald-500 shrink-0" />
                <span>Verified low-latency performance profile</span>
              </li>
            </ul>
          </div>

          {/* Quantity and Add to Cart Button */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="flex items-center rounded-lg border border-line bg-card p-1">
              <button
                type="button"
                disabled={quantity <= 1}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex size-9 items-center justify-center rounded-md font-bold text-foreground hover:bg-muted disabled:opacity-40"
              >
                -
              </button>
              <span className="w-12 text-center text-sm font-bold text-foreground">
                {quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= product.stock}
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="flex size-9 items-center justify-center rounded-md font-bold text-foreground hover:bg-muted disabled:opacity-40"
              >
                +
              </button>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 font-semibold text-sm transition shadow-sm ${
                added
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {added ? (
                <>
                  <Check className="size-4" />
                  <span>Added {quantity} to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  <span>
                    Add to Bag • ${(product.price * quantity).toFixed(2)}
                  </span>
                </>
              )}
            </button>
          </div>

          {/* Guarantees */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-line pt-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary shrink-0" />
              <span>Complimentary 2-Day Air</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary shrink-0" />
              <span>2-Year Full Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4 text-primary shrink-0" />
              <span>30-Day Hassle-Free Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProductNotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Package className="size-7" />
        </div>
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground">
        Product Not Found
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The item you are seeking does not exist or may have been archived.
      </p>
      <div className="mt-6">
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 no-underline"
        >
          <ArrowLeft className="size-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    </div>
  )
}
