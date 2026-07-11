import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { config } from 'dotenv'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { app } from './app.js'
import { projectRoot, serverRoot, uploadsDir } from './paths.js'

config({ path: join(projectRoot, '.env') })

try {
  mkdirSync(uploadsDir, { recursive: true })
} catch (err) {
  console.error('[api] Gagal membuat folder uploads:', err)
  process.exit(1)
}

app.use('/uploads/*', serveStatic({ root: serverRoot }))

const port = Number(process.env.API_PORT || 3001)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`KOMPAK API berjalan di http://localhost:${info.port}`)
})
