<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import {
  MapPin, Search, ChevronDown, Star, ArrowRight,
  Sprout, Building2, UserPlus, Map,
  Zap, Handshake, Truck,
} from 'lucide-vue-next'
import { fetchCommodities, fetchMapPins, fetchStats } from '@/api/client'
import type { KomoditasItem, LandingStat, ProducerCard } from '@/api/types'
import { useGeolocation } from '@/composables/useGeolocation'

const emit = defineEmits<{ navigate: [view: string, data?: unknown] }>()

const geo = useGeolocation()

const searchQuery = ref('')
const locationQuery = ref('Mencari lokasi…')
const loading = ref(true)
const loadError = ref('')

const stats = ref<LandingStat[]>([])
const komoditas = ref<KomoditasItem[]>([])
const producerCards = ref<ProducerCard[]>([])

const statsFallback = [
  { value: '—', label: 'Produsen Terdaftar', sub: 'memuat…' },
  { value: '—', label: 'Koperasi Aktif', sub: 'memuat…' },
  { value: '—', label: 'Nilai Transaksi', sub: 'memuat…' },
  { value: '—', label: 'Komoditas', sub: 'memuat…' },
]

onMounted(async () => {
  geo.init()
  loading.value = true
  loadError.value = ''
  try {
    const [s, k, mapData] = await Promise.all([
      fetchStats(),
      fetchCommodities(),
      fetchMapPins(geo.lat.value, geo.lng.value),
    ])
    stats.value = s
    komoditas.value = k
    producerCards.value = mapData.producerCards
    locationQuery.value = geo.label.value
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Gagal memuat data'
    stats.value = statsFallback
  } finally {
    loading.value = false
  }
})

watch(geo.label, (label) => {
  locationQuery.value = label
})

watch(
  () => [geo.lat.value, geo.lng.value, geo.usingGps.value] as const,
  async ([, , usingGps]) => {
    if (!usingGps) return
    try {
      const mapData = await fetchMapPins(geo.lat.value, geo.lng.value)
      producerCards.value = mapData.producerCards
    } catch {
      /* keep previous cards */
    }
  },
)

const quickActions = [
  { id: 'map', label: 'Peta Komoditas', desc: 'Temukan produsen terdekat', color: '#0F595E', bg: '#E8F4F4' },
  { id: 'coop-dashboard', label: 'Koperasi Aktif', desc: 'Cari koperasi di wilayah Anda', color: '#0F595E', bg: '#E8F4F4' },
  { id: 'add-product', label: 'Daftar Produsen', desc: 'Pasarkan komoditas Anda', color: '#0F595E', bg: '#E8F4F4' },
]

const features = [
  { icon: Map, title: 'Peta Interaktif Dua Arah', desc: 'Produsen dan koperasi saling terlihat di peta real-time berdasarkan lokasi.' },
  { icon: Zap, title: 'Daftar dalam Menit', desc: 'Pasarkan komoditas dari ponsel — upload foto, isi kapasitas, langsung tampil.' },
  { icon: Handshake, title: 'Rekomendasi Otomatis', desc: 'Algoritme mencocokkan produsen dengan koperasi yang paling tepat.' },
  { icon: Truck, title: 'Pelacakan Distribusi', desc: 'Pantau alur transaksi dari penawaran hingga pengiriman dalam satu platform.' },
]

const hoveredCard = ref<number | null>(null)
const hoveredKomoditas = ref<number | null>(null)
const hoveredAction = ref<number | null>(null)
</script>

<template>
  <div class="lp-root">

    <!-- ─── HERO ───────────────────────────────────────── -->
    <section class="hero">
      <!-- Side photos -->
      <div class="hero__side hero__side--left">
        <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=360&h=220&fit=crop&auto=format" alt="" />
        <img src="https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=360&h=220&fit=crop&auto=format" alt="" />
        <div class="hero__side-fade hero__side-fade--right" />
      </div>
      <div class="hero__side hero__side--right">
        <img src="https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=360&h=220&fit=crop&auto=format" alt="" />
        <img src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=360&h=220&fit=crop&auto=format" alt="" />
        <div class="hero__side-fade hero__side-fade--left" />
      </div>

      <!-- Content -->
      <div class="hero__content">
        <h1 class="hero__headline">
          Cari Komoditas?<br />
          <span class="hero__headline-accent">Temukan di KOMPAK.</span>
        </h1>
        <p class="hero__sub">
          Hubungkan produsen desa dengan Koperasi Merah Putih — tanpa perantara.
        </p>

        <!-- Search card -->
        <div class="search-card">
          <div class="search-card__label">Komoditas atau lokasi</div>
          <div class="search-card__row">
            <div class="search-card__location">
              <MapPin :size="15" color="#E74C3C" />
              <span>{{ locationQuery }}</span>
              <ChevronDown :size="14" color="#9B9BAA" />
            </div>
            <div class="search-card__input-wrap">
              <Search :size="15" color="#9B9BAA" />
              <input
                v-model="searchQuery"
                class="search-card__input"
                placeholder="Cari komoditas, produsen, koperasi..."
              />
            </div>
            <button class="search-card__btn" @click="emit('navigate', 'map')">
              Jelajahi
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── QUICK ACTIONS ──────────────────────────────── -->
    <section class="section section--gray">
      <h2 class="section__title">Mulai dari sini</h2>
      <div class="quick-grid">
        <div
          v-for="(action, i) in quickActions"
          :key="action.id"
          class="quick-card"
          :class="{ 'quick-card--hovered': hoveredAction === i }"
          @click="emit('navigate', action.id)"
          @mouseenter="hoveredAction = i"
          @mouseleave="hoveredAction = null"
        >
          <div class="quick-card__icon-wrap">
            <Map v-if="action.id === 'map'" :size="22" color="#0F595E" />
            <Building2 v-else-if="action.id === 'coop-dashboard'" :size="22" color="#0F595E" />
            <UserPlus v-else :size="22" color="#0F595E" />
          </div>
          <div>
            <div class="quick-card__label">{{ action.label }}</div>
            <div class="quick-card__desc">{{ action.desc }}</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── KOMODITAS CIRCLES ──────────────────────────── -->
    <section class="section section--gray">
      <h2 class="section__title">Pilih dari komoditas</h2>
      <p class="section__sub">Temukan produsen berdasarkan jenis komoditas</p>

      <div class="circles-row">
        <div
          v-for="(item, i) in komoditas"
          :key="item.name"
          class="circle-item"
          :class="{ 'circle-item--hovered': hoveredKomoditas === i }"
          @click="emit('navigate', 'map')"
          @mouseenter="hoveredKomoditas = i"
          @mouseleave="hoveredKomoditas = null"
        >
          <div class="circle-item__img-wrap">
            <img :src="item.img" :alt="item.name" class="circle-item__img" />
          </div>
          <div class="circle-item__name">{{ item.name }}</div>
          <div class="circle-item__count">{{ item.count }}</div>
        </div>
      </div>

      <div class="section__cta-row">
        <button class="btn-outline" @click="emit('navigate', 'map')">
          Lihat semua komoditas
        </button>
      </div>
    </section>

    <!-- ─── PRODUCER CARDS ────────────────────────────── -->
    <section class="section section--gray">
      <h2 class="section__title">Komoditas populer di sekitar Anda</h2>
      <p class="section__sub">
        Temukan produsen terpercaya, favorit koperasi, dan penawaran terbaik di wilayah Anda.
      </p>

      <div class="producer-grid">
        <div
          v-for="(card, i) in producerCards"
          :key="card.id"
          class="producer-card"
          :class="{ 'producer-card--hovered': hoveredCard === i }"
          @click="emit('navigate', 'entity-detail', { type: card.type || 'produsen', id: card.id, name: card.name })"
          @mouseenter="hoveredCard = i"
          @mouseleave="hoveredCard = null"
        >
          <div class="producer-card__img-wrap">
            <img :src="card.img" :alt="card.name" class="producer-card__img" />
            <div class="producer-card__badge">{{ card.badge }}</div>
            <div class="producer-card__rating">
              <Star :size="12" color="#F4A725" fill="#F4A725" />
              {{ card.rating }}
            </div>
          </div>
          <div class="producer-card__body">
            <div class="producer-card__name">{{ card.name }}</div>
            <div class="producer-card__commodity">{{ card.commodity }}</div>
            <div class="producer-card__location">
              <MapPin :size="12" color="#E74C3C" />
              {{ card.location }}
            </div>
            <div class="producer-card__footer">
              <div class="producer-card__tags">
                <span v-for="tag in card.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <span class="producer-card__dist">{{ card.distance }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ─── STATS BAR ─────────────────────────────────── -->
    <section class="section section--white stats-bar">
      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <div class="stat-item__value">{{ stat.value }}</div>
          <div class="stat-item__label">{{ stat.label }}</div>
          <div class="stat-item__sub">{{ stat.sub }}</div>
        </div>
      </div>
    </section>

    <!-- ─── FEATURES ──────────────────────────────────── -->
    <section class="section section--gray">
      <h2 class="section__title">Mengapa KOMPAK Apps?</h2>
      <p class="section__sub">Platform yang dirancang untuk menghubungkan ekosistem koperasi desa Indonesia.</p>

      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-card__icon">
            <component :is="feature.icon" :size="20" color="#0F595E" />
          </div>
          <div class="feature-card__title">{{ feature.title }}</div>
          <div class="feature-card__desc">{{ feature.desc }}</div>
        </div>
      </div>
    </section>

    <!-- ─── CTA BANNER ────────────────────────────────── -->
    <section class="cta-banner">
      <div class="cta-banner__content">
        <h2 class="cta-banner__headline">Petakan potensi desa Anda hari ini.</h2>
        <p class="cta-banner__sub">
          Bergabung dengan 12.480 produsen dan 847 koperasi yang sudah terhubung di platform KOMPAK.
        </p>
        <div class="cta-banner__actions">
          <button class="btn-white" @click="emit('navigate', 'add-product')">
            Daftar sebagai Produsen
          </button>
          <button class="btn-outline-white" @click="emit('navigate', 'map')">
            Jelajahi Peta
            <ArrowRight :size="16" />
          </button>
        </div>
      </div>
    </section>

    <!-- ─── FOOTER ────────────────────────────────────── -->
    <footer class="footer">
      <div class="footer__logo">
        <div class="footer__logo-mark">
          <Sprout :size="13" color="#fff" />
        </div>
        <span class="footer__wordmark">kompak</span>
      </div>
      <div class="footer__links">
        <span>Tentang</span>
        <span>Kebijakan Privasi</span>
        <span>Syarat & Ketentuan</span>
        <span>Bantuan</span>
      </div>
      <span class="footer__copy">© 2026 KOMPAK Apps · Kemenkop RI × PEBS FEB UI</span>
    </footer>
  </div>
</template>

<style scoped>
/* ─── ROOT ───────────────────────────────────────────── */
.lp-root {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  font-family: var(--font-body);
  background: #F2F2F2;
  scrollbar-width: none;
  -webkit-font-smoothing: antialiased;
}
.lp-root::-webkit-scrollbar { display: none; }

/* ─── BUTTONS ────────────────────────────────────────── */
.btn-outline {
  background: #fff;
  border: 1.5px solid #0F595E;
  color: #0F595E;
  cursor: pointer;
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  transition: background 0.15s, color 0.15s;
}
.btn-outline:hover { background: #0F595E; color: #fff; }

.btn-white {
  background: #fff;
  color: #0F595E;
  border: none;
  cursor: pointer;
  padding: 13px 28px;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  transition: opacity 0.15s, transform 0.15s;
  box-shadow: 0 2px 12px rgba(0,0,0,0.12);
}
.btn-white:hover { opacity: 0.92; transform: translateY(-1px); }

.btn-outline-white {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.45);
  cursor: pointer;
  padding: 13px 28px;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.15s, border-color 0.15s;
}
.btn-outline-white:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.75); }

/* ─── HERO ───────────────────────────────────────────── */
.hero {
  position: relative;
  background: #0F595E;
  overflow: hidden;
  padding: 60px 40px 84px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 320px;
}
.hero__side {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 260px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.hero__side--left { left: 0; }
.hero__side--right { right: 0; }
.hero__side img {
  width: 100%;
  height: 50%;
  object-fit: cover;
  opacity: 0.8;
  display: block;
}
.hero__side-fade {
  position: absolute;
  inset: 0;
}
.hero__side-fade--right {
  background: linear-gradient(to right, rgba(15,89,94,0) 0%, rgba(15,89,94,0.85) 100%);
}
.hero__side-fade--left {
  background: linear-gradient(to left, rgba(15,89,94,0) 0%, rgba(15,89,94,0.85) 100%);
}

.hero__content {
  position: relative;
  z-index: 2;
  max-width: 580px;
  width: 100%;
}
.hero__headline {
  font-family: var(--font-heading);
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 800;
  color: #fff;
  line-height: 1.12;
  margin: 0 0 10px;
  letter-spacing: -0.03em;
}
.hero__headline-accent {
  color: #A8D060;
}
.hero__sub {
  color: rgba(255,255,255,0.72);
  font-size: 15px;
  margin: 0 0 28px;
  line-height: 1.55;
}

/* ─── SEARCH CARD ────────────────────────────────────── */
.search-card {
  background: #fff;
  border-radius: 16px;
  padding: 18px 20px 20px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  text-align: left;
}
.search-card__label {
  font-size: 11px;
  font-weight: 600;
  color: #9B9BAA;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 10px;
}
.search-card__row {
  display: flex;
  gap: 10px;
  align-items: stretch;
}
.search-card__location {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 11px 13px;
  border: 1.5px solid #E8E8E8;
  border-radius: 10px;
  cursor: pointer;
  min-width: 170px;
  background: #FAFAFA;
  font-size: 14px;
  font-weight: 500;
  color: #1A2B2C;
  transition: border-color 0.18s;
  user-select: none;
}
.search-card__location:hover { border-color: #0F595E; }
.search-card__input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 11px 13px;
  border: 1.5px solid #E8E8E8;
  border-radius: 10px;
  background: #FAFAFA;
  transition: border-color 0.18s;
}
.search-card__input-wrap:focus-within { border-color: #0F595E; }
.search-card__input {
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  color: #1A2B2C;
  width: 100%;
  font-family: inherit;
}
.search-card__input::placeholder { color: #ADADB8; }
.search-card__btn {
  background: #0F595E;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 11px 24px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  flex-shrink: 0;
  transition: background 0.15s;
}
.search-card__btn:hover { background: #0C4D51; }

/* ─── SECTIONS ───────────────────────────────────────── */
.section {
  padding: 40px 40px;
}
.section--gray { background: #F2F2F2; }
.section--white { background: #fff; }
.section__title {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  color: #1A2B2C;
  text-align: center;
  margin: 0 0 6px;
  letter-spacing: -0.3px;
}
.section__sub {
  font-size: 14px;
  color: #6E6E80;
  text-align: center;
  margin: 0 0 28px;
  line-height: 1.55;
}
.section__cta-row {
  text-align: center;
  margin-top: 24px;
}

/* ─── QUICK ACTIONS ──────────────────────────────────── */
.quick-grid {
  display: flex;
  gap: 14px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 20px;
}
.quick-card {
  background: #fff;
  border: 1.5px solid #EBEBEB;
  border-radius: 14px;
  padding: 20px 22px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 210px;
  flex: 1;
  max-width: 270px;
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.quick-card--hovered {
  border-color: #0F595E;
  box-shadow: 0 6px 20px rgba(15,89,94,0.12);
  transform: translateY(-2px);
}
.quick-card__icon-wrap {
  width: 52px;
  height: 52px;
  border-radius: 13px;
  background: #E8F4F4;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.quick-card__label {
  font-size: 15px;
  font-weight: 700;
  color: #1A2B2C;
  margin-bottom: 3px;
}
.quick-card__desc {
  font-size: 13px;
  color: #6E6E80;
  line-height: 1.4;
}

/* ─── KOMODITAS CIRCLES ──────────────────────────────── */
.circles-row {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}
.circle-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 9px;
  cursor: pointer;
  transition: transform 0.2s;
}
.circle-item--hovered { transform: translateY(-4px); }
.circle-item__img-wrap {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #fff;
  box-shadow: 0 4px 14px rgba(0,0,0,0.10);
  transition: border-color 0.18s, box-shadow 0.18s;
}
.circle-item--hovered .circle-item__img-wrap {
  border-color: #0F595E;
  box-shadow: 0 6px 22px rgba(15,89,94,0.22);
}
.circle-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
  display: block;
}
.circle-item--hovered .circle-item__img { transform: scale(1.08); }
.circle-item__name {
  font-size: 13px;
  font-weight: 600;
  color: #1A2B2C;
  text-align: center;
}
.circle-item__count {
  font-size: 12px;
  color: #6E6E80;
  text-align: center;
}

/* ─── PRODUCER CARDS ─────────────────────────────────── */
.producer-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}
.producer-card {
  background: #fff;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  border: 1.5px solid #EBEBEB;
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.producer-card--hovered {
  border-color: #D0D0D0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.10);
  transform: translateY(-4px);
}
.producer-card__img-wrap {
  position: relative;
  height: 156px;
  overflow: hidden;
}
.producer-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.35s;
  display: block;
}
.producer-card--hovered .producer-card__img { transform: scale(1.05); }
.producer-card__badge {
  position: absolute;
  top: 10px;
  left: 10px;
  background: rgba(255,255,255,0.93);
  border-radius: 100px;
  padding: 4px 10px;
  font-size: 11px;
  font-weight: 700;
  color: #0F595E;
}
.producer-card__rating {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(255,255,255,0.93);
  border-radius: 7px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 700;
  color: #1A2B2C;
}
.producer-card__body {
  padding: 13px 15px 15px;
}
.producer-card__name {
  font-size: 14px;
  font-weight: 700;
  color: #1A2B2C;
  margin-bottom: 3px;
  line-height: 1.3;
}
.producer-card__commodity {
  font-size: 13px;
  color: #0F595E;
  font-weight: 600;
  margin-bottom: 5px;
}
.producer-card__location {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #6E6E80;
  margin-bottom: 9px;
}
.producer-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
}
.producer-card__tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.tag {
  padding: 3px 9px;
  border-radius: 100px;
  background: #E8F4F4;
  color: #0F595E;
  font-size: 11px;
  font-weight: 600;
}
.producer-card__dist {
  font-size: 12px;
  color: #6E6E80;
  white-space: nowrap;
}

/* ─── STATS ──────────────────────────────────────────── */
.stats-bar {
  border-top: 1px solid #EBEBEB;
  border-bottom: 1px solid #EBEBEB;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
  gap: 16px;
}
.stat-item {
  padding: 16px;
  border-radius: 12px;
  transition: background 0.18s;
  cursor: default;
}
.stat-item:hover { background: #F5F8F8; }
.stat-item__value {
  font-size: 30px;
  font-weight: 800;
  color: #0F595E;
  margin-bottom: 5px;
  letter-spacing: -0.04em;
  line-height: 1;
}
.stat-item__label {
  font-size: 13px;
  font-weight: 600;
  color: #1A2B2C;
  margin-bottom: 3px;
}
.stat-item__sub {
  font-size: 12px;
  color: #6E6E80;
}

/* ─── FEATURES ───────────────────────────────────────── */
.features-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  max-width: 1100px;
  margin: 0 auto;
}
.feature-card {
  background: #fff;
  border-radius: 14px;
  padding: 24px 20px;
  border: 1.5px solid #EBEBEB;
  transition: border-color 0.18s, box-shadow 0.18s, transform 0.18s;
}
.feature-card:hover {
  border-color: #0F595E;
  box-shadow: 0 6px 20px rgba(15,89,94,0.09);
  transform: translateY(-2px);
}
.feature-card__icon {
  width: 44px;
  height: 44px;
  border-radius: 11px;
  background: #E8F4F4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 14px;
}
.feature-card__title {
  font-size: 15px;
  font-weight: 700;
  color: #1A2B2C;
  margin-bottom: 7px;
  line-height: 1.3;
}
.feature-card__desc {
  font-size: 13px;
  color: #6E6E80;
  line-height: 1.6;
}

/* ─── CTA BANNER ─────────────────────────────────────── */
.cta-banner {
  background: #0F595E;
  padding: 64px 40px;
  text-align: center;
}
.cta-banner__content {
  max-width: 560px;
  margin: 0 auto;
}
.cta-banner__headline {
  font-family: var(--font-heading);
  font-size: clamp(24px, 3.5vw, 38px);
  font-weight: 800;
  color: #fff;
  line-height: 1.12;
  margin: 0 0 12px;
  letter-spacing: -0.03em;
}
.cta-banner__sub {
  font-size: 15px;
  color: rgba(255,255,255,0.70);
  margin: 0 0 32px;
  line-height: 1.55;
}
.cta-banner__actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

/* ─── FOOTER ─────────────────────────────────────────── */
.footer {
  background: #fff;
  border-top: 1px solid #EBEBEB;
  padding: 28px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
}
.footer__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}
.footer__logo-mark {
  width: 28px;
  height: 28px;
  border-radius: 7px;
  background: #0F595E;
  display: flex;
  align-items: center;
  justify-content: center;
}
.footer__wordmark {
  font-family: var(--font-heading);
  font-size: 15px;
  font-weight: 700;
  color: #1A2B2C;
  letter-spacing: -0.3px;
}
.footer__links {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.footer__links span {
  font-size: 13px;
  color: #6E6E80;
  cursor: pointer;
  transition: color 0.15s;
}
.footer__links span:hover { color: #1A2B2C; }
.footer__copy {
  font-size: 12px;
  color: #ADADB8;
}

/* ─── RESPONSIVE ─────────────────────────────────────── */
@media (max-width: 1024px) {
  .producer-grid,
  .features-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .section { padding: 32px 20px; }
  .hero { padding: 48px 20px 72px; }
  .hero__side { display: none; }
  .search-card__row { flex-direction: column; }
  .search-card__location { min-width: unset; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .quick-grid { flex-direction: column; align-items: stretch; }
  .quick-card { max-width: unset; }
}
@media (max-width: 580px) {
  .producer-grid,
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
