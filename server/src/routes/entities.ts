import { Hono } from 'hono'
import { sql } from '../db.js'
import { formatRupiah, parseCoords } from '../utils.js'

export const entitiesRoute = new Hono()

entitiesRoute.get('/:type/:id', async (c) => {
  const type = c.req.param('type')
  const id = c.req.param('id')

  if (type === 'koperasi') {
    const [row] = await sql<{
      id: string
      name: string
      about: string | null
      location: string
      phone: string | null
      verified: boolean
      lat: number
      lng: number
      city: string
      rating: number
      rating_count: number
      transactions: number
    }[]>`
      SELECT
        p.koperasi_ref AS id,
        p.nama_koperasi AS name,
        p.tentang_koperasi AS about,
        coalesce(p.alamat_lengkap, w.desa_kelurahan || ', ' || w.kab_kota) AS location,
        pg.no_hp AS phone,
        (p.status_registrasi = 'Approved') AS verified,
        trim(split_part(p.koordinat_dibulatkan, ',', 1))::float AS lat,
        trim(split_part(p.koordinat_dibulatkan, ',', 2))::float AS lng,
        coalesce(w.kab_kota, 'Indonesia') AS city,
        4.8::float AS rating,
        50 AS rating_count,
        (SELECT count(*)::int FROM transaksi_penjualan t WHERE t.koperasi_ref = p.koperasi_ref) AS transactions
      FROM profil_koperasi p
      LEFT JOIN referensi_koperasi_wilayah r ON r.koperasi_ref = p.koperasi_ref
      LEFT JOIN referensi_wilayah w ON w.kode_wilayah = r.kode_wilayah
      LEFT JOIN pengurus_koperasi pg ON pg.koperasi_ref = p.koperasi_ref
      WHERE p.koperasi_ref = ${id}
      LIMIT 1
    `
    if (!row) return c.json({ error: 'Entitas tidak ditemukan' }, 404)

    const products = await sql<{ name: string; qty: string; price: string }[]>`
      SELECT
        kb.nama_komoditas AS name,
        'Butuh ' || kb.jumlah::text || ' ' || kb.satuan AS qty,
        'Penawaran terbuka' AS price
      FROM kebutuhan_koperasi kb
      WHERE kb.koperasi_ref = ${id} AND kb.status = 'aktif'
      UNION ALL
      SELECT
        pr.nama_produk AS name,
        coalesce(inv.stok::text, '0') || ' ' || coalesce(pr.unit, 'unit') AS qty,
        'Stok koperasi' AS price
      FROM produk_koperasi pr
      LEFT JOIN inventaris_produk inv ON inv.produk_sample_id = pr.produk_sample_id
      WHERE pr.koperasi_ref = ${id}
      LIMIT 8
    `

    const recentTx = await sql<{ party: string; date: string; qty: string }[]>`
      SELECT
        coalesce(t.nama_pelanggan, 'Pelanggan') AS party,
        to_char(t.tanggal_dibuat, 'DD Mon YYYY') AS date,
        t.total_pembayaran::text || ' total' AS qty
      FROM transaksi_penjualan t
      WHERE t.koperasi_ref = ${id}
      ORDER BY t.tanggal_dibuat DESC NULLS LAST
      LIMIT 5
    `

    return c.json({
      type: 'koperasi',
      id: row.id,
      name: row.name,
      location: row.location,
      phone: row.phone || '—',
      rating: row.rating,
      ratingCount: row.rating_count,
      transactions: row.transactions,
      about: row.about || 'Koperasi Desa/Kelurahan Merah Putih yang menyerap komoditas unggulan desa.',
      verified: row.verified,
      lat: row.lat,
      lng: row.lng,
      city: row.city,
      commodities: products,
      recentTx,
      addedValue: [],
    })
  }

  const [row] = await sql<{
    id: string
    type: string
    name: string
    about: string | null
    location: string
    phone: string | null
    verified: boolean
    lat: number
    lng: number
    city: string
    rating: number
    rating_count: number
    transactions: number
  }[]>`
    SELECT
      e.entitas_ref AS id,
      e.tipe AS type,
      e.nama AS name,
      e.tentang AS about,
      coalesce(w.desa_kelurahan || ', ' || w.kab_kota, w.kab_kota, 'Indonesia') AS location,
      e.telepon AS phone,
      e.verified,
      trim(split_part(e.koordinat_dibulatkan, ',', 1))::float AS lat,
      trim(split_part(e.koordinat_dibulatkan, ',', 2))::float AS lng,
      coalesce(w.kab_kota, 'Indonesia') AS city,
      e.rating::float AS rating,
      e.rating_count,
      (SELECT count(*)::int FROM transaksi_kompak t WHERE t.entitas_ref = e.entitas_ref) AS transactions
    FROM entitas_komoditas e
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = e.kode_wilayah
    WHERE e.entitas_ref = ${id}
    LIMIT 1
  `
  if (!row) return c.json({ error: 'Entitas tidak ditemukan' }, 404)

  const products = await sql<{ name: string; jumlah: number; harga: number; satuan: string }[]>`
    SELECT nama_komoditas AS name, jumlah, harga, satuan
    FROM penawaran_komoditas
    WHERE entitas_ref = ${id} AND status = 'aktif'
  `

  const commodities = products.map((p) => ({
    name: p.name,
    qty: `${p.jumlah} ${p.satuan} tersedia`,
    price: formatRupiah(Number(p.harga)),
  }))

  const recentTx = await sql<{ party: string; date: string; qty: string }[]>`
    SELECT
      coalesce(p.nama_koperasi, 'Koperasi') AS party,
      to_char(t.tanggal, 'DD Mon YYYY') AS date,
      t.jumlah::text || ' kg ' || t.nama_komoditas AS qty
    FROM transaksi_kompak t
    LEFT JOIN profil_koperasi p ON p.koperasi_ref = t.koperasi_ref
    WHERE t.entitas_ref = ${id}
    ORDER BY t.tanggal DESC NULLS LAST
    LIMIT 5
  `

  const coords = parseCoords(`${row.lat}, ${row.lng}`)

  return c.json({
    type: row.type,
    id: row.id,
    name: row.name,
    location: row.location,
    phone: row.phone || '—',
    rating: Number(row.rating),
    ratingCount: row.rating_count,
    transactions: row.transactions,
    about: row.about || 'Produsen komoditas lokal terdaftar di KOMPAK.',
    verified: row.verified,
    lat: coords?.lat ?? row.lat,
    lng: coords?.lng ?? row.lng,
    city: row.city,
    commodities,
    recentTx,
    addedValue: row.type === 'produsen'
      ? ['Komoditas dapat diolah menjadi produk bernilai tambah untuk meningkatkan margin.']
      : [],
  })
})
