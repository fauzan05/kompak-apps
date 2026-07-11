import { Hono } from 'hono'
import { sql, DEMO_COOP_ID, DEMO_PRODUCER_ID } from '../db.js'
import { formatDistance, formatRupiah, haversineKm, parseCoords, bboxForRadius } from '../utils.js'

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

  const products = await sql<{ name: string; qty: string; price: string; status: string; fotoUrl: string | null }[]>`
    SELECT
      nama_komoditas AS name,
      jumlah::text || ' ' || satuan AS qty,
      ${''} AS price,
      foto_url AS "fotoUrl",
      status
    FROM penawaran_komoditas
    WHERE entitas_ref = ${id}
    ORDER BY dibuat_pada DESC
    LIMIT 10
  `
  const productsMapped = products.map((p) => ({
    name: p.name,
    qty: p.qty,
    price: 'Aktif',
    status: p.status === 'aktif' ? 'Aktif' : 'Nonaktif',
    fotoUrl: p.fotoUrl ?? (p as { foto_url?: string | null }).foto_url ?? null,
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
    kebutuhan_ref: string
    koperasi_ref: string
    nama_koperasi: string
    nama_komoditas: string
    jumlah: number
    coords: string
    verified: boolean
  }[]>`
    SELECT kb.kebutuhan_ref, kb.koperasi_ref, p.nama_koperasi, kb.nama_komoditas, kb.jumlah,
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
      kebutuhanRef: n.kebutuhan_ref,
      type: 'koperasi',
      name: n.nama_koperasi,
      distance: formatDistance(km),
      matchScore,
      reason: `Membutuhkan ${n.jumlah} kg ${n.nama_komoditas}`,
      verified: n.verified,
      activeNeed: n.nama_komoditas,
    }
  })

  const transactions = await sql<{
    id: string
    koperasi: string
    qty: string
    date: string
    value: string
    payStatus: string
    shipStatus: string
  }[]>`
    SELECT
      t.transaksi_ref AS id,
      coalesce(p.nama_koperasi, 'Koperasi') AS koperasi,
      t.jumlah::text || ' kg ' || t.nama_komoditas AS qty,
      to_char(t.tanggal, 'DD Mon YYYY') AS date,
      coalesce(t.nilai::text, '0') AS value,
      coalesce(t.status_bayar, 'belum') AS "payStatus",
      coalesce(t.status_kirim, t.status, 'dijadwalkan') AS "shipStatus"
    FROM transaksi_kompak t
    LEFT JOIN profil_koperasi p ON p.koperasi_ref = t.koperasi_ref
    WHERE t.entitas_ref = ${id}
    ORDER BY t.tanggal DESC NULLS LAST
    LIMIT 8
  `
  const txMapped = transactions.map((t) => ({
    id: t.id,
    koperasi: t.koperasi,
    qty: t.qty,
    date: t.date,
    value: formatRupiah(Number(t.value)),
    payStatus: t.payStatus,
    payLabel: t.payStatus === 'lunas' ? 'Lunas' : 'Belum bayar',
    shipStatus: t.shipStatus,
    shipLabel:
      t.shipStatus === 'selesai' ? 'Selesai' : t.shipStatus === 'dalam-perjalanan' ? 'Dikirim' : 'Dijadwalkan',
    status:
      t.shipStatus === 'selesai' ? 'Selesai' : 'Diproses',
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
      (SELECT count(*)::int FROM transaksi_kompak WHERE koperasi_ref = ${id} AND coalesce(status_kirim, status) IN ('dijadwalkan', 'dalam-perjalanan')) AS orders,
      (SELECT count(*)::int FROM entitas_komoditas) AS producers,
      (SELECT count(*)::int FROM transaksi_kompak WHERE koperasi_ref = ${id} AND status = 'selesai' AND tanggal >= date_trunc('month', current_date)) AS tx
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

  const commodityFilter = (c.req.query('commodity') || '').trim()
  const radiusKm = Math.min(500, Math.max(1, Number(c.req.query('radiusKm')) || 50))
  const queryLat = Number(c.req.query('lat'))
  const queryLng = Number(c.req.query('lng'))
  const hasUserCoords = Number.isFinite(queryLat) && Number.isFinite(queryLng)
  const searchOrigin: [number, number] = hasUserCoords ? [queryLat, queryLng] : origin
  const bbox = bboxForRadius(searchOrigin[0], searchOrigin[1], radiusKm)

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
      AND e.koordinat_dibulatkan IS NOT NULL
      AND trim(e.koordinat_dibulatkan) <> ''
      AND trim(split_part(e.koordinat_dibulatkan, ',', 1))::float BETWEEN ${bbox.minLat} AND ${bbox.maxLat}
      AND trim(split_part(e.koordinat_dibulatkan, ',', 2))::float BETWEEN ${bbox.minLng} AND ${bbox.maxLng}
      AND (${commodityFilter} = '' OR pk.nama_komoditas ILIKE ${'%' + commodityFilter + '%'})
    ORDER BY e.rating DESC NULLS LAST
    LIMIT 200
  `

  function matchesActiveNeed(commodity: string): boolean {
    const cLower = commodity.toLowerCase()
    return needCommodities.some((need) => {
      const nLower = need.toLowerCase()
      return cLower.includes(nLower) || nLower.includes(cLower)
    })
  }

  const producersMapped = producers
    .map((p) => {
      const pos = parseCoords(p.coords)
      const km = pos ? haversineKm(searchOrigin, [pos.lat, pos.lng]) : 999
      const needBonus = matchesActiveNeed(p.commodity) ? 15 : 0
      const verifiedBonus = p.verified ? 5 : 0
      const matchScore = Math.min(99, Math.max(55, 100 - Math.round(km) + needBonus + verifiedBonus))
      return {
        id: p.id,
        type: p.type,
        name: p.name,
        commodity: p.commodity,
        qty: `${p.qty} kg`,
        distance: formatDistance(km),
        distanceKm: km,
        verified: p.verified,
        matchScore,
        price: formatRupiah(Number(p.price)),
      }
    })
    .filter((p) => p.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, 12)

  const orders = await sql<{
    id: string
    supplier: string
    commodity: string
    qty: string
    status: string
    payStatus: string
    value: string
    arah: string
    date: string
  }[]>`
    SELECT
      tk.transaksi_ref AS id,
      CASE WHEN tk.arah = 'offtaker_koperasi' THEN coalesce(of.nama, 'Offtaker')
           ELSE coalesce(e.nama, 'Pemasok') END AS supplier,
      tk.nama_komoditas AS commodity,
      tk.jumlah::text || ' kg' AS qty,
      coalesce(tk.status_kirim, tk.status, 'dijadwalkan') AS status,
      coalesce(tk.status_bayar, 'belum') AS "payStatus",
      coalesce(tk.nilai::text, '0') AS value,
      coalesce(tk.arah, 'produsen_koperasi') AS arah,
      to_char(tk.tanggal, 'DD Mon YYYY') AS date
    FROM transaksi_kompak tk
    LEFT JOIN entitas_komoditas e ON e.entitas_ref = tk.entitas_ref
    LEFT JOIN offtaker of ON of.offtaker_ref = tk.offtaker_ref
    WHERE tk.koperasi_ref = ${id}
    ORDER BY tk.tanggal DESC NULLS LAST, tk.dibuat_pada DESC NULLS LAST
    LIMIT 20
  `

  const surplus = await sql<{
    id: string
    commodity: string
    qty: string
    price: string
  }[]>`
    SELECT
      surplus_ref AS id,
      nama_komoditas AS commodity,
      jumlah::text || ' ' || satuan AS qty,
      coalesce(harga::text, '0') AS price
    FROM stok_surplus_koperasi
    WHERE koperasi_ref = ${id} AND status = 'aktif'
    ORDER BY dibuat_pada DESC
    LIMIT 10
  `

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
    WHERE r.koperasi_ref = ${id}
    ORDER BY r.dibuat_pada DESC
    LIMIT 15
  `

  const ordersMapped = orders.map((o) => ({
    ...o,
    value: formatRupiah(Number(o.value)),
    payLabel: o.payStatus === 'lunas' ? 'Lunas' : 'Belum bayar',
  }))

  const surplusMapped = surplus.map((s) => ({
    ...s,
    price: Number(s.price) > 0 ? formatRupiah(Number(s.price)) + '/kg' : '—',
  }))

  const rfqsMapped = rfqs.map((r) => ({
    ...r,
    statusLabel: r.status === 'diajukan' ? 'Menunggu' : r.status === 'diterima' ? 'Diterima' : r.status,
  }))

  return c.json({
    title: coop.name,
    location: coop.location,
    stats: [
      { label: 'Kebutuhan Aktif', value: String(counts.needs) },
      { label: 'Pesanan Berjalan', value: String(counts.orders) },
      { label: 'Produsen Terdekat', value: String(producersMapped.length) },
      { label: 'Transaksi Bulan Ini', value: String(counts.tx) },
    ],
    activeNeeds,
    producers: producersMapped,
    orders: ordersMapped,
    surplus: surplusMapped,
    rfqs: rfqsMapped,
  })
})
