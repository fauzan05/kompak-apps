import { computed, ref } from 'vue'

const STORAGE_KEY = 'kompak:last-location'

const DEFAULT_LAT = -6.2
const DEFAULT_LNG = 106.82

const lat = ref(DEFAULT_LAT)
const lng = ref(DEFAULT_LNG)
const status = ref<'idle' | 'loading' | 'ready' | 'denied' | 'error'>('idle')
const usingGps = ref(false)
const errorMessage = ref('')

let initialized = false

function loadCached() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as { lat: number; lng: number; ts: number }
    if (Date.now() - parsed.ts < 30 * 60 * 1000) {
      lat.value = parsed.lat
      lng.value = parsed.lng
      usingGps.value = true
      status.value = 'ready'
    }
  } catch {
    /* ignore */
  }
}

function saveCache() {
  try {
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ lat: lat.value, lng: lng.value, ts: Date.now() }),
    )
  } catch {
    /* ignore */
  }
}

export function useGeolocation() {
  function init() {
    if (initialized) return
    initialized = true
    loadCached()
    if (status.value !== 'ready') requestLocation()
  }

  function requestLocation(): Promise<boolean> {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      status.value = 'error'
      errorMessage.value = 'Peramban tidak mendukung GPS'
      return Promise.resolve(false)
    }

    status.value = 'loading'
    errorMessage.value = ''

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          lat.value = pos.coords.latitude
          lng.value = pos.coords.longitude
          usingGps.value = true
          status.value = 'ready'
          saveCache()
          resolve(true)
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            status.value = 'denied'
            errorMessage.value = 'Izin lokasi ditolak'
          } else {
            status.value = 'error'
            errorMessage.value = 'Gagal mendapatkan lokasi GPS'
          }
          usingGps.value = false
          resolve(false)
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 },
      )
    })
  }

  const coords = computed((): [number, number] => [lat.value, lng.value])
  const label = computed(() => {
    if (status.value === 'loading') return 'Mencari lokasi…'
    if (usingGps.value) return 'Lokasi Anda'
    if (status.value === 'denied') return 'Lokasi default'
    return 'Lokasi default'
  })

  return {
    lat,
    lng,
    coords,
    status,
    usingGps,
    errorMessage,
    label,
    init,
    requestLocation,
  }
}
