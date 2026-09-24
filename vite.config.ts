import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const config = defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      '@tanstack/start': '@tanstack/react-start',
      '#': path.resolve(__dirname, './app'),
      '@': path.resolve(__dirname, './app'),
      '~': path.resolve(__dirname, './app'),
    },
  },
  plugins: [
    devtools(),
    nitro({
      rollupConfig: {
        external: [/^@sentry\//, 'better-sqlite3'],
      },
    }),
    tailwindcss(),
    tanstackStart({
      srcDirectory: 'app',
      server: {
        entry: 'ssr',
      },
      prerender: {
        enabled: true,
        crawlLinks: true,
        filter: (page) => !page.path.includes('?') && !page.path.includes('&'),
      },
    }),
    viteReact(),
  ],
})

export default config
