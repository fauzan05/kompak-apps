<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
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
} from 'lucide-vue-next'
import type { Component } from 'vue'

const emit = defineEmits<{ navigate: [view: string] }>()

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

const step = ref(1)
const submitted = ref(false)

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
  { label: 'Lokasi', value: form.location || 'Desa Ciawi, Kab. Bogor' },
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
          fontFamily: 'var(--font-heading)',
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
          fontFamily: 'var(--font-heading)',
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
              fontFamily: 'var(--font-heading)',
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
            <div
              :style="{
                height: '160px',
                background: 'linear-gradient(160deg, #c8d8b0 0%, #b8cc98 60%, #98b068 100%)',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }"
            >
              <div :style="{ position: 'relative' }">
                <div
                  :style="{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: 'var(--kompak-accent)',
                    border: '3px solid #fff',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                  }"
                />
                <div
                  :style="{
                    width: 0,
                    height: 0,
                    borderLeft: '6px solid transparent',
                    borderRight: '6px solid transparent',
                    borderTop: '10px solid var(--kompak-accent)',
                    margin: '0 auto',
                    marginTop: '-2px',
                  }"
                />
              </div>
              <button
                :style="{
                  position: 'absolute',
                  bottom: 'var(--space-md)',
                  right: 'var(--space-md)',
                  background: 'var(--kompak-surface-white)',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: 'var(--shadow-card)',
                }"
              >
                <Navigation :size="12" color="var(--kompak-primary)" />
                <span
                  :style="{
                    fontSize: '12px',
                    color: 'var(--kompak-primary)',
                    fontWeight: 600,
                  }"
                >
                  Gunakan GPS
                </span>
              </button>
            </div>
            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                padding: 'var(--space-lg)',
              }"
            >
              <MapPin :size="16" color="var(--kompak-accent)" />
              <span :style="{ fontSize: '13px', color: 'var(--kompak-text-muted)' }">
                {{ form.location || 'Ketuk peta untuk memilih lokasi produksi' }}
              </span>
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
              fontFamily: 'var(--font-heading)',
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
              fontFamily: 'var(--font-heading)',
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
                  fontFamily: 'var(--font-heading)',
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
          @click="submitted = true"
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
