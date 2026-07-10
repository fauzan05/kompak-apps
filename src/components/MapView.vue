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

import { fetchCities, fetchMapPins } from '@/api/client'
import type { CitySuggestion } from '@/api/types'

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

const cities = ref<City[]>([])
const pinsLoading = ref(true)
const pinsError = ref('')

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

const allPins = ref<PinData[]>([])

async function loadPins() {
  pinsLoading.value = true
  pinsError.value = ''
  try {
    const data = await fetchMapPins(USER_LOCATION[0], USER_LOCATION[1])
    allPins.value = data.pins
  } catch (e) {
    pinsError.value = e instanceof Error ? e.message : 'Gagal memuat data peta'
  } finally {
    pinsLoading.value = false
  }
}

async function loadCities(q = '') {
  try {
    const rows = await fetchCities(q)
    cities.value = rows.map((c: CitySuggestion) => ({
      name: c.name,
      province: c.province,
      lat: Number(c.lat),
      lng: Number(c.lng),
    }))
  } catch {
    cities.value = []
  }
}

// Lucide SVG inner markup (stroke icons, viewBox 0 0 24 24)
const ICON_CANDY = '<path d="M10 7v10.9"/><path d="M14 6.1V17"/><path d="M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4"/><path d="M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07"/><path d="M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4"/>'
const ICON_COFFEE = '<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>'
const ICON_WHEAT = '<path d="M2 22 16 8"/><path d="M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z"/><path d="M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z"/>'
const ICON_DROPLETS = '<path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/>'
const ICON_CARROT = '<path d="M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46"/><path d="M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z"/><path d="M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z"/>'
const ICON_APPLE = '<path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"/><path d="M10 2c1 .5 2 2 2 5"/>'
const ICON_FISH = '<path d="M2 16s9-15 20-4C11 23 2 8 2 8"/>'
const ICON_WAVES = '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>'
const ICON_BEAN = '<path d="M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z"/><path d="M5.341 10.62a4 4 0 1 0 5.279-5.28"/>'
const ICON_KELAPA = '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>'
const ICON_SPROUT = '<path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/>'

const COMMODITY_ICON_RULES: { keywords: string[]; markup: string }[] = [
  { keywords: ['gula'], markup: ICON_CANDY },
  { keywords: ['kopi'], markup: ICON_COFFEE },
  { keywords: ['beras'], markup: ICON_WHEAT },
  { keywords: ['madu'], markup: ICON_DROPLETS },
  { keywords: ['sayur'], markup: ICON_CARROT },
  { keywords: ['buah'], markup: ICON_APPLE },
  { keywords: ['ikan'], markup: ICON_FISH },
  { keywords: ['rumput laut'], markup: ICON_WAVES },
  { keywords: ['kelapa'], markup: ICON_KELAPA },
  { keywords: ['kakao'], markup: ICON_BEAN },
]

function commodityIconInner(name: string): string {
  const n = (name || '').toLowerCase()
  for (const rule of COMMODITY_ICON_RULES) {
    if (rule.keywords.some((kw) => n.includes(kw))) return rule.markup
  }
  return ICON_SPROUT
}

function commodityIconSvg(name: string, size: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${commodityIconInner(name)}</svg>`
}

function pinColor(type: string) {
  return type === 'koperasi' ? '#0F595E' : type === 'komunitas' ? '#8CAE3E' : '#C48A2A'
}

function makeMarkerIcon(pin: PinData, active: boolean) {
  const color = pinColor(pin.type)
  const sq = pin.type === 'koperasi'
  const size = active ? 40 : 32
  const iconSize = active ? 18 : 14
  const iconHtml = commodityIconSvg(pin.commodities[0] ?? '', iconSize)
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
          ${iconHtml}
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
const showKomoditas = ref(true)
const showKoperasi = ref(true)

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let clusterGroup: L.LayerGroup | null = null
let baseLayer: L.TileLayer | null = null
let labelLayer: L.TileLayer | null = null

const filteredPins = computed(() => allPins.value.filter((p) => {
  const isKoperasi = p.type === 'koperasi'
  const isKomoditas = p.type === 'produsen' || p.type === 'komunitas'
  if (isKoperasi && !showKoperasi.value) return false
  if (isKomoditas && !showKomoditas.value) return false

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
  if (!q) return cities.value.slice(0, 8)
  return cities.value.filter((c) => c.name.toLowerCase().includes(q) || c.province.toLowerCase().includes(q)).slice(0, 8)
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
  void loadPins().then(() => updateMarkers())
  void loadCities()

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
watch(search, (q) => {
  void loadCities(q.trim())
})
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
        :style="{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-xl)',
          flexWrap: 'wrap',
        }"
      >
        <label
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--kompak-text-dark)',
            userSelect: 'none',
          }"
        >
          <input
            v-model="showKomoditas"
            type="checkbox"
            :style="{ accentColor: 'var(--kompak-pin-producer)', width: '16px', height: '16px', cursor: 'pointer' }"
          />
          <Sprout :size="14" color="var(--kompak-pin-producer)" />
          Komoditas
        </label>
        <label
          :style="{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            cursor: 'pointer',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--kompak-text-dark)',
            userSelect: 'none',
          }"
        >
          <input
            v-model="showKoperasi"
            type="checkbox"
            :style="{ accentColor: 'var(--kompak-pin-coop)', width: '16px', height: '16px', cursor: 'pointer' }"
          />
          <Store :size="14" color="var(--kompak-pin-coop)" />
          Koperasi
        </label>
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
