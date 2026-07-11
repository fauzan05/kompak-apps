<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Button, ButtonGroup, InputField, TextareaField, SelectField } from '@/components/ui'
import {
  Check,
  MapPin,
  Navigation,
  Camera,
  Package,
  User,
  ChevronRight,
  ChevronLeft,
  Sprout,
  Loader2,
} from 'lucide-vue-next'
import type { Component } from 'vue'

import { DEMO_PRODUCER_ID, submitProduct } from '@/api/client'
import { useGeolocation } from '@/composables/useGeolocation'

const emit = defineEmits<{ navigate: [view: string] }>()

const step = ref(1)
const submitted = ref(false)
const submitting = ref(false)
const submitError = ref('')

const form = reactive({
  name: '',
  phone: '',
  entityType: 'individu',
  location: '',
  commodity: '',
  quantity: '',
  unit: 'kg',
  period: 'bulan',
  price: '',
  description: '',
})

const geo = useGeolocation()
const mapEl = ref<HTMLDivElement | null>(null)
const selectedLat = ref(-6.6)
const selectedLng = ref(106.8)
const locationLoading = ref(false)
const locationError = ref('')
const gpsLoading = ref(false)

let map: L.Map | null = null
let marker: L.Marker | null = null
let geocodeTimer: ReturnType<typeof setTimeout> | null = null
let invalidateTimer: ReturnType<typeof setTimeout> | null = null

const markerIcon = L.divIcon({
  className: 'kompak-picker-marker',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  html: `<div style="display:flex;flex-direction:column;align-items:center;">
    <div style="width:26px;height:26px;border-radius:50%;background:#C48A2A;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.3);"></div>
    <div style="width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:8px solid #C48A2A;margin-top:-1px;"></div>
  </div>`,
})

function scheduleGeocode(lat: number, lng: number) {
  if (geocodeTimer) clearTimeout(geocodeTimer)
  geocodeTimer = setTimeout(() => reverseGeocode(lat, lng), 600)
}

async function reverseGeocode(lat: number, lng: number) {
  locationLoading.value = true
  locationError.value = ''
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&accept-language=id&zoom=16`,
    )
    if (!res.ok) throw new Error('Gagal membaca alamat')
    const data = await res.json() as {
      display_name?: string
      address?: Record<string, string>
    }
    const addr = data.address
    if (addr) {
      const parts = [
        addr.village || addr.suburb || addr.neighbourhood || addr.hamlet,
        addr.city_district || addr.county || addr.municipality,
        addr.state,
      ].filter(Boolean)
      form.location = parts.length ? parts.join(', ') : (data.display_name?.split(',').slice(0, 3).join(', ') || '')
    } else {
      form.location = data.display_name?.split(',').slice(0, 3).join(', ') || `${lat.toFixed(5)}, ${lng.toFixed(5)}`
    }
  } catch {
    form.location = `${lat.toFixed(5)}, ${lng.toFixed(5)}`
  } finally {
    locationLoading.value = false
  }
}

function updateMarkerPosition(lat: number, lng: number, fly = false) {
  selectedLat.value = lat
  selectedLng.value = lng
  marker?.setLatLng([lat, lng])
  if (fly && map) map.flyTo([lat, lng], 15, { duration: 0.8 })
  scheduleGeocode(lat, lng)
}

function initMap() {
  if (!mapEl.value || map) return
  map = L.map(mapEl.value, {
    center: [selectedLat.value, selectedLng.value],
    zoom: 14,
    scrollWheelZoom: true,
    zoomControl: true,
  })
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap',
  }).addTo(map)

  marker = L.marker([selectedLat.value, selectedLng.value], {
    draggable: true,
    icon: markerIcon,
  }).addTo(map)

  marker.on('dragend', () => {
    const pos = marker!.getLatLng()
    updateMarkerPosition(pos.lat, pos.lng)
  })

  map.on('click', (e) => {
    updateMarkerPosition(e.latlng.lat, e.latlng.lng)
  })

  invalidateTimer = setTimeout(() => map?.invalidateSize(), 250)
}

async function useGps() {
  gpsLoading.value = true
  locationError.value = ''
  geo.init()
  const ok = await geo.requestLocation()
  gpsLoading.value = false
  if (ok) {
    updateMarkerPosition(geo.lat.value, geo.lng.value, true)
  } else {
    locationError.value = geo.errorMessage.value || 'Gagal mendapatkan lokasi GPS'
  }
}

onMounted(async () => {
  geo.init()
  if (geo.usingGps.value) {
    selectedLat.value = geo.lat.value
    selectedLng.value = geo.lng.value
  }
  await nextTick()
  if (step.value === 1) {
    initMap()
    scheduleGeocode(selectedLat.value, selectedLng.value)
  }
})

watch(step, async (s) => {
  if (s === 1) {
    await nextTick()
    initMap()
    invalidateTimer = setTimeout(() => {
      map?.invalidateSize()
      map?.setView([selectedLat.value, selectedLng.value], map.getZoom())
    }, 200)
  }
})

onUnmounted(() => {
  if (geocodeTimer) clearTimeout(geocodeTimer)
  if (invalidateTimer) clearTimeout(invalidateTimer)
  map?.remove()
  map = null
  marker = null
})

const steps: { id: number; label: string; icon: Component }[] = [
  { id: 1, label: 'Data Diri', icon: User },
  { id: 2, label: 'Data Produk', icon: Package },
  { id: 3, label: 'Pratinjau', icon: Check },
]

const commodityOptions = [
  { value: 'gula-aren', label: 'Gula Aren' },
  { value: 'gula-semut', label: 'Gula Semut' },
  { value: 'kopi-robusta', label: 'Kopi Robusta' },
  { value: 'kopi-arabika', label: 'Kopi Arabika' },
  { value: 'beras-organik', label: 'Beras Organik' },
  { value: 'madu-hutan', label: 'Madu Hutan' },
  { value: 'sayuran', label: 'Sayuran Segar' },
  { value: 'buah', label: 'Buah-buahan' },
  { value: 'ikan', label: 'Ikan' },
  { value: 'tempe-tahu', label: 'Tempe & Tahu' },
  { value: 'lainnya', label: 'Lainnya' },
]

const unitOptions = [
  { value: 'kg', label: 'kg (kilogram)' },
  { value: 'ton', label: 'ton' },
  { value: 'liter', label: 'liter' },
  { value: 'buah', label: 'buah/pcs' },
  { value: 'ikat', label: 'ikat' },
]

const periodOptions = [
  { value: 'minggu', label: 'Per minggu' },
  { value: 'bulan', label: 'Per bulan' },
  { value: 'musim', label: 'Per musim panen' },
  { value: 'sekali', label: 'Stok tersedia sekali' },
]

const entityTypeOptions = [
  { value: 'individu', label: 'Produsen Individu' },
  { value: 'komunitas', label: 'Komunitas RT/RW/Kelurahan' },
]

async function handleSubmit() {
  submitting.value = true
  submitError.value = ''
  try {
    await submitProduct({
      namaKomoditas: commodityLabel.value,
      jumlah: Number(form.quantity) || 0,
      satuan: form.unit,
      harga: form.price ? Number(form.price.replace(/\D/g, '')) : undefined,
      namaEntitas: form.name || 'Produsen Baru',
      tipeEntitas: form.entityType === 'komunitas' ? 'komunitas' : 'produsen',
      telepon: form.phone,
      entitasRef: DEMO_PRODUCER_ID,
      koordinat: `${selectedLat.value.toFixed(4)}, ${selectedLng.value.toFixed(4)}`,
    })
    submitted.value = true
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Gagal menyimpan produk'
  } finally {
    submitting.value = false
  }
}

const commodityLabel = computed(
  () => commodityOptions.find((o) => o.value === form.commodity)?.label || form.commodity,
)
const unitLabel = computed(
  () => unitOptions.find((o) => o.value === form.unit)?.label || form.unit,
)
const periodLabel = computed(
  () => periodOptions.find((o) => o.value === form.period)?.label || form.period,
)

const previewRows = computed(() => [
  { label: 'Komoditas', value: commodityLabel.value || '-' },
  {
    label: 'Kapasitas',
    value: form.quantity ? `${form.quantity} ${unitLabel.value} ${periodLabel.value}` : '-',
  },
  { label: 'Harga', value: form.price ? `Rp ${form.price}/kg` : 'Belum ditentukan' },
  { label: 'Kontak', value: form.phone || '-' },
  { label: 'Lokasi', value: form.location || 'Belum dipilih di peta' },
])
</script>

<template>
  <div
    v-if="submitted"
    :style="{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-xl)',
      padding: 'var(--space-2xl)',
      textAlign: 'center',
      background: 'var(--kompak-canvas)',
    }"
  >
    <div
      :style="{
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'var(--kompak-verified-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }"
    >
      <Check :size="40" color="var(--kompak-verified)" :stroke-width="2.5" />
    </div>
    <div>
      <h2
        :style="{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--kompak-text-dark)',
        }"
      >
        Produk Berhasil Didaftarkan!
      </h2>
      <p
        :style="{
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          color: 'var(--kompak-text-muted)',
          marginTop: 8,
          maxWidth: 320,
        }"
      >
        Produk Anda sudah tayang di peta komoditas dengan status <strong>Menunggu Verifikasi</strong>.
        Tim kami akan memverifikasi dalam 1×24 jam.
      </p>
    </div>
    <div
      :style="{
        display: 'flex',
        gap: 'var(--space-md)',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }"
    >
      <Button variant="neutral" @click="emit('navigate', 'map')">Lihat di Peta</Button>
      <Button variant="primary" @click="emit('navigate', 'producer-dashboard')">Ke Dashboard Saya</Button>
    </div>
  </div>

  <div
    v-else
    :style="{
      flex: 1,
      overflowY: 'auto',
      padding: 'var(--space-2xl)',
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-xl)',
      background: 'var(--kompak-canvas)',
      fontFamily: 'var(--font-body)',
    }"
  >
    <div>
      <h1
        :style="{
          fontSize: '22px',
          fontWeight: 700,
          color: 'var(--kompak-text-dark)',
        }"
      >
        Daftarkan Produk Anda
      </h1>
      <p :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }">
        Selesaikan dalam hitungan menit, langsung dari ponsel Anda.
      </p>
    </div>

    <!-- Step indicator -->
    <div
      :style="{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--space-md)',
        fontFamily: 'var(--font-body)',
      }"
    >
      <template v-for="(s, idx) in steps" :key="s.id">
        <div :style="{ display: 'flex', alignItems: 'center' }">
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-xs)',
            }"
          >
            <div
              :style="{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background:
                  step > s.id
                    ? 'var(--kompak-primary)'
                    : step === s.id
                      ? 'var(--kompak-accent)'
                      : 'var(--kompak-card-bg)',
                border: `2px solid ${
                  step > s.id
                    ? 'var(--kompak-primary)'
                    : step === s.id
                      ? 'var(--kompak-accent)'
                      : 'var(--kompak-border)'
                }`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }"
            >
              <Check v-if="step > s.id" :size="16" color="#fff" />
              <component
                :is="s.icon"
                v-else
                :size="16"
                :color="step === s.id ? '#fff' : 'var(--kompak-text-muted)'"
              />
            </div>
            <span
              :style="{
                fontSize: '11px',
                fontWeight: step === s.id ? 600 : 400,
                color:
                  step === s.id
                    ? 'var(--kompak-accent)'
                    : step > s.id
                      ? 'var(--kompak-primary)'
                      : 'var(--kompak-text-muted)',
              }"
            >
              {{ s.label }}
            </span>
          </div>
          <div
            v-if="idx < steps.length - 1"
            :style="{
              width: '48px',
              height: '2px',
              background: step > s.id ? 'var(--kompak-primary)' : 'var(--kompak-border)',
              margin: '0 8px',
              marginBottom: '20px',
              transition: 'background 0.2s',
            }"
          />
        </div>
      </template>
    </div>

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-xl)',
        padding: 'var(--space-xl)',
        background: 'var(--kompak-surface-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-card)',
      }"
    >
      <!-- Step 1 -->
      <div
        v-if="step === 1"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
          fontFamily: 'var(--font-body)',
        }"
      >
        <div>
          <h2
            :style="{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
            }"
          >
            Data Diri
          </h2>
          <p :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }">
            Isi informasi dasar Anda agar koperasi dapat mengenali Anda.
          </p>
        </div>
        <InputField v-model="form.name" label="Nama Lengkap" placeholder="Contoh: Pak Budi Santoso" />
        <InputField v-model="form.phone" label="Nomor HP / WhatsApp" placeholder="08xx-xxxx-xxxx" />
        <SelectField
          v-model="form.entityType"
          label="Jenis Entitas"
          :options="entityTypeOptions"
        />
        <div>
          <div
            :style="{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--kompak-text-dark)',
              marginBottom: 'var(--space-md)',
            }"
          >
            Lokasi Produksi
          </div>
          <div
            :style="{
              background: 'var(--kompak-card-bg)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--kompak-border)',
              overflow: 'hidden',
            }"
          >
            <div :style="{ position: 'relative' }">
              <div ref="mapEl" class="location-map" />
              <button
                type="button"
                :disabled="gpsLoading"
                :style="{
                  position: 'absolute',
                  bottom: 'var(--space-md)',
                  right: 'var(--space-md)',
                  zIndex: 500,
                  background: 'var(--kompak-surface-white)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 10px',
                  cursor: gpsLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: 'var(--shadow-card)',
                  opacity: gpsLoading ? 0.8 : 1,
                }"
                @click="useGps"
              >
                <Loader2 v-if="gpsLoading" :size="12" color="var(--kompak-primary)" class="spin" />
                <Navigation v-else :size="12" color="var(--kompak-primary)" />
                <span
                  :style="{
                    fontSize: '12px',
                    color: 'var(--kompak-primary)',
                    fontWeight: 600,
                  }"
                >
                  {{ gpsLoading ? 'Mencari…' : 'Gunakan GPS' }}
                </span>
              </button>
            </div>
            <div
              :style="{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 'var(--space-md)',
                padding: 'var(--space-lg)',
                borderTop: '1px solid var(--kompak-border)',
                background: 'var(--kompak-surface-white)',
              }"
            >
              <MapPin :size="16" color="var(--kompak-accent)" :style="{ flexShrink: 0, marginTop: 2 }" />
              <div>
                <div :style="{ fontSize: '13px', color: 'var(--kompak-text-dark)', fontWeight: 500, lineHeight: 1.4 }">
                  <template v-if="locationLoading">Mencari nama wilayah…</template>
                  <template v-else-if="form.location">{{ form.location }}</template>
                  <template v-else>Ketuk peta atau geser pin untuk memilih lokasi produksi</template>
                </div>
                <div :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)', marginTop: 4 }">
                  {{ selectedLat.toFixed(5) }}, {{ selectedLng.toFixed(5) }} · geser pin untuk presisi
                </div>
                <div v-if="locationError" :style="{ fontSize: '12px', color: 'var(--kompak-danger)', marginTop: 6 }">
                  {{ locationError }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div
        v-if="step === 2"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
          fontFamily: 'var(--font-body)',
        }"
      >
        <div>
          <h2
            :style="{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
            }"
          >
            Data Produk
          </h2>
          <p :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }">
            Isi informasi produk Anda. Semakin lengkap, semakin cepat diverifikasi.
          </p>
        </div>
        <SelectField v-model="form.commodity" label="Jenis Komoditas" :options="commodityOptions" />
        <div :style="{ display: 'flex', gap: 'var(--space-xl)' }">
          <InputField
            v-model="form.quantity"
            label="Estimasi Jumlah"
            placeholder="Contoh: 150"
            :style="{ flex: 1 }"
          />
          <div :style="{ flex: 1 }">
            <SelectField v-model="form.unit" label="Satuan" :options="unitOptions" />
          </div>
        </div>
        <SelectField v-model="form.period" label="Frekuensi Produksi" :options="periodOptions" />
        <InputField v-model="form.price" label="Harga (opsional)" placeholder="Contoh: 18000">
          <template #prefix>
            <span :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">Rp</span>
          </template>
          <template #suffix>
            <span :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">/kg</span>
          </template>
        </InputField>
        <TextareaField
          v-model="form.description"
          label="Keterangan Tambahan (opsional)"
          placeholder="Contoh: Gula aren murni tanpa campuran, siap jual langsung dari kebun..."
          :rows="3"
        />
        <div>
          <div
            :style="{
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--kompak-text-dark)',
              marginBottom: 'var(--space-md)',
            }"
          >
            Foto Produk
            <span :style="{ fontWeight: 400, color: 'var(--kompak-text-muted)' }">(opsional)</span>
          </div>
          <div
            :style="{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-md)',
              padding: 'var(--space-2xl)',
              border: '2px dashed var(--kompak-border-strong)',
              borderRadius: 'var(--radius-lg)',
              background: 'var(--kompak-card-bg)',
              cursor: 'pointer',
              textAlign: 'center',
            }"
          >
            <div
              :style="{
                width: 48,
                height: 48,
                borderRadius: 'var(--radius-md)',
                background: 'var(--kompak-surface-white)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--shadow-card)',
              }"
            >
              <Camera :size="24" color="var(--kompak-secondary)" />
            </div>
            <div>
              <div
                :style="{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--kompak-text-dark)',
                }"
              >
                Unggah Foto Produk
              </div>
              <div
                :style="{
                  fontSize: '12px',
                  color: 'var(--kompak-text-muted)',
                  marginTop: 2,
                }"
              >
                Foto produk mempercepat proses verifikasi
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div
        v-if="step === 3"
        :style="{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-lg)',
          fontFamily: 'var(--font-body)',
        }"
      >
        <div>
          <h2
            :style="{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
            }"
          >
            Pratinjau Etalase
          </h2>
          <p :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginTop: 4 }">
            Berikut tampilan produk Anda di peta komoditas setelah dipublikasikan.
          </p>
        </div>

        <div
          :style="{
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-lg)',
            padding: 'var(--space-xl)',
            background: 'var(--kompak-surface-white)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-elevated)',
            border: '1px solid var(--kompak-border)',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
            <div
              :style="{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--kompak-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              <Sprout :size="24" color="#fff" />
            </div>
            <div>
              <div
                :style="{
                  fontSize: '16px',
                  fontWeight: 700,
                  color: 'var(--kompak-text-dark)',
                }"
              >
                {{ form.name || 'Nama Anda' }}
              </div>
              <span
                :style="{
                  display: 'inline-block',
                  marginTop: 4,
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--kompak-pending-bg)',
                  color: 'var(--kompak-pending)',
                  fontSize: '11px',
                  fontWeight: 600,
                }"
              >
                Menunggu Verifikasi
              </span>
            </div>
          </div>
          <div
            v-for="row in previewRows"
            :key="row.label"
            :style="{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: 'var(--space-lg)',
              borderBottom: '1px solid var(--kompak-border)',
              paddingBottom: 'var(--space-md)',
            }"
          >
            <span
              :style="{
                fontSize: '13px',
                color: 'var(--kompak-text-muted)',
                flexShrink: 0,
              }"
            >
              {{ row.label }}
            </span>
            <span
              :style="{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--kompak-text-dark)',
                textAlign: 'right',
              }"
            >
              {{ row.value }}
            </span>
          </div>
          <div v-if="form.description">
            <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginBottom: 4 }">
              Keterangan
            </div>
            <div
              :style="{
                fontSize: '13px',
                color: 'var(--kompak-text-dark)',
                lineHeight: 1.5,
              }"
            >
              {{ form.description }}
            </div>
          </div>
        </div>

        <div
          :style="{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-md)',
            padding: 'var(--space-lg)',
            background: 'var(--kompak-verified-bg)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid rgba(44,95,45,0.2)',
          }"
        >
          <Check
            :size="16"
            color="var(--kompak-verified)"
            :style="{ flexShrink: 0, marginTop: 1 }"
          />
          <div :style="{ fontSize: '13px', color: 'var(--kompak-verified)', lineHeight: 1.5 }">
            Produk akan tayang di peta dengan status <strong>"Menunggu Verifikasi"</strong> dan akan
            berubah menjadi <strong>"Terverifikasi"</strong> setelah proses verifikasi selesai.
          </div>
        </div>
      </div>
    </div>

    <!-- Sticky bottom nav -->
    <div
      :style="{
        position: 'sticky',
        bottom: 0,
        background: 'var(--kompak-canvas)',
        paddingTop: 'var(--space-md)',
        paddingBottom: 'var(--space-md)',
        borderTop: '1px solid var(--kompak-border)',
        marginLeft: 'calc(-1 * var(--space-2xl))',
        marginRight: 'calc(-1 * var(--space-2xl))',
        paddingLeft: 'var(--space-2xl)',
        paddingRight: 'var(--space-2xl)',
      }"
    >
      <ButtonGroup :align="step > 1 ? 'justify' : 'end'">
        <Button v-if="step > 1" variant="neutral" @click="step--">
          <template #iconStart>
            <ChevronLeft :size="16" />
          </template>
          Kembali
        </Button>
        <Button v-if="step < 3" variant="primary" @click="step++">
          Lanjut
          <template #iconEnd>
            <ChevronRight :size="16" />
          </template>
        </Button>
        <Button
          v-else
          variant="primary"
          :style="{ background: 'var(--kompak-accent)' }"
          :disabled="submitting"
          @click="handleSubmit"
        >
          Publikasikan Produk
          <template #iconEnd>
            <Check :size="16" />
          </template>
        </Button>
      </ButtonGroup>
    </div>
  </div>
</template>

<style scoped>
.location-map {
  height: 240px;
  width: 100%;
  background: var(--kompak-card-bg);
  z-index: 0;
}

.location-map :deep(.leaflet-container) {
  font-family: var(--font-body);
}

.location-map :deep(.leaflet-control-zoom) {
  border: 1px solid var(--kompak-border);
  box-shadow: var(--shadow-card);
}

.location-map :deep(.leaflet-control-attribution) {
  font-size: 9px;
  background: rgba(255, 255, 255, 0.8) !important;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
