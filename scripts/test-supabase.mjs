import postgres from 'postgres'

const url = process.env.DATABASE_URL
const sql = postgres(url, { ssl: 'require', prepare: false, max: 1 })

try {
  const koperasiRows = await sql`
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
  console.log('koperasi rows', koperasiRows.length)

  const entityRows = await sql`
    SELECT e.entitas_ref AS id FROM entitas_komoditas e LIMIT 5
  `
  console.log('entity sample', entityRows.length)
} catch (err) {
  console.error('ERR', err.message)
  process.exit(1)
} finally {
  await sql.end()
}
