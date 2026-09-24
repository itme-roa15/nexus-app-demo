import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db/client'
import { products } from '../db/schema'
import { and, asc, desc, eq, gte, like, lte, or, sql } from 'drizzle-orm'

const getProductsInputSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.enum(['featured', 'price-asc', 'price-desc', 'rating']).optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  page: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(50).optional().default(8),
})

export const getProductsFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getProductsInputSchema.parse(data))
  .handler(async ({ data }) => {
    const {
      query,
      category,
      sortBy = 'featured',
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 8,
    } = data

    const conditions = []

    if (query && query.trim() !== '') {
      const q = `%${query.trim()}%`
      conditions.push(
        or(
          like(products.name, q),
          like(products.description, q),
          like(products.category, q),
        ),
      )
    }

    if (category && category !== 'all') {
      conditions.push(eq(products.category, category))
    }

    if (minPrice !== undefined) {
      conditions.push(gte(products.price, minPrice))
    }

    if (maxPrice !== undefined) {
      conditions.push(lte(products.price, maxPrice))
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined

    let orderBy
    switch (sortBy) {
      case 'price-asc':
        orderBy = [asc(products.price)]
        break
      case 'price-desc':
        orderBy = [desc(products.price)]
        break
      case 'rating':
        orderBy = [desc(products.rating)]
        break
      case 'featured':
      default:
        orderBy = [desc(products.featured), desc(products.rating)]
        break
    }

    const offset = (page - 1) * pageSize

    const [items, totalResult, allCategories] = await Promise.all([
      db
        .select()
        .from(products)
        .where(whereClause)
        .orderBy(...orderBy)
        .limit(pageSize)
        .offset(offset),
      db
        .select({ count: sql<number>`count(*)` })
        .from(products)
        .where(whereClause),
      db
        .selectDistinct({ category: products.category })
        .from(products)
        .orderBy(asc(products.category)),
    ])

    const total = Number(totalResult[0]?.count ?? 0)
    const totalPages = Math.max(1, Math.ceil(total / pageSize))
    const categories = allCategories.map((c) => c.category)

    return {
      products: items,
      total,
      page,
      pageSize,
      totalPages,
      categories,
    }
  })
