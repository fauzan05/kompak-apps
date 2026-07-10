<script setup lang="ts">
import { computed, onMounted, ref, watch, type Component } from 'vue'
import { Button, Tabs } from '@/components/ui'
import {
  Sprout, Users, MapPin, Plus, Bell, Clock, ChevronRight, Package, Truck,
  CheckCircle, AlertCircle, Filter, Handshake, Search,
} from 'lucide-vue-next'
import { DEMO_COOP_ID, fetchCoopDashboard } from '@/api/client'
import type { CoopDashboardData } from '@/api/types'
import { useGeolocation } from '@/composables/useGeolocation'

const emit = defineEmits<{ navigate: [view: string, data?: unknown] }>()

const geo = useGeolocation()

const COMMODITY_POOL = [
  'Gula Aren', 'Kopi', 'Beras', 'Madu', 'Sayuran', 'Buah', 'Ikan', 'Kakao',
] as const

const RADIUS_OPTIONS = [10, 25, 50, 100] as const

const loading = ref(true)
const pasokanLoading = ref(false)
const loadError = ref('')
const pickupMessage = ref('')
const title = ref('Dashboard Koperasi')
const location = ref('—')
const stats = ref<{ label: string; value: string; icon: Component; color: string }[]>([])
const activeNeeds = ref<CoopDashboardData['activeNeeds']>([])
const producers = ref<CoopDashboardData['producers']>([])
const orders = ref<CoopDashboardData['orders']>([])

const filterCommodity = ref('')
const filterRadius = ref<number>(50)
const showFilterPanel = ref(false)

const commodityOptions = computed(() => {
  const fromNeeds = activeNeeds.value.map((n) => n.commodity)
  const merged = [...new Set([...fromNeeds, ...COMMODITY_POOL])]
  return merged
})

const filterLabel = computed(() => {
  const commodity = filterCommodity.value || 'Semua komoditas'
  const from = geo.usingGps.value ? 'lokasi Anda' : 'koperasi'
  return `${commodity} · ${filterRadius.value} km · ${from}`
})

async function loadDashboard(pasokanOnly = false) {
  if (pasokanOnly) pasokanLoading.value = true
  else loading.value = true

  try {
    const data = await fetchCoopDashboard(DEMO_COOP_ID, {
      commodity: filterCommodity.value || undefined,
      radiusKm: filterRadius.value,
      lat: geo.usingGps.value ? geo.lat.value : undefined,
      lng: geo.usingGps.value ? geo.lng.value : undefined,
    })
    title.value = data.title
    location.value = data.location
    stats.value = [
      { label: 'Kebutuhan Aktif', value: data.stats[0]?.value || '0', icon: Bell, color: 'var(--kompak-accent)' },
      { label: 'Pesanan Berjalan', value: data.stats[1]?.value || '0', icon: Truck, color: 'var(--kompak-secondary)' },
      { label: 'Produsen Tersedia', value: data.stats[2]?.value || '0', icon: Sprout, color: 'var(--kompak-primary)' },
      { label: 'Transaksi Bulan Ini', value: data.stats[3]?.value || '0', icon: Handshake, color: 'var(--kompak-primary)' },
    ]
    activeNeeds.value = data.activeNeeds
    needsList.value = data.activeNeeds
    producers.value = data.producers
    orders.value = data.orders
    loadError.value = ''
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Gagal memuat dashboard'
  } finally {
    loading.value = false
    pasokanLoading.value = false
  }
}

onMounted(async () => {
  geo.init()
  await loadDashboard()
  if (activeNeeds.value[0]?.commodity) {
    filterCommodity.value = activeNeeds.value[0].commodity
    await loadDashboard(true)
  }
})

async function refreshGps() {
  const ok = await geo.requestLocation()
  if (ok) await loadDashboard(true)
}

watch(geo.usingGps, async (active) => {
  if (active) await loadDashboard(true)
})

function applyFilters() {
  showFilterPanel.value = false
  loadDashboard(true)
}

function schedulePickup(p: CoopDashboardData['producers'][number]) {
  const ok = window.confirm(
    `Jadwalkan pickup dari ${p.name}?\n\nKomoditas: ${p.commodity}\nStok: ${p.qty}\nJarak: ${p.distance}`,
  )
  if (ok) {
    pickupMessage.value = `Permintaan pickup ke ${p.name} telah dicatat. Tim koperasi akan menghubungi produsen.`
    window.setTimeout(() => { pickupMessage.value = '' }, 5000)
  }
}

const orderStatusConfig: Record<string, { label: string; color: string; bg: string; icon: Component }> = {
  'dalam-perjalanan': { label: 'Dalam Perjalanan', color: 'var(--kompak-secondary)', bg: 'rgba(110,139,61,0.12)', icon: Truck },
  dijadwalkan: { label: 'Dijadwalkan', color: 'var(--kompak-accent)', bg: 'var(--kompak-pending-bg)', icon: Clock },
  selesai: { label: 'Selesai', color: 'var(--kompak-verified)', bg: 'var(--kompak-verified-bg)', icon: CheckCircle },
  Selesai: { label: 'Selesai', color: 'var(--kompak-verified)', bg: 'var(--kompak-verified-bg)', icon: CheckCircle },
  diproses: { label: 'Diproses', color: 'var(--kompak-accent)', bg: 'var(--kompak-pending-bg)', icon: Clock },
}

const tabs = [
  { id: 'kebutuhan', label: 'Kebutuhan Aktif' },
  { id: 'pasokan', label: 'Cari Pasokan' },
  { id: 'pesanan', label: 'Pelacakan Pesanan' },
]

const needsList = ref<CoopDashboardData['activeNeeds']>([])

function closeNeed(id: string) {
  needsList.value = needsList.value.filter((n) => n.id !== id)
}

function needMeta(need: CoopDashboardData['activeNeeds'][number]) {
  return [
    { label: 'Batas Waktu', value: need.deadline, icon: Clock as Component | null, color: 'var(--kompak-accent)' },
    { label: 'Sisa Waktu', value: `${need.daysLeft} hari`, icon: null, color: 'var(--kompak-accent)' },
    { label: 'Respons Produsen', value: `${need.responses} produsen`, icon: Bell as Component, color: 'var(--kompak-primary)' },
  ]
}

function producerFields(p: CoopDashboardData['producers'][number]) {
  return [
    { label: 'Komoditas', value: p.commodity },
    { label: 'Stok', value: p.qty },
    { label: 'Harga', value: p.price },
  ]
}
</script>

<template>
  <div class="coop-page">
    <div>
      <h1 :style="{ fontFamily: 'var(--font-body)', fontSize: '24px', fontWeight: 700, color: 'var(--kompak-text-dark)' }">Dashboard Koperasi</h1>
      <p :style="{ fontSize: '14px', color: 'var(--kompak-text-muted)', marginTop: 'var(--space-xs)' }">{{ title }} · {{ location }} · Terverifikasi</p>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
      >
        <div class="stat-card__header">
          <span class="stat-card__label">{{ stat.label }}</span>
          <div
            class="stat-card__icon"
            :style="{ background: `color-mix(in srgb, ${stat.color} 14%, transparent)` }"
          >
            <component :is="stat.icon" :size="20" :color="stat.color" />
          </div>
        </div>
        <div class="stat-card__value">{{ stat.value }}</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs-card">
      <Tabs :tabs="tabs" default-tab="kebutuhan">
        <template #default="{ active }">
          <div :style="{ padding: 'var(--space-xl)' }">
            <!-- Kebutuhan Aktif -->
            <div v-if="active === 'kebutuhan'" :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }">
              <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }">
                <span :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">{{ needsList.length }} pengumuman aktif</span>
                <Button variant="primary" size="small">
                  <template #iconStart><Plus :size="14" /></template>
                  Buat Pengumuman
                </Button>
              </div>

              <template v-if="needsList.length === 0">
                <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-2xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }">
                  <Bell :size="32" color="var(--kompak-text-muted)" />
                  <div :style="{ fontSize: '14px', color: 'var(--kompak-text-muted)' }">Belum ada pengumuman aktif</div>
                </div>
              </template>

              <div
                v-for="need in needsList"
                v-else
                :key="need.id"
                :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)' }"
              >
                <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }">
                  <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
                    <div :style="{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--kompak-card-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }">
                      <Package :size="20" color="var(--kompak-primary)" />
                    </div>
                    <div>
                      <div :style="{ fontSize: '15px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ need.commodity }}</div>
                      <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }">Dibutuhkan: {{ need.qty }}</div>
                    </div>
                  </div>
                  <span :style="{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'var(--kompak-verified-bg)', color: 'var(--kompak-verified)', fontSize: '11px', fontWeight: 600 }">Aktif</span>
                </div>

                <div :style="{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-xl)' }">
                  <div v-for="item in needMeta(need)" :key="item.label">
                    <div :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)' }">{{ item.label }}</div>
                    <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: 4 }">
                      <component v-if="item.icon" :is="item.icon" :size="12" :color="item.color" />
                      <span :style="{ fontSize: '13px', fontWeight: 600, color: item.color }">{{ item.value }}</span>
                    </div>
                  </div>
                </div>

                <div :style="{ display: 'flex', gap: 'var(--space-md)' }">
                  <Button variant="neutral" size="small" :style="{ flex: 1 }" @click="closeNeed(need.id)">Tutup Pengumuman</Button>
                  <Button variant="primary" size="small" :style="{ flex: 1 }">
                    Lihat Respons
                    <template #iconEnd><ChevronRight :size="14" /></template>
                  </Button>
                </div>
              </div>
            </div>

            <!-- Cari Pasokan -->
            <div v-else-if="active === 'pasokan'" :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)' }">
              <div v-if="pickupMessage" class="pickup-toast">{{ pickupMessage }}</div>

              <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }">
                <button
                  type="button"
                  class="filter-chip"
                  @click="showFilterPanel = !showFilterPanel"
                >
                  <Filter :size="14" color="var(--kompak-text-muted)" />
                  <span>{{ filterLabel }}</span>
                </button>
                <Button variant="neutral" size="small" @click="refreshGps" :title="geo.usingGps.value ? 'Perbarui lokasi GPS' : 'Aktifkan GPS'">
                  <template #iconStart><MapPin :size="14" /></template>
                  GPS
                </Button>
                <Button variant="neutral" size="small" @click="showFilterPanel = !showFilterPanel">
                  <template #iconStart><Filter :size="14" /></template>
                  Filter
                </Button>
                <span v-if="pasokanLoading" :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)' }">Memuat…</span>
              </div>

              <div v-if="showFilterPanel" class="filter-panel">
                <div class="filter-panel__section">
                  <div class="filter-panel__label">Komoditas</div>
                  <div class="filter-panel__chips">
                    <button
                      type="button"
                      class="filter-panel__chip"
                      :class="{ 'filter-panel__chip--active': !filterCommodity }"
                      @click="filterCommodity = ''"
                    >
                      Semua
                    </button>
                    <button
                      v-for="c in commodityOptions"
                      :key="c"
                      type="button"
                      class="filter-panel__chip"
                      :class="{ 'filter-panel__chip--active': filterCommodity === c }"
                      @click="filterCommodity = c"
                    >
                      {{ c }}
                    </button>
                  </div>
                </div>
                <div class="filter-panel__section">
                  <div class="filter-panel__label">Radius pencarian</div>
                  <div class="filter-panel__chips">
                    <button
                      v-for="r in RADIUS_OPTIONS"
                      :key="r"
                      type="button"
                      class="filter-panel__chip"
                      :class="{ 'filter-panel__chip--active': filterRadius === r }"
                      @click="filterRadius = r"
                    >
                      {{ r }} km
                    </button>
                  </div>
                </div>
                <Button variant="primary" size="small" @click="applyFilters">Terapkan Filter</Button>
              </div>

              <div v-if="!pasokanLoading && producers.length === 0" class="empty-pasokan">
                <Search :size="32" color="var(--kompak-text-muted)" />
                <div class="empty-pasokan__title">Tidak ada produsen ditemukan</div>
                <div class="empty-pasokan__sub">
                  Coba perluas radius atau pilih komoditas lain.
                </div>
                <Button variant="neutral" size="small" @click="filterCommodity = ''; filterRadius = 100; applyFilters()">
                  Tampilkan semua dalam 100 km
                </Button>
              </div>

              <div
                v-for="p in producers"
                :key="p.id"
                :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)', padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)' }"
              >
                <div :style="{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-md)' }">
                  <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
                    <div
                      :style="{
                        width: 40,
                        height: 40,
                        borderRadius: p.type === 'komunitas' ? '10px' : '50%',
                        background: p.type === 'komunitas' ? 'var(--kompak-pin-community)' : 'var(--kompak-pin-producer)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }"
                    >
                      <Users v-if="p.type === 'komunitas'" :size="20" color="#fff" />
                      <Sprout v-else :size="20" color="#fff" />
                    </div>
                    <div>
                      <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ p.name }}</div>
                      <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-xs)', marginTop: 4 }">
                        <MapPin :size="11" color="var(--kompak-text-muted)" />
                        <span :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)' }">{{ p.distance }}</span>
                        <CheckCircle v-if="p.verified" :size="11" color="var(--kompak-verified)" />
                        <AlertCircle v-else :size="11" color="var(--kompak-pending)" />
                      </div>
                    </div>
                  </div>
                  <span :style="{ padding: '3px 10px', borderRadius: 'var(--radius-full)', background: 'rgba(110,139,61,0.12)', fontSize: '12px', fontWeight: 600, color: 'var(--kompak-secondary)', flexShrink: 0 }">
                    {{ p.matchScore }}% cocok
                  </span>
                </div>
                <div :style="{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-md)' }">
                  <div
                    v-for="item in producerFields(p)"
                    :key="item.label"
                    :style="{ flex: 1, minWidth: '90px', background: 'var(--kompak-card-bg)', borderRadius: 'var(--radius-md)', padding: '8px 12px' }"
                  >
                    <div :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)' }">{{ item.label }}</div>
                    <div :style="{ fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)', marginTop: 2 }">{{ item.value }}</div>
                  </div>
                </div>
                <div :style="{ display: 'flex', gap: 'var(--space-md)' }">
                  <Button variant="neutral" size="small" :style="{ flex: 1 }" @click="emit('navigate', 'entity-detail', { type: p.type, id: p.id, name: p.name })">Lihat Etalase</Button>
                  <Button variant="primary" size="small" :style="{ flex: 1 }" @click="schedulePickup(p)">
                    Jadwalkan Pickup
                    <template #iconEnd><Truck :size="14" /></template>
                  </Button>
                </div>
              </div>
            </div>

            <!-- Pelacakan Pesanan -->
            <div v-else-if="active === 'pesanan'" :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }">
              <div
                v-for="(order, i) in orders"
                :key="`${order.supplier}-${order.date}-${i}`"
                :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', padding: 'var(--space-lg)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--kompak-border)' }"
              >
                <div :style="{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: (orderStatusConfig[order.status] || orderStatusConfig.diproses).bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }">
                  <component :is="(orderStatusConfig[order.status] || orderStatusConfig.diproses).icon" :size="20" :color="(orderStatusConfig[order.status] || orderStatusConfig.diproses).color" />
                </div>
                <div :style="{ flex: 1, minWidth: 0 }">
                  <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ order.supplier }}</div>
                  <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }">{{ order.commodity }} · {{ order.qty }}</div>
                </div>
                <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 'var(--space-xs)' }">
                  <span :style="{ padding: '2px 8px', borderRadius: 'var(--radius-full)', background: (orderStatusConfig[order.status] || orderStatusConfig.diproses).bg, color: (orderStatusConfig[order.status] || orderStatusConfig.diproses).color, fontSize: '11px', fontWeight: 600 }">{{ (orderStatusConfig[order.status] || orderStatusConfig.diproses).label }}</span>
                  <span :style="{ fontSize: '11px', color: 'var(--kompak-text-light)' }">{{ order.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<style scoped>
.coop-page {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--space-2xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  background: var(--kompak-canvas);
  font-family: var(--font-body);
  -webkit-overflow-scrolling: touch;
}

.tabs-card {
  background: var(--kompak-surface-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  overflow: visible;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-lg);
}

.stat-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--kompak-surface-white);
  border: 1px solid var(--kompak-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  min-height: 108px;
}

.stat-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-md);
}

.stat-card__label {
  font-size: 13px;
  font-weight: 500;
  color: var(--kompak-text-muted);
  line-height: 1.35;
  flex: 1;
  min-width: 0;
}

.stat-card__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card__value {
  font-size: 28px;
  font-weight: 700;
  color: var(--kompak-text-dark);
  line-height: 1;
  letter-spacing: -0.02em;
}

@media (max-width: 900px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

.filter-chip {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex: 1;
  min-width: 180px;
  background: var(--kompak-card-bg);
  border: 1px solid var(--kompak-border);
  border-radius: var(--radius-full);
  padding: 8px 16px;
  font-size: 13px;
  color: var(--kompak-text-muted);
  cursor: pointer;
  font-family: var(--font-body);
  text-align: left;
}

.filter-chip:hover {
  border-color: var(--kompak-primary);
}

.filter-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding: var(--space-xl);
  background: var(--kompak-card-bg);
  border: 1px solid var(--kompak-border);
  border-radius: var(--radius-lg);
}

.filter-panel__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.filter-panel__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--kompak-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.filter-panel__chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-sm);
}

.filter-panel__chip {
  padding: 6px 14px;
  border-radius: var(--radius-full);
  border: 1px solid var(--kompak-border);
  background: var(--kompak-surface-white);
  font-size: 13px;
  color: var(--kompak-text-dark);
  cursor: pointer;
  font-family: var(--font-body);
  transition: border-color 0.15s, background 0.15s;
}

.filter-panel__chip:hover {
  border-color: var(--kompak-primary);
}

.filter-panel__chip--active {
  border-color: var(--kompak-primary);
  background: var(--kompak-verified-bg);
  color: var(--kompak-primary);
  font-weight: 600;
}

.empty-pasokan {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-2xl);
  text-align: center;
  background: var(--kompak-surface-white);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--kompak-border);
}

.empty-pasokan__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--kompak-text-dark);
}

.empty-pasokan__sub {
  font-size: 13px;
  color: var(--kompak-text-muted);
  max-width: 280px;
  line-height: 1.5;
}

.pickup-toast {
  padding: var(--space-md) var(--space-lg);
  background: var(--kompak-verified-bg);
  color: var(--kompak-verified);
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
}
</style>
