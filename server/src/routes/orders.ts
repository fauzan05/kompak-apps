import { Hono } from 'hono'
import { sql, DEMO_COOP_ID } from '../db.js'

export const ordersRoute = new Hono()

const STATUS_FLOW: Record<string, string> = {
  dijadwalkan: 'dalam-perjalanan',
  'dalam-perjalanan': 'selesai',
}

ordersRoute.post('/', async (c) => {
  const body = await c.req.json<{
    entitasRef: string
    koperasiRef?: string
    namaKomoditas: string
    jumlah: number
    nilai?: number
  }>()

  if (!body.entitasRef || !body.namaKomoditas || !body.jumlah) {
    return c.json({ error: 'Produsen, komoditas, dan jumlah wajib diisi' }, 400)
  }

  const koperasiRef = body.koperasiRef || DEMO_COOP_ID

  const [entitas] = await sql<{ entitas_ref: string }[]>`
    SELECT entitas_ref FROM entitas_komoditas WHERE entitas_ref = ${body.entitasRef}
  `
  if (!entitas) return c.json({ error: 'Produsen tidak ditemukan' }, 404)

  const [koperasi] = await sql<{ koperasi_ref: string }[]>`
    SELECT koperasi_ref FROM referensi_koperasi_wilayah WHERE koperasi_ref = ${koperasiRef}
  `
  if (!koperasi) return c.json({ error: 'Koperasi tidak ditemukan' }, 404)

  const transaksiRef = `TXK-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

  await sql`
    INSERT INTO transaksi_kompak (
      transaksi_ref, entitas_ref, koperasi_ref, nama_komoditas, jumlah, nilai, status, tanggal
    )
    VALUES (
      ${transaksiRef},
      ${body.entitasRef},
      ${koperasiRef},
      ${body.namaKomoditas},
      ${body.jumlah},
      ${body.nilai || null},
      'dijadwalkan',
      current_date
    )
  `

  return c.json({ ok: true, transaksiRef }, 201)
})

ordersRoute.patch('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ status: string }>()

  if (!body.status) {
    return c.json({ error: 'Status wajib diisi' }, 400)
  }

  const [existing] = await sql<{ transaksi_ref: string; status: string }[]>`
    SELECT transaksi_ref, status FROM transaksi_kompak WHERE transaksi_ref = ${id}
  `
  if (!existing) return c.json({ error: 'Pesanan tidak ditemukan' }, 404)

  const expectedNext = STATUS_FLOW[existing.status]
  if (!expectedNext || body.status !== expectedNext) {
    return c.json({ error: `Transisi status tidak valid dari "${existing.status}" ke "${body.status}"` }, 400)
  }

  await sql`
    UPDATE transaksi_kompak SET status = ${body.status} WHERE transaksi_ref = ${id}
  `

  return c.json({ ok: true, transaksiRef: id, status: body.status })
})
