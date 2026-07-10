import { Hono } from 'hono'
import { sql, DEMO_COOP_ID, DEMO_PRODUCER_ID } from '../db.js'
import { formatRupiah } from '../utils.js'

export const offersRoute = new Hono()

offersRoute.post('/', async (c) => {
  const body = await c.req.json<{
    arah: 'produsen_ke_koperasi' | 'koperasi_ke_produsen'
    entitasRef?: string
    koperasiRef?: string
    kebutuhanRef?: string
    namaKomoditas: string
    jumlah: number
    satuan?: string
    harga?: number
    catatan?: string
  }>()

  if (!body.arah || !body.namaKomoditas || !body.jumlah) {
    return c.json({ error: 'Arah, nama komoditas, dan jumlah wajib diisi' }, 400)
  }

  if (!['produsen_ke_koperasi', 'koperasi_ke_produsen'].includes(body.arah)) {
    return c.json({ error: 'Arah penawaran tidak valid' }, 400)
  }

  const entitasRef =
    body.entitasRef ||
    (body.arah === 'produsen_ke_koperasi' ? DEMO_PRODUCER_ID : undefined)
  const koperasiRef =
    body.koperasiRef ||
    (body.arah === 'koperasi_ke_produsen' ? DEMO_COOP_ID : undefined)

  if (!entitasRef || !koperasiRef) {
    return c.json({ error: 'Entitas dan koperasi wajib ditentukan' }, 400)
  }

  const [entitas] = await sql<{ entitas_ref: string }[]>`
    SELECT entitas_ref FROM entitas_komoditas WHERE entitas_ref = ${entitasRef}
  `
  if (!entitas) return c.json({ error: 'Produsen tidak ditemukan' }, 404)

  const [koperasi] = await sql<{ koperasi_ref: string }[]>`
    SELECT koperasi_ref FROM referensi_koperasi_wilayah WHERE koperasi_ref = ${koperasiRef}
  `
  if (!koperasi) return c.json({ error: 'Koperasi tidak ditemukan' }, 404)

  if (body.kebutuhanRef) {
    const [need] = await sql<{ kebutuhan_ref: string }[]>`
      SELECT kebutuhan_ref FROM kebutuhan_koperasi
      WHERE kebutuhan_ref = ${body.kebutuhanRef} AND koperasi_ref = ${koperasiRef} AND status = 'aktif'
    `
    if (!need) return c.json({ error: 'Kebutuhan koperasi tidak ditemukan atau sudah ditutup' }, 404)
  }

  const responRef = `RSP-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

  await sql`
    INSERT INTO respon_penawaran (
      respon_ref, arah, entitas_ref, koperasi_ref, kebutuhan_ref,
      nama_komoditas, jumlah, satuan, harga, catatan, status
    )
    VALUES (
      ${responRef},
      ${body.arah},
      ${entitasRef},
      ${koperasiRef},
      ${body.kebutuhanRef || null},
      ${body.namaKomoditas},
      ${body.jumlah},
      ${body.satuan || 'kg'},
      ${body.harga || null},
      ${body.catatan || null},
      'diajukan'
    )
  `

  if (body.kebutuhanRef) {
    await sql`
      UPDATE kebutuhan_koperasi
      SET jumlah_respon = jumlah_respon + 1, diperbarui_pada = now()
      WHERE kebutuhan_ref = ${body.kebutuhanRef}
    `
  }

  return c.json({ ok: true, responRef }, 201)
})

offersRoute.get('/', async (c) => {
  const kebutuhanRef = c.req.query('kebutuhanRef')?.trim()
  const koperasiRef = c.req.query('koperasiRef')?.trim()

  if (!kebutuhanRef && !koperasiRef) {
    return c.json({ error: 'kebutuhanRef atau koperasiRef wajib disertakan' }, 400)
  }

  const rows = kebutuhanRef
    ? await sql<{
        id: string
        producerName: string
        commodity: string
        qty: string
        price: string
        status: string
        date: string
        note: string | null
      }[]>`
        SELECT
          r.respon_ref AS id,
          e.nama AS "producerName",
          r.nama_komoditas AS commodity,
          r.jumlah::text || ' ' || r.satuan AS qty,
          coalesce(r.harga::text, '0') AS price,
          r.status,
          to_char(r.dibuat_pada, 'DD Mon YYYY HH24:MI') AS date,
          r.catatan AS note
        FROM respon_penawaran r
        JOIN entitas_komoditas e ON e.entitas_ref = r.entitas_ref
        WHERE r.kebutuhan_ref = ${kebutuhanRef}
        ORDER BY r.dibuat_pada DESC
        LIMIT 50
      `
    : await sql<{
        id: string
        producerName: string
        commodity: string
        qty: string
        price: string
        status: string
        date: string
        note: string | null
      }[]>`
        SELECT
          r.respon_ref AS id,
          e.nama AS "producerName",
          r.nama_komoditas AS commodity,
          r.jumlah::text || ' ' || r.satuan AS qty,
          coalesce(r.harga::text, '0') AS price,
          r.status,
          to_char(r.dibuat_pada, 'DD Mon YYYY HH24:MI') AS date,
          r.catatan AS note
        FROM respon_penawaran r
        JOIN entitas_komoditas e ON e.entitas_ref = r.entitas_ref
        WHERE r.koperasi_ref = ${koperasiRef!}
        ORDER BY r.dibuat_pada DESC
        LIMIT 50
      `

  const offers = rows.map((r) => ({
    ...r,
    price: Number(r.price) > 0 ? formatRupiah(Number(r.price)) + '/kg' : '—',
    statusLabel: r.status === 'diajukan' ? 'Diajukan' : r.status,
  }))

  return c.json({ offers })
})

offersRoute.post('/:id/accept', async (c) => {
  const responRef = c.req.param('id')

  const [offer] = await sql<{
    respon_ref: string
    entitas_ref: string
    koperasi_ref: string
    nama_komoditas: string
    jumlah: number
    harga: number | null
    status: string
  }[]>`
    SELECT respon_ref, entitas_ref, koperasi_ref, nama_komoditas, jumlah, harga, status
    FROM respon_penawaran WHERE respon_ref = ${responRef}
  `
  if (!offer) return c.json({ error: 'Penawaran tidak ditemukan' }, 404)
  if (offer.status === 'diterima') return c.json({ error: 'Penawaran sudah diterima' }, 400)

  const [existingTx] = await sql<{ transaksi_ref: string }[]>`
    SELECT transaksi_ref FROM transaksi_kompak WHERE respon_ref = ${responRef} LIMIT 1
  `
  if (existingTx) {
    return c.json({ ok: true, transaksiRef: existingTx.transaksi_ref, alreadyExists: true })
  }

  const nilai = offer.harga ? Number(offer.jumlah) * Number(offer.harga) : null
  const transaksiRef = `TXK-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

  await sql`
    INSERT INTO transaksi_kompak (
      transaksi_ref, entitas_ref, koperasi_ref, respon_ref, arah,
      nama_komoditas, jumlah, nilai, status, status_deal, status_bayar, status_kirim, tanggal
    )
    VALUES (
      ${transaksiRef},
      ${offer.entitas_ref},
      ${offer.koperasi_ref},
      ${responRef},
      'produsen_koperasi',
      ${offer.nama_komoditas},
      ${offer.jumlah},
      ${nilai},
      'dijadwalkan',
      'disepakati',
      'belum',
      'dijadwalkan',
      current_date
    )
  `

  await sql`
    UPDATE respon_penawaran SET status = 'diterima', diperbarui_pada = now()
    WHERE respon_ref = ${responRef}
  `

  return c.json({ ok: true, transaksiRef }, 201)
})
