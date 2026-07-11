<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Button } from '@/components/ui'
import { Building2, Package, Search, Send, Sprout, Wallet } from 'lucide-vue-next'
import {
  DEMO_OFFTAKER_ID,
  fetchOfftakerDashboard,
  submitRfq,
} from '@/api/client'
import type { OfftakerDashboardData, OfftakerSource } from '@/api/types'
import PaySimulateModal from '@/components/PaySimulateModal.vue'

const emit = defineEmits<{ navigate: [view: string, data?: unknown] }>()

const loading = ref(true)
const loadError = ref('')
const toast = ref('')
const greeting = ref('Offtaker')
const company = ref('')
const sources = ref<OfftakerSource[]>([])
const rfqs = ref<OfftakerDashboardData['rfqs']>([])
const transactions = ref<OfftakerDashboardData['transactions']>([])
const submittingId = ref('')
const payOpen = ref(false)
const payOrder = ref<OfftakerDashboardData['transactions'][number] | null>(null)
const searchQuery = ref('')
const sourceFilter = ref<'all' | 'koperasi' | 'produsen'>('all')

const filterChips = [
  { id: 'all' as const, label: 'Semua' },
  { id: 'koperasi' as const, label: 'Koperasi' },
  { id: 'produsen' as const, label: 'Produsen' },
]

const filteredSources = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return (sources.value ?? []).filter((item) => {
    if (sourceFilter.value !== 'all' && item.sourceType !== sourceFilter.value) return false
    if (!q) return true
    return (
      item.partyName.toLowerCase().includes(q)
      || item.commodity.toLowerCase().includes(q)
      || item.location.toLowerCase().includes(q)
    )
  })
})

function mapSurplusToSources(surplus: OfftakerDashboardData['surplus']): OfftakerSource[] {
  return surplus.map((s) => ({
    id: s.id,
    sourceType: 'koperasi' as const,
    partyName: s.koperasiName,
    partyRef: s.koperasiRef,
    commodity: s.commodity,
    qty: s.qty,
    price: s.price,
    location: s.location,
    surplusRef: s.id,
  }))
}

async function load() {
  loading.value = true
  try {
    const data = await fetchOfftakerDashboard(DEMO_OFFTAKER_ID)
    greeting.value = data.greeting
    company.value = data.company
    sources.value = data.sources?.length
      ? data.sources
      : mapSurplusToSources(data.surplus ?? [])
    rfqs.value = (data.rfqs ?? []).map((r) => ({
      ...r,
      partyName: r.partyName ?? (r as { koperasiName?: string }).koperasiName ?? '—',
      targetType: (r.targetType ?? 'koperasi') as 'koperasi' | 'produsen',
    }))
    transactions.value = data.transactions ?? []
    loadError.value = ''
  } catch (e) {
    loadError.value = e instanceof Error ? e.message : 'Gagal memuat dashboard'
  } finally {
    loading.value = false
  }
}

onMounted(load)

function parseQty(qty: string): number {
  const m = qty.match(/(\d+)/)
  return m ? Number(m[1]) : 0
}

function sourceTypeLabel(type: OfftakerSource['sourceType']) {
  return type === 'koperasi' ? 'Koperasi' : 'Produsen'
}

function targetTypeLabel(type: OfftakerDashboardData['rfqs'][number]['targetType']) {
  return type === 'koperasi' ? 'Koperasi' : 'Produsen'
}

async function requestPurchase(item: OfftakerSource) {
  const jumlah = parseQty(item.qty)
  if (!jumlah) return
  submittingId.value = item.id
  try {
    await submitRfq({
      koperasiRef: item.sourceType === 'koperasi' ? item.partyRef : undefined,
      entitasRef: item.sourceType === 'produsen' ? item.partyRef : undefined,
      surplusRef: item.surplusRef,
      penawaranRef: item.penawaranRef,
      namaKomoditas: item.commodity,
      jumlah,
      catatan: `Permintaan pembelian dari ${company.value}`,
    })
    toast.value = `Permintaan pembelian ${item.commodity} berhasil dikirim ke ${item.partyName}.`
    await load()
  } catch (e) {
    toast.value = e instanceof Error ? e.message : 'Gagal mengirim permintaan pembelian'
  } finally {
    submittingId.value = ''
    window.setTimeout(() => { toast.value = '' }, 5000)
  }
}

function viewParty(item: OfftakerSource) {
  if (item.sourceType === 'koperasi') {
    emit('navigate', 'entity-detail', { type: 'koperasi', id: item.partyRef, name: item.partyName })
    return
  }
  emit('navigate', 'entity-detail', { type: 'produsen', id: item.partyRef, name: item.partyName })
}

function openPay(tx: OfftakerDashboardData['transactions'][number]) {
  payOrder.value = tx
  payOpen.value = true
}

async function onPaySuccess() {
  toast.value = 'Pembayaran simulasi berhasil.'
  await load()
  window.setTimeout(() => { toast.value = '' }, 5000)
}
</script>

<template>
  <div :style="{ flex: 1, minHeight: 0, overflowY: 'auto', background: 'var(--kompak-canvas)', fontFamily: 'var(--font-body)' }">
    <div :style="{ maxWidth: '1000px', margin: '0 auto', padding: 'var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2xl)' }">
      <div>
        <h1 :style="{ fontSize: '24px', fontWeight: 700, color: 'var(--kompak-text-dark)' }">Dashboard Offtaker</h1>
        <p :style="{ fontSize: '14px', color: 'var(--kompak-text-muted)', marginTop: 'var(--space-xs)' }">
          {{ greeting }} · {{ company }}
        </p>
      </div>

      <div v-if="toast" class="offer-toast">{{ toast }}</div>
      <p v-if="loadError" :style="{ color: 'var(--kompak-danger)', fontSize: '14px' }">{{ loadError }}</p>

      <div>
        <h2 :style="{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-md)' }">Cari &amp; Beli Komoditas</h2>
        <p :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)', marginBottom: 'var(--space-lg)' }">
          Cari penawaran dari koperasi atau produsen, lalu ajukan permintaan pembelian.
        </p>

        <div :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }">
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-sm)',
              padding: '0 var(--space-md)',
              height: '40px',
              background: 'var(--kompak-surface-white)',
              border: '1px solid var(--kompak-border)',
              borderRadius: 'var(--radius-md)',
            }"
          >
            <Search :size="16" color="var(--kompak-text-muted)" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Cari komoditas, nama koperasi, atau produsen…"
              :style="{
                flex: 1,
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontFamily: 'var(--font-body)',
                fontSize: '14px',
                color: 'var(--kompak-text-dark)',
              }"
            >
          </div>

          <div :style="{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }">
            <button
              v-for="chip in filterChips"
              :key="chip.id"
              type="button"
              :style="{
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--kompak-border)',
                background: sourceFilter === chip.id ? 'var(--kompak-primary)' : 'var(--kompak-surface-white)',
                color: sourceFilter === chip.id ? '#fff' : 'var(--kompak-text-muted)',
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }"
              @click="sourceFilter = chip.id"
            >
              {{ chip.label }}
            </button>
          </div>
        </div>

        <div v-if="loading" :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">Memuat…</div>
        <div v-else-if="filteredSources.length === 0" :style="{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--kompak-text-muted)', fontSize: '14px' }">
          Tidak ada penawaran yang cocok dengan pencarian.
        </div>
        <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }">
          <div
            v-for="item in filteredSources"
            :key="`${item.sourceType}-${item.id}`"
            :style="{ padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--kompak-border)', boxShadow: 'var(--shadow-card)' }"
          >
            <div :style="{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }">
              <div>
                <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }">
                  <component :is="item.sourceType === 'koperasi' ? Building2 : Sprout" :size="16" color="var(--kompak-primary)" />
                  <span :style="{ fontSize: '15px', fontWeight: 600 }">{{ item.partyName }}</span>
                  <span
                    :style="{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: item.sourceType === 'koperasi' ? 'rgba(15,89,94,0.1)' : 'rgba(45,106,79,0.12)',
                      color: item.sourceType === 'koperasi' ? 'var(--kompak-primary)' : 'var(--kompak-secondary)',
                    }"
                  >
                    {{ sourceTypeLabel(item.sourceType) }}
                  </span>
                </div>
                <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 4 }">{{ item.location }}</div>
                <div :style="{ fontSize: '13px', marginTop: 'var(--space-md)' }">
                  <Package :size="13" style="display:inline;vertical-align:middle" />
                  {{ item.commodity }} · {{ item.qty }} · {{ item.price }}
                </div>
              </div>
              <div :style="{ display: 'flex', gap: 'var(--space-sm)' }">
                <Button variant="neutral" size="small" @click="viewParty(item)">
                  {{ item.sourceType === 'koperasi' ? 'Lihat Koperasi' : 'Lihat Produsen' }}
                </Button>
                <Button variant="primary" size="small" :disabled="submittingId === item.id" @click="requestPurchase(item)">
                  <template #iconStart><Send :size="14" /></template>
                  {{ submittingId === item.id ? 'Mengirim…' : 'Ajukan Pembelian' }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 :style="{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-lg)' }">Permintaan Pembelian Saya</h2>
        <div v-if="!loading && rfqs.length === 0" :style="{ fontSize: '14px', color: 'var(--kompak-text-muted)' }">Belum ada permintaan pembelian.</div>
        <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }">
          <div
            v-for="r in rfqs"
            :key="r.id"
            :style="{ padding: 'var(--space-md) var(--space-lg)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--kompak-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }"
          >
            <div>
              <div :style="{ fontSize: '14px', fontWeight: 600 }">{{ r.partyName }} — {{ r.commodity }}</div>
              <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)' }">
                {{ targetTypeLabel(r.targetType) }} · {{ r.qty }} · {{ r.date }}
              </div>
            </div>
            <span :style="{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'var(--kompak-pending-bg)', color: 'var(--kompak-accent)' }">{{ r.statusLabel }}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 :style="{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-lg)' }">Transaksi dengan Koperasi</h2>
        <div v-if="!loading && transactions.length === 0" :style="{ fontSize: '14px', color: 'var(--kompak-text-muted)' }">Belum ada transaksi.</div>
        <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }">
          <div
            v-for="tx in transactions"
            :key="tx.id"
            :style="{ padding: 'var(--space-lg)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--kompak-border)' }"
          >
            <div :style="{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }">
              <div>
                <div :style="{ fontSize: '14px', fontWeight: 600 }">{{ tx.koperasi }}</div>
                <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }">{{ tx.commodity }} · {{ tx.qty }} · {{ tx.value }}</div>
                <div :style="{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-sm)' }">
                  <span :style="{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: tx.payStatus === 'lunas' ? 'var(--kompak-verified-bg)' : 'var(--kompak-pending-bg)', color: tx.payStatus === 'lunas' ? 'var(--kompak-verified)' : 'var(--kompak-accent)' }">{{ tx.payLabel }}</span>
                  <span :style="{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: 'rgba(15,89,94,0.1)', color: 'var(--kompak-primary)' }">{{ tx.shipLabel }}</span>
                </div>
              </div>
              <Button
                v-if="tx.payStatus !== 'lunas'"
                variant="primary"
                size="small"
                :style="{ background: 'var(--kompak-accent)' }"
                @click="openPay(tx)"
              >
                <template #iconStart><Wallet :size="14" /></template>
                Bayar Simulasi
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <PaySimulateModal
      v-if="payOrder"
      :open="payOpen"
      :order-id="payOrder.id"
      :supplier="payOrder.koperasi"
      :commodity="payOrder.commodity"
      :qty="payOrder.qty"
      :value="payOrder.value"
      @close="payOpen = false"
      @success="onPaySuccess"
    />
  </div>
</template>

<style scoped>
.offer-toast {
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-md);
  background: var(--kompak-verified-bg);
  color: var(--kompak-verified);
  font-size: 13px;
  font-weight: 600;
}
</style>
