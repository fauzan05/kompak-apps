import { Hono } from 'hono'
import { sql } from '../db.js'
import { formatDistance, haversineKm, parseCoords } from '../utils.js'
import { commodityImage } from '../commodityImages.js'

export interface MapPin {
  id: string
  type: string
  name: string
  commodities: string[]
  verified: boolean
  lat: number
  lng: number
  distance: string
  stock: string
  city: string
}

export const mapRoute = new Hono()

mapRoute.get('/pins', async (c) => {
  const lat = Number(c.req.query('lat') || -6.85)
  const lng = Number(c.req.query('lng') || 107.0)
  const origin: [number, number] = [lat, lng]

  const koperasiRows = await sql<{
    id: string
    name: string
    coords: string
    verified: boolean
    city: string
    commodities: string[] | null
    need_text: string | null
  }[]>`
    SELECT
      p.koperasi_ref AS id,
      p.nama_koperasi AS name,
      p.koordinat_dibulatkan AS coords,
      (p.status_registrasi = 'Approved') AS verified,
      coalesce(w.kab_kota, w.kecamatan, 'Indonesia') AS city,
      array_agg(DISTINCT k.nama_komoditas) FILTER (WHERE k.nama_komoditas IS NOT NULL) AS commodities,
      (
        SELECT 'Butuh ' || kb.jumlah::text || ' ' || kb.satuan || ' ' || kb.nama_komoditas
        FROM kebutuhan_koperasi kb
        WHERE kb.koperasi_ref = p.koperasi_ref AND kb.status = 'aktif'
        ORDER BY kb.deadline ASC NULLS LAST
        LIMIT 1
      ) AS need_text
    FROM profil_koperasi p
    LEFT JOIN referensi_koperasi_wilayah r ON r.koperasi_ref = p.koperasi_ref
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = r.kode_wilayah
    LEFT JOIN kebutuhan_koperasi k ON k.koperasi_ref = p.koperasi_ref AND k.status = 'aktif'
    WHERE p.koordinat_dibulatkan IS NOT NULL AND trim(p.koordinat_dibulatkan) <> ''
    GROUP BY p.koperasi_ref, p.nama_koperasi, p.koordinat_dibulatkan, p.status_registrasi, w.kab_kota, w.kecamatan
  `

  const entityRows = await sql<{
    id: string
    type: string
    name: string
    coords: string
    verified: boolean
    city: string
    commodities: string[] | null
    stock_text: string | null
  }[]>`
    SELECT
      e.entitas_ref AS id,
      e.tipe AS type,
      e.nama AS name,
      e.koordinat_dibulatkan AS coords,
      e.verified,
      coalesce(w.kab_kota, w.kecamatan, 'Indonesia') AS city,
      array_agg(DISTINCT pk.nama_komoditas) FILTER (WHERE pk.nama_komoditas IS NOT NULL) AS commodities,
      (
        SELECT pk2.jumlah::text || ' ' || pk2.satuan || ' tersedia'
        FROM penawaran_komoditas pk2
        WHERE pk2.entitas_ref = e.entitas_ref AND pk2.status = 'aktif'
        ORDER BY pk2.jumlah DESC NULLS LAST
        LIMIT 1
      ) AS stock_text
    FROM entitas_komoditas e
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = e.kode_wilayah
    LEFT JOIN penawaran_komoditas pk ON pk.entitas_ref = e.entitas_ref AND pk.status = 'aktif'
    WHERE e.koordinat_dibulatkan IS NOT NULL
    GROUP BY e.entitas_ref, e.tipe, e.nama, e.koordinat_dibulatkan, e.verified, w.kab_kota, w.kecamatan
  `

  const pins: MapPin[] = []

  for (const row of koperasiRows) {
    const pos = parseCoords(row.coords)
    if (!pos) continue
    const km = haversineKm(origin, [pos.lat, pos.lng])
    pins.push({
      id: row.id,
      type: 'koperasi',
      name: row.name || 'Koperasi',
      commodities: row.commodities?.filter(Boolean) ?? [],
      verified: row.verified,
      lat: pos.lat,
      lng: pos.lng,
      distance: formatDistance(km),
      stock: row.need_text || 'Kebutuhan komoditas aktif',
      city: row.city,
    })
  }

  for (const row of entityRows) {
    const pos = parseCoords(row.coords)
    if (!pos) continue
    const km = haversineKm(origin, [pos.lat, pos.lng])
    pins.push({
      id: row.id,
      type: row.type,
      name: row.name || 'Entitas',
      commodities: row.commodities?.filter(Boolean) ?? [],
      verified: row.verified,
      lat: pos.lat,
      lng: pos.lng,
      distance: formatDistance(km),
      stock: row.stock_text || 'Stok tersedia',
      city: row.city,
    })
  }

  const producers = await sql<{
    id: string
    type: string
    name: string
    commodity: string
    location: string
    rating: number
    reviews: number
    verified: boolean
    lat: number
    lng: number
  }[]>`
    SELECT
      e.entitas_ref AS id,
      e.tipe AS type,
      e.nama AS name,
      pk.nama_komoditas AS commodity,
      coalesce(w.kab_kota, w.provinsi, 'Indonesia') AS location,
      e.rating::float AS rating,
      e.rating_count AS reviews,
      e.verified,
      trim(split_part(e.koordinat_dibulatkan, ',', 1))::float AS lat,
      trim(split_part(e.koordinat_dibulatkan, ',', 2))::float AS lng
    FROM entitas_komoditas e
    JOIN penawaran_komoditas pk ON pk.entitas_ref = e.entitas_ref
    LEFT JOIN referensi_wilayah w ON w.kode_wilayah = e.kode_wilayah
    WHERE e.verified = true
    ORDER BY e.rating DESC NULLS LAST
    LIMIT 8
  `

  const producerCards = producers.map((p) => {
    const km = haversineKm(origin, [p.lat, p.lng])
    return {
      id: p.id,
      type: p.type || 'produsen',
      name: p.name,
      commodity: p.commodity,
      location: p.location,
      rating: Number(p.rating),
      reviews: p.reviews,
      distance: `${km} km`,
      badge: p.verified ? 'Terverifikasi' : 'Baru',
      img: commodityImage(p.commodity, 'card'),
      tags: [p.commodity.split(' ')[0]],
    }
  })

  return c.json({ pins, producerCards })
})

mapRoute.get('/cities', async (c) => {
  const q = (c.req.query('q') || '').toLowerCase()
  const rows = await sql<{ name: string; province: string; lat: number; lng: number }[]>`
    SELECT
      w.kab_kota AS name,
      w.provinsi AS province,
      avg(trim(split_part(p.koordinat_dibulatkan, ',', 1))::float) AS lat,
      avg(trim(split_part(p.koordinat_dibulatkan, ',', 2))::float) AS lng
    FROM referensi_wilayah w
    JOIN referensi_koperasi_wilayah r ON r.kode_wilayah = w.kode_wilayah
    JOIN profil_koperasi p ON p.koperasi_ref = r.koperasi_ref
    WHERE p.koordinat_dibulatkan IS NOT NULL
      AND w.kab_kota IS NOT NULL
      AND (${q} = '' OR lower(w.kab_kota) LIKE ${'%' + q + '%'} OR lower(w.provinsi) LIKE ${'%' + q + '%'})
    GROUP BY w.kab_kota, w.provinsi
    ORDER BY w.kab_kota
    LIMIT 20
  `
  return c.json({ cities: rows })
})
