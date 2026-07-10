<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import { Button } from '@/components/ui'
import {
  Search, Filter, Plus, X, Store, Sprout, Users, ChevronRight,
  Navigation, ShieldCheck, AlertCircle, Layers,
} from 'lucide-vue-next'

const emit = defineEmits<{ navigate: [view: string, data?: unknown] }>()

const commodityFilters = [
  { id: 'all', label: 'Semua' },
  { id: 'gula-aren', label: 'Gula Aren' },
  { id: 'kopi', label: 'Kopi' },
  { id: 'beras', label: 'Beras Organik' },
  { id: 'madu', label: 'Madu' },
  { id: 'sayur', label: 'Sayuran' },
  { id: 'buah', label: 'Buah-buahan' },
  { id: 'ikan', label: 'Ikan' },
]

const radiusOptions = ['5 km', '10 km', '25 km', '50 km']
const USER_LOCATION: [number, number] = [-6.85, 107.0]

interface City { name: string; province: string; lat: number; lng: number }
const cities: City[] = [
  { name: 'Banda Aceh', province: 'Aceh', lat: 5.55, lng: 95.32 },
  { name: 'Medan', province: 'Sumatra Utara', lat: 3.59, lng: 98.67 },
  { name: 'Padang', province: 'Sumatra Barat', lat: -0.95, lng: 100.35 },
  { name: 'Pekanbaru', province: 'Riau', lat: 0.51, lng: 101.44 },
  { name: 'Jambi', province: 'Jambi', lat: -1.61, lng: 103.61 },
  { name: 'Palembang', province: 'Sumatra Selatan', lat: -2.99, lng: 104.76 },
  { name: 'Bengkulu', province: 'Bengkulu', lat: -3.80, lng: 102.26 },
  { name: 'Bandar Lampung', province: 'Lampung', lat: -5.43, lng: 105.26 },
  { name: 'Jakarta', province: 'DKI Jakarta', lat: -6.21, lng: 106.85 },
  { name: 'Bogor', province: 'Jawa Barat', lat: -6.60, lng: 106.80 },
  { name: 'Sukabumi', province: 'Jawa Barat', lat: -6.92, lng: 106.93 },
  { name: 'Bandung', province: 'Jawa Barat', lat: -6.92, lng: 107.61 },
  { name: 'Cirebon', province: 'Jawa Barat', lat: -6.73, lng: 108.55 },
  { name: 'Tasikmalaya', province: 'Jawa Barat', lat: -7.33, lng: 108.22 },
  { name: 'Semarang', province: 'Jawa Tengah', lat: -6.97, lng: 110.42 },
  { name: 'Solo', province: 'Jawa Tengah', lat: -7.57, lng: 110.83 },
  { name: 'Yogyakarta', province: 'DI Yogyakarta', lat: -7.80, lng: 110.36 },
  { name: 'Surabaya', province: 'Jawa Timur', lat: -7.26, lng: 112.75 },
  { name: 'Malang', province: 'Jawa Timur', lat: -7.98, lng: 112.63 },
  { name: 'Kediri', province: 'Jawa Timur', lat: -7.82, lng: 112.01 },
  { name: 'Jember', province: 'Jawa Timur', lat: -8.17, lng: 113.70 },
  { name: 'Denpasar', province: 'Bali', lat: -8.65, lng: 115.22 },
  { name: 'Mataram', province: 'NTB', lat: -8.58, lng: 116.12 },
  { name: 'Kupang', province: 'NTT', lat: -10.18, lng: 123.61 },
  { name: 'Pontianak', province: 'Kalimantan Barat', lat: -0.02, lng: 109.34 },
  { name: 'Palangkaraya', province: 'Kalimantan Tengah', lat: -2.21, lng: 113.92 },
  { name: 'Banjarmasin', province: 'Kalimantan Selatan', lat: -3.32, lng: 114.59 },
  { name: 'Samarinda', province: 'Kalimantan Timur', lat: -0.50, lng: 117.15 },
  { name: 'Balikpapan', province: 'Kalimantan Timur', lat: -1.24, lng: 116.85 },
  { name: 'Makassar', province: 'Sulawesi Selatan', lat: -5.15, lng: 119.42 },
  { name: 'Palu', province: 'Sulawesi Tengah', lat: -0.90, lng: 119.87 },
  { name: 'Kendari', province: 'Sulawesi Tenggara', lat: -3.99, lng: 122.51 },
  { name: 'Manado', province: 'Sulawesi Utara', lat: 1.47, lng: 124.84 },
  { name: 'Gorontalo', province: 'Gorontalo', lat: 0.54, lng: 123.06 },
  { name: 'Ambon', province: 'Maluku', lat: -3.70, lng: 128.18 },
  { name: 'Ternate', province: 'Maluku Utara', lat: 0.79, lng: 127.38 },
  { name: 'Sorong', province: 'Papua Barat Daya', lat: -0.88, lng: 131.25 },
  { name: 'Manokwari', province: 'Papua Barat', lat: -0.86, lng: 134.06 },
  { name: 'Jayapura', province: 'Papua', lat: -2.53, lng: 140.72 },
]

const COMMODITY_POOL = [
  'Gula Aren', 'Kopi Robusta', 'Kopi Arabika', 'Beras Organik', 'Sayuran',
  'Buah-buahan', 'Madu Hutan', 'Ikan', 'Rumput Laut', 'Sagu', 'Kelapa',
  'Cengkeh', 'Pala', 'Kakao', 'Vanili', 'Jagung',
]
const PRODUCER_NAMES = ['Pak Budi', 'Bu Sari', 'Pak Ahmad', 'Bu Ketut', 'Pak Yohanes', 'Pak Rahman', 'Bu Wayan', 'Pak Joko', 'Bu Ani', 'Pak Made']

function hashStr(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

function haversineKm(a: [number, number], b: [number, number]) {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(b[0] - a[0])
  const dLng = toRad(b[1] - a[1])
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2
  return Math.round(2 * R * Math.asin(Math.sqrt(x)))
}

export interface PinData {
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

function generateEntities(city: City): PinData[] {
  const seed = hashStr(city.name)
  const count = 3 + (seed % 4)
  const out: PinData[] = []
  const types = ['koperasi', 'produsen', 'komunitas']
  for (let i = 0; i < count; i++) {
    const s = hashStr(city.name + i)
    const type = types[s % 3]
    const lat = city.lat + ((s % 100) / 100 - 0.5) * 0.14
    const lng = city.lng + (((s >> 3) % 100) / 100 - 0.5) * 0.14
    const c1 = COMMODITY_POOL[s % COMMODITY_POOL.length] ?? ''
    const c2 = COMMODITY_POOL[(s >> 5) % COMMODITY_POOL.length] ?? ''
    const commodities = (c1 === c2 ? [c1] : [c1, c2]).filter(Boolean)
    const verified = s % 3 !== 0
    const km = haversineKm(USER_LOCATION, [lat, lng])
    let name: string
    let stock: string
    if (type === 'koperasi') {
      name = (s % 2 ? 'KMP ' : 'Kop. ') + city.name + (s % 2 ? ' Sejahtera' : ' Merah Putih')
      stock = `Butuh ${100 + (s % 5) * 100}kg ${c1.toLowerCase()}`
    } else if (type === 'komunitas') {
      name = (s % 2 ? 'Kelompok Tani ' : 'Kelompok Nelayan ') + city.name + ` RT ${(s % 12) + 1}`
      stock = `${150 + (s % 6) * 50}kg ${c1.toLowerCase()}/bln`
    } else {
      name = PRODUCER_NAMES[s % PRODUCER_NAMES.length] + ` (${city.name})`
      stock = `${30 + (s % 8) * 20}kg tersedia`
    }
    out.push({
      id: `${city.name}-${i}`, type, name, commodities, verified,
      lat, lng, distance: `${km} km`, stock, city: city.name,
    })
  }
  return out
}

const allPins: PinData[] = cities.flatMap(generateEntities)

function pinColor(type: string) {
  return type === 'koperasi' ? '#0F595E' : type === 'komunitas' ? '#8CAE3E' : '#C48A2A'
}

function makeMarkerIcon(pin: PinData, active: boolean) {
  const color = pinColor(pin.type)
  const sq = pin.type === 'koperasi'
  const size = active ? 40 : 32
  return L.divIcon({
    className: 'kompak-marker',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    html: `
      <div style="display:flex;flex-direction:column;align-items:center;transition:all .15s;">
        <div style="
          width:${size}px;height:${size}px;
          border-radius:${sq ? '9px' : '50%'};
          background:${color};
          border:3px solid ${active ? '#8CAE3E' : 'rgba(255,255,255,0.9)'};
          box-shadow:${active ? '0 4px 16px rgba(0,0,0,.3)' : '0 2px 8px rgba(0,0,0,.25)'};
          display:flex;align-items:center;justify-content:center;">
          <span style="width:${active ? 12 : 10}px;height:${active ? 12 : 10}px;border-radius:50%;background:#fff;"></span>
        </div>
        <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid ${color};margin-top:-1px;"></div>
      </div>`,
  })
}

function clusterIcon(cluster: { getChildCount: () => number }) {
  const count = cluster.getChildCount()
  const size = count < 10 ? 42 : count < 50 ? 50 : 58
  return L.divIcon({
    className: 'kompak-cluster',
    iconSize: L.point(size, size),
    html: `
      <div style="
        width:${size}px;height:${size}px;border-radius:50%;
        background:rgba(255,255,255,0.95);
        border:3px solid #0F595E;
        box-shadow:0 3px 12px rgba(15,43,44,.35);
        display:flex;align-items:center;justify-content:center;
        font-family:var(--font-body);font-weight:700;font-size:${count < 100 ? 15 : 13}px;color:#0F595E;">
        ${count}
      </div>`,
  })
}

const search = ref('')
const showCityList = ref(false)
const activeFilter = ref('all')
const activeRadius = ref('10 km')
const activePin = ref<PinData | null>(null)
const selectedCity = ref<City | null>(null)
const showFilters = ref(false)
const satellite = ref(true)

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let clusterGroup: L.LayerGroup | null = null
let baseLayer: L.TileLayer | null = null
let labelLayer: L.TileLayer | null = null

const filteredPins = computed(() => allPins.filter((p) => {
  if (activeFilter.value === 'all') return true
  const filterMap: Record<string, string> = {
    'gula-aren': 'Gula Aren', kopi: 'Kopi', beras: 'Beras', madu: 'Madu', sayur: 'Sayuran', buah: 'Buah', ikan: 'Ikan',
  }
  const keyword = filterMap[activeFilter.value]
  if (!keyword) return true
  return (p.commodities ?? []).some(
    (c) => typeof c === 'string' && c.toLowerCase().includes(keyword.toLowerCase()),
  )
}))

const citySuggestions = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return cities.slice(0, 8)
  return cities.filter((c) => c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)).slice(0, 8)
})

function goToCity(city: City) {
  selectedCity.value = city
  search.value = city.name
  showCityList.value = false
  activePin.value = null
  map?.flyTo([city.lat, city.lng], 12, { duration: 1.4 })
}

function flyToUser() {
  map?.flyTo(USER_LOCATION, 9, { duration: 1.2 })
}

function onSearchBlur() {
  window.setTimeout(() => { showCityList.value = false }, 150)
}

function updateMarkers() {
  if (!clusterGroup) return
  clusterGroup.clearLayers()
  filteredPins.value.forEach((pin) => {
    const marker = L.marker([pin.lat, pin.lng], {
      icon: makeMarkerIcon(pin, activePin.value?.id === pin.id),
    })
    marker.on('click', () => { activePin.value = pin })
    clusterGroup!.addLayer(marker)
  })
}

function setBaseLayers() {
  if (!map) return
  if (baseLayer) map.removeLayer(baseLayer)
  if (labelLayer) map.removeLayer(labelLayer)
  if (satellite.value) {
    baseLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18, attribution: 'Tiles &copy; Esri' },
    )
    labelLayer = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
      { maxZoom: 18 },
    )
    baseLayer.addTo(map)
    labelLayer.addTo(map)
  } else {
    baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    })
    baseLayer.addTo(map)
  }
}

onMounted(() => {
  if (!mapEl.value) return
  map = L.map(mapEl.value, {
    center: [-2.5, 118],
    zoom: 5,
    minZoom: 4,
    maxZoom: 18,
    scrollWheelZoom: true,
    worldCopyJump: true,
  })
  setBaseLayers()
  clusterGroup = (L as typeof L & { markerClusterGroup: (opts?: object) => L.LayerGroup }).markerClusterGroup({
    chunkedLoading: true,
    showCoverageOnHover: false,
    maxClusterRadius: 60,
    iconCreateFunction: clusterIcon,
  })
  map.addLayer(clusterGroup)
  updateMarkers()

  const fix = () => map?.invalidateSize()
  const t1 = setTimeout(fix, 100)
  const t2 = setTimeout(fix, 400)
  const t3 = setTimeout(fix, 800)
  window.addEventListener('resize', fix)

  onUnmounted(() => {
    clearTimeout(t1)
    clearTimeout(t2)
    clearTimeout(t3)
    window.removeEventListener('resize', fix)
    map?.remove()
    map = null
    clusterGroup = null
  })
})

watch(filteredPins, updateMarkers)
watch(activePin, updateMarkers)
watch(satellite, setBaseLayers)
</script>

<template>
  <div :style="{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--kompak-canvas)' }">
    <div
      :style="{
        background: 'var(--kompak-surface-white)',
        boxShadow: 'var(--shadow-card)',
        zIndex: 1000,
        position: 'relative',
        padding: 'var(--space-lg)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
      }"
    >
      <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
        <div :style="{ position: 'relative', flex: 1 }">
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              background: 'var(--kompak-card-bg)',
              border: '1px solid var(--kompak-border)',
              borderRadius: 'var(--radius-full)',
              padding: '8px 16px',
            }"
          >
            <Search :size="16" color="var(--kompak-text-muted)" />
            <input
              v-model="search"
              placeholder="Cari & pilih kota di seluruh Indonesia..."
              :style="{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--kompak-text-dark)',
                flex: 1,
                minWidth: 0,
              }"
              @focus="showCityList = true"
              @blur="onSearchBlur"
              @input="showCityList = true"
            />
            <button
              v-if="search"
              type="button"
              :style="{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }"
              @click="search = ''; selectedCity = null"
            >
              <X :size="15" color="var(--kompak-text-muted)" />
            </button>
          </div>

          <div
            v-if="showCityList && citySuggestions.length > 0"
            :style="{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              right: 0,
              background: 'var(--kompak-surface-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-elevated)',
              border: '1px solid var(--kompak-border)',
              overflow: 'hidden',
              zIndex: 1200,
              maxHeight: '320px',
              overflowY: 'auto',
            }"
          >
            <div
              :style="{
                padding: '8px 16px',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--kompak-text-light)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                borderBottom: '1px solid var(--kompak-border)',
              }"
            >
              Pilih kota untuk melihat koperasi & komoditas
            </div>
            <button
              v-for="c in citySuggestions"
              :key="c.name"
              type="button"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                width: '100%',
                padding: '10px 16px',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--kompak-border)',
                cursor: 'pointer',
                textAlign: 'left',
                fontFamily: 'var(--font-body)',
              }"
              @mousedown.prevent="goToCity(c)"
            >
              <div
                :style="{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'var(--kompak-card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }"
              >
                <Navigation :size="14" color="var(--kompak-primary)" />
              </div>
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ c.name }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)' }">{{ c.province }}</div>
              </div>
              <span
                :style="{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--kompak-primary)',
                  background: 'var(--kompak-verified-bg)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                }"
              >
                {{ allPins.filter((p) => p.city === c.name).length }} entitas
              </span>
            </button>
          </div>
        </div>
        <button
          type="button"
          :style="{
            width: '40px',
            height: '40px',
            borderRadius: 'var(--radius-full)',
            background: showFilters ? 'var(--kompak-primary)' : 'var(--kompak-card-bg)',
            border: '1px solid var(--kompak-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            flexShrink: 0,
          }"
          @click="showFilters = !showFilters"
        >
          <Filter :size="16" :color="showFilters ? '#fff' : 'var(--kompak-text-muted)'" />
        </button>
      </div>

      <div :style="{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'auto', paddingBottom: '2px' }">
        <button
          v-for="f in commodityFilters"
          :key="f.id"
          type="button"
          :style="{
            flexShrink: 0,
            padding: '5px 14px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: activeFilter === f.id ? 'var(--kompak-primary)' : 'var(--kompak-border)',
            background: activeFilter === f.id ? 'var(--kompak-primary)' : 'transparent',
            color: activeFilter === f.id ? '#fff' : 'var(--kompak-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            fontWeight: activeFilter === f.id ? 600 : 400,
            cursor: 'pointer',
          }"
          @click="activeFilter = f.id"
        >
          {{ f.label }}
        </button>
      </div>

      <div
        v-if="showFilters"
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-md)',
          flexWrap: 'wrap',
          paddingTop: 'var(--space-xs)',
        }"
      >
        <span :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', flexShrink: 0 }">Radius:</span>
        <button
          v-for="r in radiusOptions"
          :key="r"
          type="button"
          :style="{
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid',
            borderColor: activeRadius === r ? 'var(--kompak-secondary)' : 'var(--kompak-border)',
            background: activeRadius === r ? 'var(--kompak-secondary)' : 'transparent',
            color: activeRadius === r ? '#fff' : 'var(--kompak-text-muted)',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            cursor: 'pointer',
          }"
          @click="activeRadius = r"
        >
          {{ r }}
        </button>
      </div>
    </div>

    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-md)',
        padding: '6px 16px',
        background: 'var(--kompak-card-bg)',
        borderBottom: '1px solid var(--kompak-border)',
        zIndex: 800,
      }"
    >
      <div
        v-for="item in [
          { color: 'var(--kompak-pin-coop)', icon: Store, label: 'Koperasi', sq: true },
          { color: 'var(--kompak-pin-producer)', icon: Sprout, label: 'Produsen', sq: false },
          { color: 'var(--kompak-pin-community)', icon: Users, label: 'Komunitas', sq: false },
        ]"
        :key="item.label"
        :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }"
      >
        <div
          :style="{
            width: '20px',
            height: '20px',
            borderRadius: item.sq ? '4px' : '50%',
            background: item.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }"
        >
          <component :is="item.icon" :size="11" color="#fff" />
        </div>
        <span :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)' }">{{ item.label }}</span>
      </div>
      <span :style="{ marginLeft: 'auto', fontSize: '11px', color: 'var(--kompak-text-muted)' }">
        {{
          selectedCity
            ? `${filteredPins.filter((p) => p.city === selectedCity!.name).length} entitas di ${selectedCity.name}`
            : `${filteredPins.length} entitas · ${cities.length} kota`
        }}
      </span>
    </div>

    <div :style="{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: '400px' }">
      <div ref="mapEl" :style="{ width: '100%', height: '100%', background: '#0B4448' }" />

      <button
        type="button"
        :style="{
          position: 'absolute',
          top: 'var(--space-md)',
          right: 'var(--space-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--kompak-surface-white)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--kompak-border)',
          cursor: 'pointer',
          zIndex: 900,
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--kompak-text-dark)',
        }"
        @click="satellite = !satellite"
      >
        <Layers :size="15" color="var(--kompak-primary)" />
        {{ satellite ? 'Satelit' : 'Peta' }}
      </button>

      <button
        type="button"
        :style="{
          position: 'absolute',
          top: 'calc(var(--space-md) + 44px)',
          right: 'var(--space-md)',
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--kompak-surface-white)',
          boxShadow: 'var(--shadow-card)',
          border: '1px solid var(--kompak-border)',
          cursor: 'pointer',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }"
        @click="flyToUser"
      >
        <Navigation :size="18" color="var(--kompak-primary)" />
      </button>

      <div
        v-if="activePin"
        :style="{
          position: 'absolute',
          bottom: 'var(--space-xl)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 900,
        }"
      >
        <div
          :style="{
            background: 'var(--kompak-surface-white)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-elevated)',
            padding: 'var(--space-xl)',
            minWidth: '260px',
            maxWidth: '300px',
            border: '1px solid var(--kompak-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }">
            <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
              <div
                :style="{
                  width: '36px',
                  height: '36px',
                  borderRadius: activePin.type === 'koperasi' ? '8px' : '50%',
                  background: pinColor(activePin.type),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }"
              >
                <Store v-if="activePin.type === 'koperasi'" :size="18" color="#fff" />
                <Users v-else-if="activePin.type === 'komunitas'" :size="18" color="#fff" />
                <Sprout v-else :size="18" color="#fff" />
              </div>
              <div>
                <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ activePin.name }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)' }">
                  {{ activePin.type === 'koperasi' ? 'Koperasi' : activePin.type === 'komunitas' ? 'Komunitas' : 'Produsen' }} · {{ activePin.distance }}
                </div>
              </div>
            </div>
            <button type="button" :style="{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }" @click="activePin = null">
              <X :size="16" color="var(--kompak-text-muted)" />
            </button>
          </div>
          <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)' }">
            <template v-if="activePin.verified">
              <ShieldCheck :size="12" color="var(--kompak-verified)" />
              <span :style="{ fontSize: '11px', color: 'var(--kompak-verified)', fontWeight: 600 }">Terverifikasi</span>
            </template>
            <template v-else>
              <AlertCircle :size="12" color="var(--kompak-pending)" />
              <span :style="{ fontSize: '11px', color: 'var(--kompak-pending)', fontWeight: 600 }">Menunggu Verifikasi</span>
            </template>
          </div>
          <div :style="{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xs)' }">
            <span
              v-for="c in activePin.commodities"
              :key="c"
              :style="{
                background: 'var(--kompak-card-bg)',
                border: '1px solid var(--kompak-border)',
                borderRadius: 'var(--radius-full)',
                padding: '2px 10px',
                fontSize: '11px',
                color: 'var(--kompak-text-dark)',
              }"
            >
              {{ c }}
            </span>
          </div>
          <div
            :style="{
              background: 'var(--kompak-card-bg)',
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: '12px',
              color: 'var(--kompak-text-muted)',
            }"
          >
            {{ activePin.stock }}
          </div>
          <div :style="{ display: 'flex', gap: 'var(--space-md)' }">
            <Button variant="neutral" size="small" :style="{ flex: 1 }" @click="activePin = null">Hubungi</Button>
            <Button variant="primary" size="small" :style="{ flex: 1 }" @click="emit('navigate', 'entity-detail', activePin)">
              Detail
              <template #iconEnd><ChevronRight :size="14" /></template>
            </Button>
          </div>
        </div>
      </div>
    </div>

    <div :style="{ position: 'absolute', bottom: 'var(--space-2xl)', right: 'var(--space-2xl)', zIndex: 950 }">
      <Button
        variant="primary"
        :style="{ background: 'var(--kompak-accent)', boxShadow: 'var(--shadow-elevated)' }"
        @click="emit('navigate', 'add-product')"
      >
        <template #iconStart><Plus :size="16" /></template>
        Tambah Produk Saya
      </Button>
    </div>
  </div>
</template>

<style>
.leaflet-container { font-family: var(--font-body); }
.leaflet-bar a {
  background: var(--kompak-surface-white) !important;
  color: var(--kompak-primary) !important;
  border-bottom-color: var(--kompak-border) !important;
  font-weight: 600;
}
.leaflet-bar a:hover { background: var(--kompak-surface-hover) !important; }
.leaflet-touch .leaflet-bar { border: 1px solid var(--kompak-border); box-shadow: var(--shadow-card); }
.leaflet-control-attribution { font-size: 9px; background: rgba(255,255,255,0.7) !important; }
.kompak-marker, .kompak-cluster { background: transparent !important; border: none !important; }
</style>
