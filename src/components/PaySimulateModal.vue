<script setup lang="ts">
import { ref } from 'vue'
import { Button, SelectField } from '@/components/ui'
import { Wallet, X } from 'lucide-vue-next'
import { simulatePayment } from '@/api/client'

const props = defineProps<{
  open: boolean
  orderId: string
  supplier: string
  commodity: string
  qty: string
  value: string
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const metodeOptions = [
  { value: 'transfer', label: 'Transfer Bank' },
  { value: 'tunai', label: 'Tunai' },
  { value: 'saldo-kompak', label: 'Saldo KOMPAK' },
]

const metode = ref('transfer')
const submitting = ref(false)
const error = ref('')

function close() {
  if (!submitting.value) emit('close')
}

async function handlePay() {
  submitting.value = true
  error.value = ''
  try {
    await simulatePayment(props.orderId, metode.value)
    emit('success')
    emit('close')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Pembayaran gagal'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && orderId"
      :style="{
        position: 'fixed', inset: 0, zIndex: 1000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'var(--space-lg)',
        background: 'rgba(15, 89, 94, 0.45)', backdropFilter: 'blur(4px)',
      }"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        :style="{
          width: '100%', maxWidth: '420px',
          background: 'var(--kompak-surface-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-elevated)',
          border: '1px solid var(--kompak-border)',
          fontFamily: 'var(--font-body)',
        }"
      >
        <div :style="{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-xl)', borderBottom: '1px solid var(--kompak-border)' }">
          <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
            <div :style="{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'var(--kompak-verified-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }">
              <Wallet :size="20" color="var(--kompak-verified)" />
            </div>
            <div>
              <div :style="{ fontSize: '16px', fontWeight: 700, color: 'var(--kompak-text-dark)' }">Bayar (Simulasi)</div>
              <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }">Tidak terhubung ke payment gateway</div>
            </div>
          </div>
          <button type="button" aria-label="Tutup" :style="{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }" @click="close">
            <X :size="20" color="var(--kompak-text-muted)" />
          </button>
        </div>

        <div :style="{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }">
          <div :style="{ padding: 'var(--space-lg)', background: 'var(--kompak-card-bg)', borderRadius: 'var(--radius-md)' }">
            <div :style="{ fontSize: '14px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ supplier }}</div>
            <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 4 }">{{ commodity }} · {{ qty }}</div>
            <div :style="{ fontSize: '18px', fontWeight: 700, color: 'var(--kompak-primary)', marginTop: 'var(--space-md)' }">{{ value }}</div>
          </div>

          <SelectField v-model="metode" label="Metode pembayaran" :options="metodeOptions" />

          <p v-if="error" :style="{ fontSize: '13px', color: 'var(--kompak-danger)', margin: 0 }">{{ error }}</p>

          <div :style="{ display: 'flex', gap: 'var(--space-md)' }">
            <Button variant="neutral" :style="{ flex: 1 }" @click="close">Batal</Button>
            <Button variant="primary" :style="{ flex: 1, background: 'var(--kompak-accent)' }" :disabled="submitting" @click="handlePay">
              {{ submitting ? 'Memproses…' : 'Konfirmasi Bayar' }}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
