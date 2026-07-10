import { Hono } from 'hono'
import { sql, DEMO_PRODUCER_ID } from '../db.js'

export const productsRoute = new Hono()

productsRoute.post('/', async (c) => {
  const body = await c.req.json<{
    entitasRef?: string
    namaKomoditas: string
    jumlah: number
    satuan?: string
    harga?: number
    namaEntitas?: string
    tipeEntitas?: 'produsen' | 'komunitas'
    telepon?: string
    kodeWilayah?: string
    koordinat?: string
  }>()

  if (!body.namaKomoditas || !body.jumlah) {
    return c.json({ error: 'Nama komoditas dan jumlah wajib diisi' }, 400)
  }

  let entitasRef = body.entitasRef || DEMO_PRODUCER_ID

  const [existing] = await sql<{ entitas_ref: string }[]>`
    SELECT entitas_ref FROM entitas_komoditas WHERE entitas_ref = ${entitasRef}
  `

  if (!existing) {
    entitasRef = `ENT-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`
    await sql`
      INSERT INTO entitas_komoditas (entitas_ref, tipe, nama, koordinat_dibulatkan, kode_wilayah, verified, telepon, tentang)
      VALUES (
        ${entitasRef},
        ${body.tipeEntitas || 'produsen'},
        ${body.namaEntitas || 'Produsen Baru'},
        ${body.koordinat || '-6.60, 106.80'},
        ${body.kodeWilayah || null},
        false,
        ${body.telepon || null},
        'Terdaftar melalui formulir KOMPAK Apps'
      )
    `
  }

  const penawaranRef = `PWN-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`
  await sql`
    INSERT INTO penawaran_komoditas (penawaran_ref, entitas_ref, nama_komoditas, jumlah, satuan, harga, status)
    VALUES (
      ${penawaranRef},
      ${entitasRef},
      ${body.namaKomoditas},
      ${body.jumlah},
      ${body.satuan || 'kg'},
      ${body.harga || 15000},
      'aktif'
    )
  `

  return c.json({ ok: true, entitasRef, penawaranRef }, 201)
})
