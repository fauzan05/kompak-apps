import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { config } from 'dotenv'
import { resolve } from 'path'
import { statsRoute } from './routes/stats.js'
import { commoditiesRoute } from './routes/commodities.js'
import { mapRoute } from './routes/map.js'
import { entitiesRoute } from './routes/entities.js'
import { dashboardRoute } from './routes/dashboard.js'
import { productsRoute } from './routes/products.js'

config({ path: resolve(process.cwd(), '../.env') })
config()

const app = new Hono()

app.use('/*', cors())

app.get('/api/health', (c) => c.json({ ok: true }))

app.route('/api/stats', statsRoute)
app.route('/api/commodities', commoditiesRoute)
app.route('/api/map', mapRoute)
app.route('/api/entities', entitiesRoute)
app.route('/api/dashboard', dashboardRoute)
app.route('/api/products', productsRoute)

const port = Number(process.env.API_PORT || 3001)

serve({ fetch: app.fetch, port }, () => {
  console.log(`KOMPAK API berjalan di http://localhost:${port}`)
})
