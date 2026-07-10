import type {
  CitySuggestion,
  CoopDashboardData,
  EntityDetailData,
  KomoditasItem,
  LandingStat,
  MapPin,
  ProducerCard,
  ProducerDashboardData,
} from './types'

const BASE = '/api'

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`API ${path} gagal (${res.status})`)
  return res.json() as Promise<T>
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(err.error || `API ${path} gagal (${res.status})`)
  }
  return res.json() as Promise<T>
}

export const DEMO_PRODUCER_ID = import.meta.env.VITE_DEMO_PRODUCER_ID || 'ENT-DEMO-PRODUCER-001'
export const DEMO_COOP_ID = import.meta.env.VITE_DEMO_COOP_ID || 'KOP-02AFA0134DB2'

export function fetchStats() {
  return getJson<{ stats: LandingStat[] }>('/stats').then((r) => r.stats)
}

export function fetchCommodities() {
  return getJson<{ komoditas: KomoditasItem[] }>('/commodities').then((r) => r.komoditas)
}

export function fetchMapPins(lat = -6.85, lng = 107.0) {
  return getJson<{ pins: MapPin[]; producerCards: ProducerCard[] }>(
    `/map/pins?lat=${lat}&lng=${lng}`,
  )
}

export function fetchCities(q = '') {
  return getJson<{ cities: CitySuggestion[] }>(`/map/cities?q=${encodeURIComponent(q)}`).then(
    (r) => r.cities,
  )
}

export function fetchEntity(type: string, id: string) {
  return getJson<EntityDetailData>(`/entities/${type}/${id}`)
}

export function fetchProducerDashboard(id = DEMO_PRODUCER_ID) {
  return getJson<ProducerDashboardData>(`/dashboard/producer/${id}`)
}

export function fetchCoopDashboard(id = DEMO_COOP_ID) {
  return getJson<CoopDashboardData>(`/dashboard/coop/${id}`)
}

export function submitProduct(payload: {
  namaKomoditas: string
  jumlah: number
  satuan?: string
  harga?: number
  namaEntitas?: string
  tipeEntitas?: 'produsen' | 'komunitas'
  telepon?: string
  entitasRef?: string
}) {
  return postJson<{ ok: boolean; entitasRef: string; penawaranRef: string }>('/products', payload)
}
