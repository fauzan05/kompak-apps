import { Hono } from 'hono'
import { sql, DEMO_COOP_ID, DEMO_PRODUCER_ID } from '../db.js'
import { formatDistance, formatRupiah, haversineKm, parseCoords } from '../utils.js'

export const dashboardRoute = new Hono()

dashboardRoute.get('/producer/:id', async (c) => {
  const id = c.req.param('id') || DEMO_PRODUCER_ID

  const [entity] = await sql<{
    name: string
    location: string
    lat: number
    lng: number
  }[]>`
    SELECT e.nama AS name,
      coalesce(w.kab_kota, 'Indonesia') AS location,
      trim(split_part(e.koordinat_dibulatkan, ',', 1))::float AS lat,
      trim(split_part(e.koordinat_dibulatkan, ',', 2))::float AS lng
    FROM entitas_komoditas e
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = e.kode_wilayah
    WHERE e.entitas_ref = ${id}
  `
  if (!entity) return c.json({ error: 'Produsen tidak ditemukan' }, 404)

  const origin: [number, number] = [entity.lat, entity.lng]

  const products = await sql<{ name: string; qty: string; price: string; status: string }[]>`
    SELECT
      nama_komoditas AS name,
      jumlah::text || ' ' || satuan AS qty,
      ${''} AS price,
      status
    FROM penawaran_komoditas
    WHERE entitas_ref = ${id}
    ORDER BY dibuat_pada DESC
    LIMIT 10
  `
  const productsMapped = products.map((p) => ({
    ...p,
    price: 'Aktif',
    status: p.status === 'aktif' ? 'Aktif' : 'Nonaktif',
  }))

  const [metrics] = await sql<{ active: number; tx: number; revenue: number }[]>`
    SELECT
      (SELECT count(*)::int FROM penawaran_komoditas WHERE entitas_ref = ${id} AND status = 'aktif') AS active,
      (SELECT count(*)::int FROM transaksi_kompak WHERE entitas_ref = ${id}) AS tx,
      coalesce((SELECT sum(nilai) FROM transaksi_kompak WHERE entitas_ref = ${id}), 0)::float AS revenue
  `

  const offers = await sql<{ nama_komoditas: string }[]>`
    SELECT DISTINCT nama_komoditas FROM penawaran_komoditas WHERE entitas_ref = ${id}
  `
  const commodityNames = offers.map((o) => o.nama_komoditas)

  const needs = await sql<{
    koperasi_ref: string
    nama_koperasi: string
    nama_komoditas: string
    jumlah: number
    coords: string
    verified: boolean
  }[]>`
    SELECT kb.koperasi_ref, p.nama_koperasi, kb.nama_komoditas, kb.jumlah,
      p.koordinat_dibulatkan AS coords, (p.status_registrasi = 'Approved') AS verified
    FROM kebutuhan_koperasi kb
    JOIN profil_koperasi p ON p.koperasi_ref = kb.koperasi_ref
    WHERE kb.status = 'aktif'
      AND (${commodityNames.length} = 0 OR kb.nama_komoditas = ANY(${commodityNames}))
    ORDER BY kb.deadline ASC NULLS LAST
    LIMIT 10
  `

  const recommendations = needs.map((n) => {
    const pos = parseCoords(n.coords)
    const km = pos ? haversineKm(origin, [pos.lat, pos.lng]) : 99
    const matchScore = Math.max(60, 100 - Math.round(km))
    return {
      id: n.koperasi_ref,
      type: 'koperasi',
      name: n.nama_koperasi,
      distance: formatDistance(km),
      matchScore,
      reason: `Membutuhkan ${n.jumlah} kg ${n.nama_komoditas}`,
      verified: n.verified,
      activeNeed: n.nama_komoditas,
    }
  })

  const transactions = await sql<{ koperasi: string; qty: string; date: string; value: string; status: string }[]>`
    SELECT
      coalesce(p.nama_koperasi, 'Koperasi') AS koperasi,
      t.jumlah::text || ' kg ' || t.nama_komoditas AS qty,
      to_char(t.tanggal, 'DD Mon YYYY') AS date,
      t.nilai::text AS value,
      t.status
    FROM transaksi_kompak t
    LEFT JOIN profil_koperasi p ON p.koperasi_ref = t.koperasi_ref
    WHERE t.entitas_ref = ${id}
    ORDER BY t.tanggal DESC NULLS LAST
    LIMIT 8
  `
  const txMapped = transactions.map((t) => ({
    ...t,
    value: formatRupiah(Number(t.value)),
    status: t.status === 'selesai' ? 'Selesai' : 'Diproses',
  }))

  return c.json({
    greeting: entity.name,
    location: entity.location,
    metrics: [
      { label: 'Produk Aktif', value: String(metrics.active) },
      { label: 'Transaksi', value: String(metrics.tx) },
      { label: 'Pendapatan', value: formatRupiah(metrics.revenue) },
    ],
    recommendations,
    products: productsMapped,
    transactions: txMapped,
  })
})

dashboardRoute.get('/coop/:id', async (c) => {
  const id = c.req.param('id') || DEMO_COOP_ID

  const [coop] = await sql<{ name: string; location: string; lat: number; lng: number }[]>`
    SELECT p.nama_koperasi AS name,
      coalesce(w.kab_kota, 'Indonesia') AS location,
      trim(split_part(p.koordinat_dibulatkan, ',', 1))::float AS lat,
      trim(split_part(p.koordinat_dibulatkan, ',', 2))::float AS lng
    FROM profil_koperasi p
    LEFT JOIN referensi_koperasi_wilayah r ON r.koperasi_ref = p.koperasi_ref
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = r.kode_wilayah
    WHERE p.koperasi_ref = ${id}
  `
  if (!coop) return c.json({ error: 'Koperasi tidak ditemukan' }, 404)

  const origin: [number, number] = [coop.lat, coop.lng]

  const [counts] = await sql<{ needs: number; orders: number; producers: number; tx: number }[]>`
    SELECT
      (SELECT count(*)::int FROM kebutuhan_koperasi WHERE koperasi_ref = ${id} AND status = 'aktif') AS needs,
      (SELECT count(*)::int FROM transaksi_penjualan WHERE koperasi_ref = ${id}) AS orders,
      (SELECT count(*)::int FROM entitas_komoditas) AS producers,
      (SELECT count(*)::int FROM transaksi_kompak WHERE koperasi_ref = ${id}) AS tx
  `

  const activeNeeds = await sql<{
    id: string
    commodity: string
    qty: string
    deadline: string
    responses: number
    daysLeft: number
  }[]>`
    SELECT
      kebutuhan_ref AS id,
      nama_komoditas AS commodity,
      jumlah::text || ' ' || satuan AS qty,
      to_char(deadline, 'DD Mon YYYY') AS deadline,
      jumlah_respon AS responses,
      greatest(0, (deadline - current_date))::int AS "daysLeft"
    FROM kebutuhan_koperasi
    WHERE koperasi_ref = ${id} AND status = 'aktif'
    ORDER BY deadline ASC NULLS LAST
    LIMIT 10
  `

  const needCommodities = activeNeeds.map((n) => n.commodity)

  const producers = await sql<{
    id: string
    name: string
    type: string
    commodity: string
    qty: number
    coords: string
    verified: boolean
    price: number
  }[]>`
    SELECT e.entitas_ref AS id, e.nama AS name, e.tipe AS type,
      pk.nama_komoditas AS commodity, pk.jumlah AS qty,
      e.koordinat_dibulatkan AS coords, e.verified, pk.harga AS price
    FROM entitas_komoditas e
    JOIN penawaran_komoditas pk ON pk.entitas_ref = e.entitas_ref
    WHERE pk.status = 'aktif'
      AND (${needCommodities.length} = 0 OR pk.nama_komoditas = ANY(${needCommodities}))
    ORDER BY e.rating DESC NULLS LAST
    LIMIT 12
  `

  const producersMapped = producers.map((p) => {
    const pos = parseCoords(p.coords)
    const km = pos ? haversineKm(origin, [pos.lat, pos.lng]) : 50
    return {
      id: p.id,
      type: p.type,
      name: p.name,
      commodity: p.commodity,
      qty: `${p.qty} kg`,
      distance: formatDistance(km),
      verified: p.verified,
      matchScore: Math.max(55, 100 - Math.round(km)),
      price: formatRupiah(Number(p.price)),
    }
  })

  const orders = await sql<{ supplier: string; commodity: string; qty: string; status: string; date: string }[]>`
  (
    SELECT
      coalesce(e.nama, 'Pemasok') AS supplier,
      tk.nama_komoditas AS commodity,
      tk.jumlah::text || ' kg' AS qty,
      tk.status AS status,
      to_char(tk.tanggal, 'DD Mon YYYY') AS date
    FROM transaksi_kompak tk
    LEFT JOIN entitas_komoditas e ON e.entitas_ref = tk.entitas_ref
    WHERE tk.koperasi_ref = ${id}
  )
  UNION ALL
  (
    SELECT
      coalesce(t.nama_pelanggan, 'Pelanggan') AS supplier,
      'Penjualan' AS commodity,
      t.total_pembayaran::text AS qty,
      coalesce(t.status_transaksi, 'Selesai') AS status,
      to_char(t.tanggal_dibuat, 'DD Mon YYYY') AS date
    FROM transaksi_penjualan t
    WHERE t.koperasi_ref = ${id}
  )
  ORDER BY date DESC NULLS LAST
  LIMIT 8
  `

  return c.json({
    title: coop.name,
    location: coop.location,
    stats: [
      { label: 'Kebutuhan Aktif', value: String(counts.needs) },
      { label: 'Pesanan', value: String(counts.orders) },
      { label: 'Produsen Terdekat', value: String(producersMapped.length) },
      { label: 'Transaksi', value: String(counts.tx + counts.orders) },
    ],
    activeNeeds,
    producers: producersMapped,
    orders,
  })
})
