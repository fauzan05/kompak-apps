<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { Button, InputField, SelectField, TextareaField } from '@/components/ui'
import { Handshake, X } from 'lucide-vue-next'
import { submitOffer } from '@/api/client'

export interface OfferFormContext {
  arah: 'produsen_ke_koperasi' | 'koperasi_ke_produsen'
  targetName: string
  entitasRef?: string
  koperasiRef?: string
  kebutuhanRef?: string
  namaKomoditas?: string
  jumlah?: string
  satuan?: string
  harga?: string
}

const props = defineProps<{
  open: boolean
  context: OfferFormContext | null
}>()

const emit = defineEmits<{
  close: []
  success: []
}>()

const unitOptions = [
  { value: 'kg', label: 'kg (kilogram)' },
  { value: 'ton', label: 'ton' },
  { value: 'liter', label: 'liter' },
  { value: 'buah', label: 'buah/pcs' },
]

const form = reactive({
  namaKomoditas: '',
  jumlah: '',
  satuan: 'kg',
  harga: '',
  catatan: '',
})

const submitting = ref(false)
const error = ref('')

const title = computed(() =>
  props.context?.arah === 'koperasi_ke_produsen' ? 'Tawarkan Pembelian' : 'Ajukan Penawaran',
)

const submitLabel = computed(() =>
  props.context?.arah === 'koperasi_ke_produsen' ? 'Kirim Tawaran' : 'Kirim Penawaran',
)

watch(
  () => props.context,
  (ctx) => {
    if (!ctx) return
    form.namaKomoditas = ctx.namaKomoditas || ''
    form.jumlah = ctx.jumlah || ''
    form.satuan = ctx.satuan || 'kg'
    form.harga = ctx.harga || ''
    form.catatan = ''
    error.value = ''
  },
  { immediate: true },
)

function close() {
  if (!submitting.value) emit('close')
}

async function handleSubmit() {
  if (!props.context) return
  if (!form.namaKomoditas.trim()) {
    error.value = 'Nama komoditas wajib diisi'
    return
  }
  const jumlah = Number(form.jumlah)
  if (!jumlah || jumlah <= 0) {
    error.value = 'Jumlah harus lebih dari 0'
    return
  }

  submitting.value = true
  error.value = ''
  try {
    await submitOffer({
      arah: props.context.arah,
      entitasRef: props.context.entitasRef,
      koperasiRef: props.context.koperasiRef,
      kebutuhanRef: props.context.kebutuhanRef,
      namaKomoditas: form.namaKomoditas.trim(),
      jumlah,
      satuan: form.satuan,
      harga: form.harga ? Number(form.harga.replace(/\D/g, '')) : undefined,
      catatan: form.catatan.trim() || undefined,
    })
    emit('success')
    emit('close')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Gagal mengirim penawaran'
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && context"
      :style="{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-lg)',
        background: 'rgba(15, 89, 94, 0.45)',
        backdropFilter: 'blur(4px)',
      }"
      @click.self="close"
    >
      <div
        role="dialog"
        aria-modal="true"
        :style="{
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'var(--kompak-surface-white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-elevated)',
          border: '1px solid var(--kompak-border)',
          fontFamily: 'var(--font-body)',
        }"
      >
        <div
          :style="{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-xl)',
            borderBottom: '1px solid var(--kompak-border)',
          }"
        >
          <div :style="{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }">
            <div
              :style="{
                width: 40,
                height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'var(--kompak-pending-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              <Handshake :size="20" color="var(--kompak-accent)" />
            </div>
            <div>
              <div :style="{ fontSize: '16px', fontWeight: 700, color: 'var(--kompak-text-dark)' }">{{ title }}</div>
              <div :style="{ fontSize: '12px', color: 'var(--kompak-text-muted)', marginTop: 2 }">ke {{ context.targetName }}</div>
            </div>
          </div>
          <button
            type="button"
            aria-label="Tutup"
            :style="{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              color: 'var(--kompak-text-muted)',
            }"
            @click="close"
          >
            <X :size="20" />
          </button>
        </div>

        <form
          :style="{ padding: 'var(--space-xl)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }"
          @submit.prevent="handleSubmit"
        >
          <InputField
            v-model="form.namaKomoditas"
            label="Komoditas"
            placeholder="Contoh: Gula Aren"
          />
          <div :style="{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }">
            <InputField
              v-model="form.jumlah"
              label="Jumlah"
              type="number"
              placeholder="100"
            />
            <SelectField
              v-model="form.satuan"
              label="Satuan"
              :options="unitOptions"
            />
          </div>
          <InputField
            v-model="form.harga"
            label="Harga per satuan (opsional)"
            placeholder="Rp 18.000"
          />
          <TextareaField
            v-model="form.catatan"
            label="Catatan (opsional)"
            placeholder="Contoh: siap kirim minggu depan, kualitas premium"
          />

          <p v-if="error" :style="{ fontSize: '13px', color: 'var(--kompak-danger)', margin: 0 }">{{ error }}</p>

          <div :style="{ display: 'flex', gap: 'var(--space-md)', marginTop: 'var(--space-sm)' }">
            <Button variant="neutral" :style="{ flex: 1 }" type="button" @click="close">Batal</Button>
            <Button
              variant="primary"
              :style="{ flex: 1, background: 'var(--kompak-accent)' }"
              type="submit"
              :disabled="submitting"
            >
              {{ submitting ? 'Mengirim…' : submitLabel }}
            </Button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>
