import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { sql, getDatabaseHost } from './db.js'
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

app.onError((err, c) => {
  console.error('[api]', err)
  return c.json({ error: err.message || 'Internal Server Error' }, 500)
})

app.get('/api/health', (c) => c.json({ ok: true }))

app.get('/api/db-check', async (c) => {
  const host = getDatabaseHost()

  const [profil] = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'profil_koperasi'
    ) AS exists
  `

  const [entitas] = await sql<{ exists: boolean }[]>`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'entitas_komoditas'
    ) AS exists
  `

  if (!profil.exists || !entitas.exists) {
    return c.json({
      ok: false,
      host,
      schema: { profil_koperasi: profil.exists, entitas_komoditas: entitas.exists },
      message: 'Skema belum ada — jalankan npm run db:supabase-init',
    }, 503)
  }

  const [counts] = await sql<{ koperasi: number; entitas: number }[]>`
    SELECT
      (SELECT count(*)::int FROM profil_koperasi) AS koperasi,
      (SELECT count(*)::int FROM entitas_komoditas) AS entitas
  `

  return c.json({ ok: true, host, counts })
})

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
