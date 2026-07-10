<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui'
import { Building2, Package, Send, Wallet } from 'lucide-vue-next'
import {
  DEMO_OFFTAKER_ID,
  fetchOfftakerDashboard,
  submitRfq,
} from '@/api/client'
import type { OfftakerDashboardData } from '@/api/types'
import PaySimulateModal from '@/components/PaySimulateModal.vue'

const emit = defineEmits<{ navigate: [view: string, data?: unknown] }>()

const loading = ref(true)
const loadError = ref('')
const toast = ref('')
const greeting = ref('Offtaker')
const company = ref('')
const surplus = ref<OfftakerDashboardData['surplus']>([])
const rfqs = ref<OfftakerDashboardData['rfqs']>([])
const transactions = ref<OfftakerDashboardData['transactions']>([])
const submittingRfq = ref('')
const payOpen = ref(false)
const payOrder = ref<OfftakerDashboardData['transactions'][number] | null>(null)

async function load() {
  loading.value = true
  try {
    const data = await fetchOfftakerDashboard(DEMO_OFFTAKER_ID)
    greeting.value = data.greeting
    company.value = data.company
    surplus.value = data.surplus
    rfqs.value = data.rfqs
    transactions.value = data.transactions
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

async function requestRfq(item: OfftakerDashboardData['surplus'][number]) {
  const jumlah = parseQty(item.qty)
  if (!jumlah) return
  submittingRfq.value = item.id
  try {
    await submitRfq({
      koperasiRef: item.koperasiRef,
      surplusRef: item.id,
      namaKomoditas: item.commodity,
      jumlah: jumlah,
      catatan: `RFQ dari ${company.value}`,
    })
    toast.value = `RFQ ${item.commodity} berhasil dikirim ke ${item.koperasiName}.`
    await load()
  } catch (e) {
    toast.value = e instanceof Error ? e.message : 'Gagal mengirim RFQ'
  } finally {
    submittingRfq.value = ''
    window.setTimeout(() => { toast.value = '' }, 5000)
  }
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
        <h2 :style="{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-lg)' }">Stok Surplus Koperasi</h2>
        <div v-if="loading" :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">Memuat…</div>
        <div v-else-if="surplus.length === 0" :style="{ padding: 'var(--space-xl)', textAlign: 'center', color: 'var(--kompak-text-muted)', fontSize: '14px' }">
          Belum ada stok surplus yang dipublikasikan koperasi.
        </div>
        <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }">
          <div
            v-for="item in surplus"
            :key="item.id"
            :style="{ padding: 'var(--space-xl)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--kompak-border)', boxShadow: 'var(--shadow-card)' }"
          >
            <div :style="{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-md)', flexWrap: 'wrap' }">
              <div>
                <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }">
                  <Building2 :size="16" color="var(--kompak-primary)" />
                  <span :style="{ fontSize: '15px', fontWeight: 600 }">{{ item.koperasiName }}</span>
                </div>
                <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 4 }">{{ item.location }}</div>
                <div :style="{ fontSize: '13px', marginTop: 'var(--space-md)' }">
                  <Package :size="13" style="display:inline;vertical-align:middle" />
                  {{ item.commodity }} · {{ item.qty }} · {{ item.price }}
                </div>
              </div>
              <div :style="{ display: 'flex', gap: 'var(--space-sm)' }">
                <Button variant="neutral" size="small" @click="emit('navigate', 'entity-detail', { type: 'koperasi', id: item.koperasiRef, name: item.koperasiName })">
                  Lihat Koperasi
                </Button>
                <Button variant="primary" size="small" :disabled="submittingRfq === item.id" @click="requestRfq(item)">
                  <template #iconStart><Send :size="14" /></template>
                  {{ submittingRfq === item.id ? 'Mengirim…' : 'Ajukan RFQ' }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 :style="{ fontSize: '18px', fontWeight: 700, marginBottom: 'var(--space-lg)' }">RFQ Saya</h2>
        <div v-if="!loading && rfqs.length === 0" :style="{ fontSize: '14px', color: 'var(--kompak-text-muted)' }">Belum ada RFQ.</div>
        <div v-else :style="{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }">
          <div
            v-for="r in rfqs"
            :key="r.id"
            :style="{ padding: 'var(--space-md) var(--space-lg)', background: 'var(--kompak-surface-white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--kompak-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-md)' }"
          >
            <div>
              <div :style="{ fontSize: '14px', fontWeight: 600 }">{{ r.koperasiName }} — {{ r.commodity }}</div>
              <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)' }">{{ r.qty }} · {{ r.date }}</div>
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
