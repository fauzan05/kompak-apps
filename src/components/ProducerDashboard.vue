<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui'
import {
  Package, Handshake, Wallet, MapPin, ChevronRight, Plus,
  ShieldCheck, AlertCircle, TrendingUp, Sparkles,
} from 'lucide-vue-next'
import { DEMO_PRODUCER_ID, fetchProducerDashboard } from '@/api/client'
import type { ProducerDashboardData } from '@/api/types'
import OfferFormModal, { type OfferFormContext } from '@/components/OfferFormModal.vue'
import ResultModal from '@/components/ResultModal.vue'

const emit = defineEmits<{ navigate: [view: string, data?: unknown] }>()

const loading = ref(true)
const loadError = ref('')
const greeting = ref('Pak Budi')
const location = ref('—')
const metrics = ref<{ label: string; value: string; hint: string; icon: typeof Package; color: string }[]>([])
const recommendations = ref<ProducerDashboardData['recommendations']>([])
const products = ref<ProducerDashboardData['products']>([])
const transactions = ref<ProducerDashboardData['transactions']>([])
const brokenPhotoKeys = ref<Record<string, boolean>>({})

function productKey(p: ProducerDashboardData['products'][number], i: number) {
  return `${p.name}-${i}`
}

function onPhotoError(key: string) {
  brokenPhotoKeys.value[key] = true
}

const offerOpen = ref(false)
const offerContext = ref<OfferFormContext | null>(null)
const resultOpen = ref(false)
const resultVariant = ref<'success' | 'error'>('success')
const resultTitle = ref('')
const resultMessage = ref('')

function showResult(variant: 'success' | 'error', title: string, message: string) {
  resultVariant.value = variant
  resultTitle.value = title
  resultMessage.value = message
  resultOpen.value = true
}

function openOfferForRec(rec: ProducerDashboardData['recommendations'][number]) {
  const qtyMatch = rec.reason.match(/Membutuhkan (\d+)/)
  offerContext.value = {
    arah: 'produsen_ke_koperasi',
    targetName: rec.name,
    entitasRef: DEMO_PRODUCER_ID,
    koperasiRef: rec.id,
    kebutuhanRef: rec.kebutuhanRef,
    namaKomoditas: rec.activeNeed,
    jumlah: qtyMatch?.[1] || '',
    satuan: 'kg',
  }
  offerOpen.value = true
}

function onOfferSuccess() {
  showResult(
    'success',
    'Penawaran Berhasil',
    'Penawaran berhasil dikirim ke koperasi.',
  )
}

function onOfferError(message: string) {
  showResult('error', 'Penawaran Gagal', message)
}

onMounted(async () => {
  brokenPhotoKeys.value = {}
  try {
    const data = await fetchProducerDashboard(DEMO_PRODUCER_ID)
    greeting.value = data.greeting
    location.value = data.location
    metrics.value = [
      { label: 'Produk Aktif', value: data.metrics[0]?.value || '0', hint: 'sedang tampil di peta', icon: Package, color: 'var(--kompak-secondary)' },
      { label: 'Transaksi Bulan Ini', value: data.metrics[1]?.value || '0', hint: 'data KOMPAK', icon: Handshake, color: 'var(--kompak-primary)' },
      { label: 'Pendapatan Bulan Ini', value: data.metrics[2]?.value || 'Rp 0', hint: 'akumulasi transaksi', icon: Wallet, color: 'var(--kompak-accent)' },
    ]
    recommendations.value = data.recommendations
    products.value = data.products
    transactions.value = data.transactions
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Gagal memuat dashboard'
  } finally {
    loading.value = false
  }
})

const txStatus: Record<string, { label: string; color: string; bg: string }> = {
  Selesai: { label: 'Selesai', color: 'var(--kompak-verified)', bg: 'var(--kompak-verified-bg)' },
  Diproses: { label: 'Diproses', color: 'var(--kompak-secondary)', bg: 'rgba(140,174,62,0.15)' },
  selesai: { label: 'Selesai', color: 'var(--kompak-verified)', bg: 'var(--kompak-verified-bg)' },
  'dalam-perjalanan': { label: 'Dikirim', color: 'var(--kompak-secondary)', bg: 'rgba(140,174,62,0.15)' },
  dijadwalkan: { label: 'Dijadwalkan', color: 'var(--kompak-pending)', bg: 'var(--kompak-pending-bg)' },
}
</script>

<template>
  <div :style="{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--kompak-canvas)', fontFamily: 'var(--font-body)' }">
    <div
      :style="{
        maxWidth: '1000px',
        margin: '0 auto',
        padding: 'var(--space-2xl)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-2xl)',
      }"
    >
      <div
        :style="{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--space-lg)',
          flexWrap: 'wrap',
        }"
      >
        <div>
          <h1
            :style="{
              fontFamily: 'var(--font-body)',
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
              letterSpacing: '-0.02em',
            }"
          >
            Halo, {{ greeting }} 👋
          </h1>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '14px',
              color: 'var(--kompak-text-muted)',
              marginTop: '4px',
            }"
          >
            <MapPin :size="13" /> {{ location }}
          </div>
        </div>
        <Button
          variant="primary"
          :style="{ background: 'var(--kompak-accent)' }"
          @click="$emit('navigate', 'add-product')"
        >
          <template #iconStart><Plus :size="16" /></template>
          Tambah Produk
        </Button>
      </div>

      <div class="metric-row" :style="{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }">
        <div
          v-for="m in metrics"
          :key="m.label"
          :style="{
            background: 'var(--kompak-surface-white)',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--kompak-border)',
            padding: 'var(--space-xl)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-md)',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }">
            <span :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">{{ m.label }}</span>
            <div
              :style="{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--radius-md)',
                background: `color-mix(in srgb, ${m.color} 14%, transparent)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              <component :is="m.icon" :size="16" :color="m.color" />
            </div>
          </div>
          <div
            :style="{
              fontSize: '30px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
              lineHeight: 1,
            }"
          >
            {{ m.value }}
          </div>
          <span :style="{ fontSize: '12px', color: 'var(--kompak-text-light)' }">{{ m.hint }}</span>
        </div>
      </div>

      <div>
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 'var(--space-lg)',
            gap: 'var(--space-md)',
          }"
        >
          <h2
            :style="{
              fontSize: '18px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
              letterSpacing: '-0.01em',
            }"
          >
            Koperasi yang Cocok untuk Anda
          </h2>
          <span
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              color: 'var(--kompak-secondary)',
              fontWeight: 600,
            }"
          >
            <Sparkles :size="13" /> Produk: Gula Aren
          </span>
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }">
          <div
            v-for="rec in recommendations"
            :key="rec.id"
            :style="{
              background: 'var(--kompak-surface-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--kompak-border)',
              padding: 'var(--space-xl)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-lg)',
            }"
          >
            <div :style="{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-lg)' }">
              <div
                :style="{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--kompak-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }"
              >
                <Handshake :size="22" color="#fff" />
              </div>
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', flexWrap: 'wrap' }">
                  <span :style="{ fontSize: '16px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ rec.name }}</span>
                  <span
                    v-if="rec.verified"
                    :style="{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: 'var(--kompak-verified)',
                    }"
                  >
                    <ShieldCheck :size="12" /> Terverifikasi
                  </span>
                </div>
                <div
                  :style="{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '13px',
                    color: 'var(--kompak-text-muted)',
                    marginTop: '3px',
                  }"
                >
                  <MapPin :size="12" /> {{ rec.distance }} dari Anda
                </div>
              </div>
              <span
                v-if="rec.activeNeed"
                :style="{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'var(--kompak-pending)',
                  background: 'var(--kompak-pending-bg)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                }"
              >
                Butuh sekarang
              </span>
            </div>
            <div>
              <div :style="{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }">
                <span :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)' }">Tingkat kecocokan</span>
                <span :style="{ fontSize: '12px', fontWeight: 700, color: 'var(--kompak-primary)' }">{{ rec.matchScore }}%</span>
              </div>
              <div
                :style="{
                  height: '6px',
                  borderRadius: 'var(--radius-full)',
                  background: 'var(--kompak-surface-hover)',
                  overflow: 'hidden',
                }"
              >
                <div
                  :style="{
                    width: `${rec.matchScore}%`,
                    height: '100%',
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--kompak-secondary)',
                  }"
                />
              </div>
            </div>
            <p :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', lineHeight: 1.6, margin: 0 }">{{ rec.reason }}</p>
            <div :style="{ display: 'flex', gap: 'var(--space-md)' }">
              <Button
                variant="neutral"
                size="small"
                :style="{ flex: 1 }"
                @click="emit('navigate', 'entity-detail', { type: 'koperasi', id: rec.id, name: rec.name })"
              >
                Lihat Profil
              </Button>
              <Button variant="primary" size="small" :style="{ flex: 1 }" @click="openOfferForRec(rec)">
                Ajukan Penawaran
                <template #iconEnd><ChevronRight :size="14" /></template>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div class="two-col" :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2xl)', alignItems: 'start' }">
        <div>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-lg)',
              gap: 'var(--space-md)',
            }"
          >
            <h2
              :style="{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--kompak-text-dark)',
                letterSpacing: '-0.01em',
              }"
            >
              Produk Saya
            </h2>
            <button
              type="button"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--kompak-primary)',
              }"
              @click="$emit('navigate', 'add-product')"
            >
              <Plus :size="14" /> Tambah
            </button>
          </div>
          <div :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }">
            <div
              v-for="(p, i) in products"
              :key="productKey(p, i)"
              :style="{
                background: 'var(--kompak-surface-white)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--kompak-border)',
                padding: 'var(--space-lg)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-lg)',
              }"
            >
              <div
                :style="{
                  width: '40px',
                  height: '40px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--kompak-card-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  overflow: 'hidden',
                }"
              >
                <img
                  v-if="p.fotoUrl && !brokenPhotoKeys[productKey(p, i)]"
                  :src="p.fotoUrl"
                  :alt="p.name"
                  :style="{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }"
                  @error="onPhotoError(productKey(p, i))"
                >
                <Package v-else :size="20" color="var(--kompak-secondary)" />
              </div>
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ p.name }}</div>
                <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: '2px' }">{{ p.qty }} · {{ p.price }}</div>
              </div>
              <span
                :style="{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: p.status === 'verified' ? 'var(--kompak-verified)' : 'var(--kompak-pending)',
                  background: p.status === 'verified' ? 'var(--kompak-verified-bg)' : 'var(--kompak-pending-bg)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  flexShrink: 0,
                }"
              >
                <ShieldCheck v-if="p.status === 'verified'" :size="12" />
                <AlertCircle v-else :size="12" />
                {{ p.status === 'verified' ? 'Aktif' : 'Menunggu' }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 'var(--space-lg)',
              gap: 'var(--space-md)',
            }"
          >
            <h2
              :style="{
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--kompak-text-dark)',
                letterSpacing: '-0.01em',
              }"
            >
              Transaksi Terakhir
            </h2>
            <span
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '12px',
                color: 'var(--kompak-verified)',
                fontWeight: 600,
              }"
            >
              <TrendingUp :size="13" /> +18%
            </span>
          </div>
          <div
            :style="{
              background: 'var(--kompak-surface-white)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--kompak-border)',
              padding: 'var(--space-lg) var(--space-xl)',
            }"
          >
            <div
              v-for="(tx, i) in transactions"
              :key="`${tx.koperasi}-${tx.date}-${i}`"
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-lg)',
                padding: 'var(--space-md) 0',
                borderBottom: i < transactions.length - 1 ? '1px solid var(--kompak-border)' : 'none',
              }"
            >
              <div :style="{ flex: 1, minWidth: 0 }">
                <div :style="{ fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ tx.koperasi }}</div>
                <div :style="{ fontSize: '11px', color: 'var(--kompak-text-muted)', marginTop: '2px' }">{{ tx.qty }} · {{ tx.date }}</div>
                <div v-if="tx.payLabel || tx.shipLabel" :style="{ display: 'flex', gap: '4px', marginTop: 6, flexWrap: 'wrap' }">
                  <span
                    v-if="tx.payLabel"
                    :style="{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: tx.payStatus === 'lunas' ? 'var(--kompak-verified-bg)' : 'var(--kompak-pending-bg)',
                      color: tx.payStatus === 'lunas' ? 'var(--kompak-verified)' : 'var(--kompak-accent)',
                    }"
                  >{{ tx.payLabel }}</span>
                  <span
                    v-if="tx.shipLabel"
                    :style="{
                      fontSize: '10px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'var(--kompak-surface-muted)',
                      color: 'var(--kompak-text-muted)',
                    }"
                  >{{ tx.shipLabel }}</span>
                </div>
              </div>
              <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }">
                <span :style="{ fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ tx.value }}</span>
                <span
                  :style="{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: (txStatus[tx.status] || txStatus.Diproses).color,
                    background: (txStatus[tx.status] || txStatus.Diproses).bg,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }"
                >
                  {{ (txStatus[tx.status] || txStatus.Diproses).label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <OfferFormModal
      :open="offerOpen"
      :context="offerContext"
      @close="offerOpen = false"
      @success="onOfferSuccess"
      @error="onOfferError"
    />
    <ResultModal
      :open="resultOpen"
      :variant="resultVariant"
      :title="resultTitle"
      :message="resultMessage"
      @close="resultOpen = false"
    />
  </div>
</template>

<style>
@media (max-width: 760px) {
  .metric-row { grid-template-columns: 1fr !important; }
  .two-col { grid-template-columns: 1fr !important; }
}
</style>
