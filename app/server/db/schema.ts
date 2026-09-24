import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core'
import { sql } from 'drizzle-orm'

export const products = sqliteTable('products', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description').notNull(),
  category: text('category').notNull(),
  price: real('price').notNull(),
  rating: real('rating').notNull().default(0),
  stock: integer('stock').notNull().default(0),
  imageUrl: text('image_url').notNull(),
  featured: integer('featured', { mode: 'boolean' }).notNull().default(false),
  createdAt: text('created_at')
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

export type Product = typeof products.$inferSelect
export type NewProduct = typeof products.$inferInsert
