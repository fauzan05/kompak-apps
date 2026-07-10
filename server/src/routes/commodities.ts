import { Hono } from 'hono'
import { sql } from '../db.js'
import { commodityImage } from '../commodityImages.js'

export const commoditiesRoute = new Hono()

commoditiesRoute.get('/', async (c) => {
  const rows = await sql<{ nama: string; count: number }[]>`
    SELECT nama_komoditas AS nama, count(*)::int AS count
    FROM penawaran_komoditas
    WHERE status = 'aktif'
    GROUP BY nama_komoditas
    ORDER BY count DESC
    LIMIT 12
  `

  const komoditas = rows.map((r) => ({
    name: r.nama,
    count: `${r.count.toLocaleString('id-ID')} penawaran`,
    img: commodityImage(r.nama, 'thumb'),
  }))

  return c.json({ komoditas })
})
