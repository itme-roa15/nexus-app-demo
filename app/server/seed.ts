import { db } from './db/client'
import { products } from './db/schema'

export const seedProducts = [
  {
    id: 1,
    name: 'Apex Horizon Noise-Cancelling Headphones',
    slug: 'apex-horizon-headphones',
    description:
      'Immersive soundstage with custom 40mm beryllium drivers, 45-hour active battery life, and adaptive environmental noise suppression.',
    category: 'Audio',
    price: 349.99,
    rating: 4.9,
    stock: 38,
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Vanguard Mechanical Keyboard (75% Wireless)',
    slug: 'vanguard-mechanical-keyboard',
    description:
      'CNC-machined aluminum chassis, hot-swappable tactile switches, per-key RGB backlighting, and ultra-low latency 2.4GHz RF connection.',
    category: 'Electronics',
    price: 189.5,
    rating: 4.8,
    stock: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 3,
    name: 'Spectra 34" Curved QD-OLED Monitor',
    slug: 'spectra-curved-oled-monitor',
    description:
      'Next-generation quantum dot OLED panel boasting 175Hz refresh rate, 0.03ms response time, and 99.3% DCI-P3 color gamut calibration.',
    category: 'Electronics',
    price: 899.0,
    rating: 4.9,
    stock: 12,
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 4,
    name: 'Luminary Studio Monitor Speakers (Pair)',
    slug: 'luminary-studio-monitors',
    description:
      'Bi-amplified reference studio monitors engineered for ultra-flat frequency response, pristine acoustic transparency, and balanced XLR inputs.',
    category: 'Audio',
    price: 499.0,
    rating: 4.7,
    stock: 20,
    imageUrl:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 5,
    name: 'Strata Ergonomic Vertical Mouse',
    slug: 'strata-ergonomic-mouse',
    description:
      'Biomechanically certified 57-degree vertical grip that alleviates wrist strain. Features 4000 DPI sensor and thumb scroll wheel.',
    category: 'Electronics',
    price: 79.99,
    rating: 4.6,
    stock: 64,
    imageUrl:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 6,
    name: 'Kinetics Titanium Smartwatch',
    slug: 'kinetics-titanium-smartwatch',
    description:
      'Aerospace-grade Grade 5 titanium case with sapphire crystal glass, continuous HRV monitoring, GPS dual-band, and 14-day standby.',
    category: 'Wearables',
    price: 429.0,
    rating: 4.8,
    stock: 29,
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 7,
    name: 'Nomad Heavyweight Canvas Commuter Pack',
    slug: 'nomad-canvas-backpack',
    description:
      'Weatherproof 24L modular roll-top backpack tailored from 18oz waxed canvas with dedicated 16-inch padded laptop compartment.',
    category: 'Apparel',
    price: 165.0,
    rating: 4.7,
    stock: 52,
    imageUrl:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 8,
    name: 'Merino Thermal Wool Overshirt',
    slug: 'merino-thermal-wool-overshirt',
    description:
      'Superfine 100% 260gsm New Zealand merino wool naturally regulating microclimate temperature while preventing odor buildup.',
    category: 'Apparel',
    price: 145.0,
    rating: 4.8,
    stock: 33,
    imageUrl:
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 9,
    name: 'Halo Anodized Aluminum Desk Lamp',
    slug: 'halo-desk-lamp',
    description:
      'Minimalist counterbalanced arm featuring high CRI 98 LEDs, touch-capacitive rotary dimming, and integrated wireless charging base.',
    category: 'Home & Living',
    price: 129.0,
    rating: 4.7,
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 10,
    name: 'Solid Walnut Dual Monitor Riser',
    slug: 'walnut-monitor-riser',
    description:
      'Handcrafted from single-slab American black walnut with matte black steel legs and felt-lined desk protection.',
    category: 'Home & Living',
    price: 135.0,
    rating: 4.9,
    stock: 18,
    imageUrl:
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 11,
    name: 'Acoustic Pulse ANC Wireless Earbuds',
    slug: 'acoustic-pulse-wireless-earbuds',
    description:
      'Compact IPX7 waterproof buds with hybrid noise cancelation, personalized hearing profiles, and Qi-certified wireless charging.',
    category: 'Audio',
    price: 159.0,
    rating: 4.6,
    stock: 75,
    imageUrl:
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
  {
    id: 12,
    name: 'Aero Minimalist Leather Cardholder',
    slug: 'aero-minimalist-cardholder',
    description:
      'Full-grain vegetable-tanned Italian leather with RFID-blocking alloy core and quick-eject pull tab mechanism.',
    category: 'Apparel',
    price: 49.0,
    rating: 4.8,
    stock: 110,
    imageUrl:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&auto=format&fit=crop&q=80',
    featured: false,
  },
]

export async function seed() {
  console.log('🌱 Seeding products into SQLite database...')
  for (const item of seedProducts) {
    await db
      .insert(products)
      .values(item)
      .onConflictDoUpdate({
        target: products.id,
        set: {
          name: item.name,
          slug: item.slug,
          description: item.description,
          category: item.category,
          price: item.price,
          rating: item.rating,
          stock: item.stock,
          imageUrl: item.imageUrl,
          featured: item.featured,
        },
      })
  }
  console.log(`✅ Successfully seeded ${seedProducts.length} products.`)
}

// Run directly if executed as main module
if (import.meta.url === `file://${process.argv[1]}`) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error('❌ Failed to seed database:', err)
      process.exit(1)
    })
}
