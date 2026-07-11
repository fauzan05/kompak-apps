#!/usr/bin/env node
/**
 * Verifikasi endpoint API (lokal atau production).
 *
 * Usage:
 *   node scripts/verify-api.mjs
 *   API_BASE=https://kompak-apps.vercel.app node scripts/verify-api.mjs
 */
const base = (process.env.API_BASE || 'http://localhost:3001').replace(/\/$/, '')

async function check(path, label) {
  const url = `${base}${path}`
  const res = await fetch(url)
  const text = await res.text()
  let body
  try {
    body = JSON.parse(text)
  } catch {
    body = text.slice(0, 200)
  }

  if (!res.ok) {
    throw new Error(`${label} gagal (${res.status}): ${JSON.stringify(body)}`)
  }

  console.log(`✓ ${label}`)
  return body
}

async function main() {
  console.log(`Memeriksa API di ${base}\n`)

  await check('/api/health', 'GET /api/health')

  const pins = await check('/api/map/pins?lat=-6.85&lng=107', 'GET /api/map/pins')
  const count = Array.isArray(pins.pins) ? pins.pins.length : 0
  console.log(`  → ${count} pin ditemukan`)

  if (count === 0) {
    console.warn('\n⚠ Peta akan kosong jika pin = 0. Jalankan: npm run db:supabase-init')
  } else {
    console.log('\nAPI siap — peta seharusnya menampilkan data.')
  }
}

main().catch((err) => {
  console.error(`\n✗ ${err.message}`)
  process.exit(1)
})
