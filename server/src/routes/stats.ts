import { Hono } from 'hono'
import { sql } from '../db.js'

export const statsRoute = new Hono()

statsRoute.get('/', async (c) => {
  const [row] = await sql<{
    produsen: number
    koperasi: number
    komunitas: number
    transaksi_nilai: string
    komoditas: number
  }[]>`
    SELECT
      (SELECT count(*)::int FROM entitas_komoditas WHERE tipe = 'produsen') AS produsen,
      (SELECT count(*)::int FROM profil_koperasi WHERE koordinat_dibulatkan IS NOT NULL) AS koperasi,
      (SELECT count(*)::int FROM entitas_komoditas WHERE tipe = 'komunitas') AS komunitas,
      coalesce((SELECT sum(nilai) FROM transaksi_kompak), 0)::text AS transaksi_nilai,
      (SELECT count(DISTINCT nama_komoditas)::int FROM penawaran_komoditas) AS komoditas
  `

  const nilai = Number(row.transaksi_nilai)
  const nilaiLabel = nilai >= 1_000_000
    ? `Rp ${(nilai / 1_000_000).toFixed(1).replace('.0', '')}M`
    : `Rp ${nilai.toLocaleString('id-ID')}`

  return c.json({
    stats: [
      {
        value: (row.produsen + row.komunitas).toLocaleString('id-ID'),
        label: 'Produsen Terdaftar',
        sub: 'individu & komunitas',
      },
      { value: row.koperasi.toLocaleString('id-ID'), label: 'Koperasi Aktif', sub: 'terpetakan di peta' },
      { value: nilaiLabel, label: 'Nilai Transaksi', sub: 'data KOMPAK' },
      { value: String(row.komoditas), label: 'Komoditas', sub: 'terpetakan real-time' },
    ],
  })
})
