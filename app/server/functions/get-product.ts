import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../db/client'
import { products } from '../db/schema'
import { eq, or } from 'drizzle-orm'

const getProductInputSchema = z.object({
  id: z.union([z.string(), z.number()]),
})

export const getProductFn = createServerFn({ method: 'GET' })
  .validator((data: unknown) => getProductInputSchema.parse(data))
  .handler(async ({ data }) => {
    const rawId = String(data.id).trim()
    const numId = Number(rawId)
    const isNum = !isNaN(numId) && String(numId) === rawId

    const item = await db.query.products.findFirst({
      where: isNum
        ? or(eq(products.id, numId), eq(products.slug, rawId))
        : eq(products.slug, rawId),
    })

    return item ?? null
  })
