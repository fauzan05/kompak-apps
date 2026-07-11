import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from 'dotenv'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { statsRoute } from './routes/stats.js'
import { commoditiesRoute } from './routes/commodities.js'
import { mapRoute } from './routes/map.js'
import { entitiesRoute } from './routes/entities.js'
import { dashboardRoute } from './routes/dashboard.js'
import { productsRoute } from './routes/products.js'
import { offersRoute } from './routes/offers.js'
import { ordersRoute } from './routes/orders.js'
import { offtakerRoute } from './routes/offtaker.js'
import { uploadsRoute } from './routes/uploads.js'
import { projectRoot, serverRoot, uploadsDir } from './paths.js'

config({ path: join(projectRoot, '.env') })

try {
  mkdirSync(uploadsDir, { recursive: true })
} catch (err) {
  console.error('[api] Gagal membuat folder uploads:', err)
  process.exit(1)
}

const app = new Hono()

app.use('/*', cors())

app.use('/uploads/*', serveStatic({ root: serverRoot }))

app.get('/api/health', (c) => c.json({ ok: true }))

app.route('/api/stats', statsRoute)
app.route('/api/commodities', commoditiesRoute)
app.route('/api/map', mapRoute)
app.route('/api/entities', entitiesRoute)
app.route('/api/dashboard', dashboardRoute)
app.route('/api/products', productsRoute)
app.route('/api/offers', offersRoute)
app.route('/api/orders', ordersRoute)
app.route('/api/offtaker', offtakerRoute)
app.route('/api/uploads', uploadsRoute)

const port = Number(process.env.API_PORT || 3001)

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`KOMPAK API berjalan di http://localhost:${info.port}`)
})
