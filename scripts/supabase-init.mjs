#!/usr/bin/env node
/**
 * Inisialisasi skema + seed KOMPAK ke Supabase Postgres.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npm run db:supabase-init
 *
 * Atau salin POSTGRES_URL dari integrasi Supabase → Vercel.
 */
import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import postgres from 'postgres'
import { config } from 'dotenv'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
config({ path: join(root, '.env') })

const url =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.POSTGRES_URL_NON_POOLING

if (!url) {
  console.error('Set DATABASE_URL atau POSTGRES_URL sebelum menjalankan skrip ini.')
  process.exit(1)
}

const baseSqlFiles = [
  'db/docker-init/01_schema.sql',
  'db/referensi_dokumen_koperasi.sql',
  'db/referensi_gerai_koperasi.sql',
  'db/referensi_wilayah.sql',
  'db/referensi_komoditas_desa.sql',
  'db/referensi_koperasi_wilayah.sql',
  'db/referensi_profil_desa.sql',
  'db/profil_koperasi.sql',
  'db/akun_bank_koperasi.sql',
  'db/aset_koperasi.sql',
  'db/dokumen_koperasi.sql',
  'db/gerai_koperasi.sql',
  'db/karyawan_koperasi.sql',
  'db/kbli_koperasi.sql',
  'db/modal_koperasi.sql',
  'db/pengajuan_domain.sql',
  'db/pengajuan_kemitraan.sql',
  'db/pengajuan_pembiayaan.sql',
  'db/pengurus_koperasi.sql',
  'db/produk_koperasi.sql',
  'db/rat_koperasi.sql',
  'db/anggota_koperasi.sql',
  'db/transaksi_penjualan.sql',
  'db/simpanan_anggota.sql',
  'db/inventaris_produk.sql',
  'db/barang_masuk_produk.sql',
  'db/barang_keluar_produk.sql',
]

const kompakSqlFiles = [
  'db/docker-init/03_kompak_entities.sql',
  'db/docker-init/04_kompak_seed.sql',
  'db/migrations/05_respon_penawaran.sql',
  'db/migrations/06_transaksi_offtaker.sql',
  'db/migrations/07_penawaran_foto.sql',
  'db/migrations/08_rfq_produsen.sql',
]

async function tableExists(sql, name) {
  const [{ exists }] = await sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = ${name}
    ) AS exists
  `
  return exists
}

async function runFiles(sql, files) {
  for (const rel of files) {
    const path = join(root, rel)
    if (!existsSync(path)) {
      throw new Error(`File tidak ditemukan: ${rel}`)
    }
    const content = readFileSync(path, 'utf8')
    process.stdout.write(`  → ${rel} ... `)
    await sql.unsafe(content)
    console.log('ok')
  }
}

async function main() {
  const isSupabase = url.includes('supabase.com')
  const sql = postgres(url, {
    max: 1,
    prepare: false,
    ssl: isSupabase ? 'require' : false,
  })

  try {
    const hasBase = await tableExists(sql, 'profil_koperasi')
    const hasKompak = await tableExists(sql, 'entitas_komoditas')

    if (hasBase && hasKompak) {
      const [counts] = await sql`
        SELECT
          (SELECT count(*)::int FROM profil_koperasi) AS koperasi,
          (SELECT count(*)::int FROM entitas_komoditas) AS entitas
      `
      console.log(`Sudah lengkap. Koperasi: ${counts.koperasi}, Entitas: ${counts.entitas}`)
      return
    }

    if (!hasBase) {
      console.log(`Menjalankan ${baseSqlFiles.length} file SQL dasar...`)
      await runFiles(sql, baseSqlFiles)
    } else {
      console.log('Tabel dasar sudah ada — lewati seed koperasi.')
    }

    if (!hasKompak) {
      console.log(`Menjalankan ${kompakSqlFiles.length} file SQL KOMPAK...`)
      await runFiles(sql, kompakSqlFiles)
    }

    const [counts] = await sql`
      SELECT
        (SELECT count(*)::int FROM profil_koperasi) AS koperasi,
        (SELECT count(*)::int FROM entitas_komoditas) AS entitas
    `
    console.log(`\nSelesai. Koperasi: ${counts.koperasi}, Entitas: ${counts.entitas}`)
  } finally {
    await sql.end()
  }
}

main().catch((err) => {
  console.error('\nGagal:', err.message || err)
  process.exit(1)
})
