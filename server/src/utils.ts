export function parseCoords(raw: string | null | undefined): { lat: number; lng: number } | null {
  if (!raw?.trim()) return null
  const parts = raw.split(',').map((s) => parseFloat(s.trim()))
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
  return { lat: parts[0], lng: parts[1] }
}

export function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(x)) * 10) / 10
}

export function formatDistance(km: number): string {
  return `${km} km`
}

export function formatRupiah(n: number): string {
  return `Rp ${Math.round(n).toLocaleString('id-ID')}`
}

/** Perkiraan bounding box untuk filter koordinat sebelum haversine. */
export function bboxForRadius(lat: number, lng: number, radiusKm: number) {
  const deltaLat = radiusKm / 111
  const cosLat = Math.cos((lat * Math.PI) / 180)
  const deltaLng = radiusKm / (111 * Math.max(0.1, Math.abs(cosLat)))
  return {
    minLat: lat - deltaLat,
    maxLat: lat + deltaLat,
    minLng: lng - deltaLng,
    maxLng: lng + deltaLng,
  }
}

export const COMMODITY_KEYWORDS: Record<string, string> = {
  'gula-aren': 'Gula Aren',
  kopi: 'Kopi',
  beras: 'Beras',
  madu: 'Madu',
  sayur: 'Sayuran',
  buah: 'Buah',
  ikan: 'Ikan',
}
