import { Hono } from 'hono'
import { cors } from 'hono/cors'
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

export const app = new Hono()

app.use('/*', cors())

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
