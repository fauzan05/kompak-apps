import { Hono } from 'hono'
import { sql, DEMO_COOP_ID, DEMO_OFFTAKER_ID } from '../db.js'
import { formatRupiah } from '../utils.js'

export const offtakerRoute = new Hono()

function formatPricePerKg(price: string): string {
  return Number(price) > 0 ? `${formatRupiah(Number(price))}/kg` : '—'
}

offtakerRoute.get('/dashboard/:id', async (c) => {
  const id = c.req.param('id') || DEMO_OFFTAKER_ID

  const [offtaker] = await sql<{ nama: string; perusahaan: string }[]>`
    SELECT nama, coalesce(perusahaan, nama) AS perusahaan FROM offtaker WHERE offtaker_ref = ${id}
  `
  if (!offtaker) return c.json({ error: 'Offtaker tidak ditemukan' }, 404)

  const surplus = await sql<{
    id: string
    koperasiName: string
    koperasiRef: string
    commodity: string
    qty: string
    price: string
    location: string
  }[]>`
    SELECT
      s.surplus_ref AS id,
      p.nama_koperasi AS "koperasiName",
      s.koperasi_ref AS "koperasiRef",
      s.nama_komoditas AS commodity,
      s.jumlah::text || ' ' || s.satuan AS qty,
      coalesce(s.harga::text, '0') AS price,
      coalesce(w.kab_kota, 'Indonesia') AS location
    FROM stok_surplus_koperasi s
    JOIN profil_koperasi p ON p.koperasi_ref = s.koperasi_ref
    LEFT JOIN referensi_koperasi_wilayah r ON r.koperasi_ref = s.koperasi_ref
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = r.kode_wilayah
    WHERE s.status = 'aktif'
    ORDER BY s.dibuat_pada DESC
    LIMIT 20
  `

  const producerOffers = await sql<{
    id: string
    partyName: string
    partyRef: string
    commodity: string
    qty: string
    price: string
    location: string
    penawaranRef: string
  }[]>`
    SELECT
      pk.penawaran_ref AS id,
      e.nama AS "partyName",
      e.entitas_ref AS "partyRef",
      pk.nama_komoditas AS commodity,
      pk.jumlah::text || ' ' || pk.satuan AS qty,
      coalesce(pk.harga::text, '0') AS price,
      coalesce(w.kab_kota, 'Indonesia') AS location,
      pk.penawaran_ref AS "penawaranRef"
    FROM penawaran_komoditas pk
    JOIN entitas_komoditas e ON e.entitas_ref = pk.entitas_ref
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = e.kode_wilayah
    WHERE pk.status = 'aktif'
    ORDER BY pk.dibuat_pada DESC
    LIMIT 20
  `

  const sources = [
    ...surplus.map((s) => ({
      id: s.id,
      sourceType: 'koperasi' as const,
      partyName: s.koperasiName,
      partyRef: s.koperasiRef,
      commodity: s.commodity,
      qty: s.qty,
      price: formatPricePerKg(s.price),
      location: s.location,
      surplusRef: s.id,
    })),
    ...producerOffers.map((p) => ({
      id: p.id,
      sourceType: 'produsen' as const,
      partyName: p.partyName,
      partyRef: p.partyRef,
      commodity: p.commodity,
      qty: p.qty,
      price: formatPricePerKg(p.price),
      location: p.location,
      penawaranRef: p.penawaranRef,
    })),
  ]

  const rfqs = await sql<{
    id: string
    partyName: string
    targetType: string
    commodity: string
    qty: string
    status: string
    date: string
  }[]>`
    SELECT
      r.rfq_ref AS id,
      coalesce(p.nama_koperasi, e.nama, 'Pihak') AS "partyName",
      CASE WHEN r.entitas_ref IS NOT NULL THEN 'produsen' ELSE 'koperasi' END AS "targetType",
      r.nama_komoditas AS commodity,
      r.jumlah::text || ' ' || r.satuan AS qty,
      r.status,
      to_char(r.dibuat_pada, 'DD Mon YYYY') AS date
    FROM rfq_offtaker r
    LEFT JOIN profil_koperasi p ON p.koperasi_ref = r.koperasi_ref
    LEFT JOIN entitas_komoditas e ON e.entitas_ref = r.entitas_ref
    WHERE r.offtaker_ref = ${id}
    ORDER BY r.dibuat_pada DESC
    LIMIT 10
  `

  const transactions = await sql<{
    id: string
    koperasi: string
    commodity: string
    qty: string
    value: string
    payStatus: string
    shipStatus: string
    date: string
  }[]>`
    SELECT
      t.transaksi_ref AS id,
      coalesce(p.nama_koperasi, 'Koperasi') AS koperasi,
      t.nama_komoditas AS commodity,
      t.jumlah::text || ' kg' AS qty,
      coalesce(t.nilai::text, '0') AS value,
      coalesce(t.status_bayar, 'belum') AS "payStatus",
      coalesce(t.status_kirim, t.status, 'dijadwalkan') AS "shipStatus",
      to_char(t.tanggal, 'DD Mon YYYY') AS date
    FROM transaksi_kompak t
    LEFT JOIN profil_koperasi p ON p.koperasi_ref = t.koperasi_ref
    WHERE t.offtaker_ref = ${id} AND t.arah = 'offtaker_koperasi'
    ORDER BY t.tanggal DESC NULLS LAST
    LIMIT 10
  `

  return c.json({
    greeting: offtaker.nama,
    company: offtaker.perusahaan,
    sources,
    surplus: surplus.map((s) => ({
      ...s,
      price: formatPricePerKg(s.price),
    })),
    rfqs: rfqs.map((r) => ({
      ...r,
      targetType: r.targetType === 'produsen' ? 'produsen' : 'koperasi',
      statusLabel: r.status === 'diajukan' ? 'Menunggu' : r.status === 'diterima' ? 'Diterima' : r.status,
    })),
    transactions: transactions.map((t) => ({
      ...t,
      value: formatRupiah(Number(t.value)),
      payLabel: t.payStatus === 'lunas' ? 'Lunas' : 'Belum bayar',
      shipLabel:
        t.shipStatus === 'selesai' ? 'Selesai' : t.shipStatus === 'dalam-perjalanan' ? 'Dikirim' : 'Dijadwalkan',
    })),
  })
})

offtakerRoute.post('/rfq', async (c) => {
  const body = await c.req.json<{
    offtakerRef?: string
    koperasiRef?: string
    entitasRef?: string
    surplusRef?: string
    penawaranRef?: string
    namaKomoditas: string
    jumlah: number
    satuan?: string
    catatan?: string
  }>()

  const hasKoperasi = Boolean(body.koperasiRef)
  const hasProdusen = Boolean(body.entitasRef)

  if ((!hasKoperasi && !hasProdusen) || !body.namaKomoditas || !body.jumlah) {
    return c.json({ error: 'Pihak tujuan, komoditas, dan jumlah wajib diisi' }, 400)
  }

  const offtakerRef = body.offtakerRef || DEMO_OFFTAKER_ID
  const rfqRef = `RFQ-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

  await sql`
    INSERT INTO rfq_offtaker (
      rfq_ref, offtaker_ref, koperasi_ref, entitas_ref, surplus_ref, penawaran_ref,
      nama_komoditas, jumlah, satuan, catatan, status
    )
    VALUES (
      ${rfqRef},
      ${offtakerRef},
      ${body.koperasiRef || null},
      ${body.entitasRef || null},
      ${body.surplusRef || null},
      ${body.penawaranRef || null},
      ${body.namaKomoditas},
      ${body.jumlah},
      ${body.satuan || 'kg'},
      ${body.catatan || null},
      'diajukan'
    )
  `

  return c.json({ ok: true, rfqRef }, 201)
})

offtakerRoute.post('/surplus', async (c) => {
  const body = await c.req.json<{
    koperasiRef?: string
    namaKomoditas: string
    jumlah: number
    satuan?: string
    harga?: number
  }>()

  if (!body.namaKomoditas || !body.jumlah) {
    return c.json({ error: 'Komoditas dan jumlah wajib diisi' }, 400)
  }

  const koperasiRef = body.koperasiRef || DEMO_COOP_ID
  const surplusRef = `SPL-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

  await sql`
    INSERT INTO stok_surplus_koperasi (surplus_ref, koperasi_ref, nama_komoditas, jumlah, satuan, harga, status)
    VALUES (
      ${surplusRef},
      ${koperasiRef},
      ${body.namaKomoditas},
      ${body.jumlah},
      ${body.satuan || 'kg'},
      ${body.harga || null},
      'aktif'
    )
  `

  return c.json({ ok: true, surplusRef }, 201)
})

offtakerRoute.get('/rfq', async (c) => {
  const koperasiRef = c.req.query('koperasiRef')?.trim() || DEMO_COOP_ID

  const rfqs = await sql<{
    id: string
    offtakerName: string
    commodity: string
    qty: string
    status: string
    date: string
    note: string | null
  }[]>`
    SELECT
      r.rfq_ref AS id,
      o.nama AS "offtakerName",
      r.nama_komoditas AS commodity,
      r.jumlah::text || ' ' || r.satuan AS qty,
      r.status,
      to_char(r.dibuat_pada, 'DD Mon YYYY HH24:MI') AS date,
      r.catatan AS note
    FROM rfq_offtaker r
    JOIN offtaker o ON o.offtaker_ref = r.offtaker_ref
    WHERE r.koperasi_ref = ${koperasiRef}
    ORDER BY r.dibuat_pada DESC
    LIMIT 30
  `

  return c.json({
    rfqs: rfqs.map((r) => ({
      ...r,
      statusLabel: r.status === 'diajukan' ? 'Menunggu' : r.status === 'diterima' ? 'Diterima' : r.status,
    })),
  })
})

offtakerRoute.post('/rfq/:id/accept', async (c) => {
  const rfqRef = c.req.param('id')

  const [rfq] = await sql<{
    rfq_ref: string
    offtaker_ref: string
    koperasi_ref: string | null
    nama_komoditas: string
    jumlah: number
    status: string
    harga: number | null
  }[]>`
    SELECT r.rfq_ref, r.offtaker_ref, r.koperasi_ref, r.nama_komoditas, r.jumlah, r.status,
      s.harga
    FROM rfq_offtaker r
    LEFT JOIN stok_surplus_koperasi s ON s.surplus_ref = r.surplus_ref
    WHERE r.rfq_ref = ${rfqRef}
  `
  if (!rfq) return c.json({ error: 'Permintaan tidak ditemukan' }, 404)
  if (!rfq.koperasi_ref) return c.json({ error: 'Permintaan ke produsen belum dapat diterima dari sini' }, 400)
  if (rfq.status === 'diterima') return c.json({ error: 'Permintaan sudah diterima' }, 400)

  const [existingTx] = await sql<{ transaksi_ref: string }[]>`
    SELECT transaksi_ref FROM transaksi_kompak WHERE rfq_ref = ${rfqRef} LIMIT 1
  `
  if (existingTx) {
    return c.json({ ok: true, transaksiRef: existingTx.transaksi_ref, alreadyExists: true })
  }

  const nilai = rfq.harga ? Number(rfq.jumlah) * Number(rfq.harga) : null
  const transaksiRef = `TXK-${crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`

  await sql`
    INSERT INTO transaksi_kompak (
      transaksi_ref, koperasi_ref, offtaker_ref, rfq_ref, arah,
      nama_komoditas, jumlah, nilai, status, status_deal, status_bayar, status_kirim, tanggal
    )
    VALUES (
      ${transaksiRef},
      ${rfq.koperasi_ref},
      ${rfq.offtaker_ref},
      ${rfqRef},
      'offtaker_koperasi',
      ${rfq.nama_komoditas},
      ${rfq.jumlah},
      ${nilai},
      'dijadwalkan',
      'disepakati',
      'belum',
      'dijadwalkan',
      current_date
    )
  `

  await sql`UPDATE rfq_offtaker SET status = 'diterima' WHERE rfq_ref = ${rfqRef}`

  return c.json({ ok: true, transaksiRef }, 201)
})
