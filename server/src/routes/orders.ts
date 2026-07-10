import { Hono } from 'hono'
import { sql, DEMO_COOP_ID } from '../db.js'

export const ordersRoute = new Hono()

const KIRIM_FLOW: Record<string, string> = {
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
      transaksi_ref, entitas_ref, koperasi_ref, arah, nama_komoditas, jumlah, nilai,
      status, status_deal, status_bayar, status_kirim, tanggal
    )
    VALUES (
      ${transaksiRef},
      ${body.entitasRef},
      ${koperasiRef},
      'produsen_koperasi',
      ${body.namaKomoditas},
      ${body.jumlah},
      ${body.nilai || null},
      'dijadwalkan',
      'disepakati',
      'belum',
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

  const [existing] = await sql<{ transaksi_ref: string; status_kirim: string; status: string }[]>`
    SELECT transaksi_ref, coalesce(status_kirim, status) AS status_kirim, status
    FROM transaksi_kompak WHERE transaksi_ref = ${id}
  `
  if (!existing) return c.json({ error: 'Pesanan tidak ditemukan' }, 404)

  const current = existing.status_kirim || existing.status
  const expectedNext = KIRIM_FLOW[current]
  if (!expectedNext || body.status !== expectedNext) {
    return c.json({ error: `Transisi pengiriman tidak valid dari "${current}" ke "${body.status}"` }, 400)
  }

  await sql`
    UPDATE transaksi_kompak
    SET status_kirim = ${body.status}, status = ${body.status}
    WHERE transaksi_ref = ${id}
  `

  return c.json({ ok: true, transaksiRef: id, status: body.status })
})

ordersRoute.post('/:id/pay-simulate', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json<{ metode?: string }>()

  const [existing] = await sql<{ transaksi_ref: string; status_bayar: string }[]>`
    SELECT transaksi_ref, status_bayar FROM transaksi_kompak WHERE transaksi_ref = ${id}
  `
  if (!existing) return c.json({ error: 'Transaksi tidak ditemukan' }, 404)
  if (existing.status_bayar === 'lunas') {
    return c.json({ error: 'Transaksi sudah lunas' }, 400)
  }

  const metode = body.metode || 'transfer'

  await sql`
    UPDATE transaksi_kompak
    SET status_bayar = 'lunas', metode_bayar = ${metode}, dibayar_pada = now()
    WHERE transaksi_ref = ${id}
  `

  return c.json({ ok: true, transaksiRef: id, statusBayar: 'lunas', metode })
})
