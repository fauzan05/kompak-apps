<script setup lang="ts">
import { Button } from '@/components/ui'
import {
  Package, Handshake, Wallet, MapPin, ChevronRight, Plus,
  ShieldCheck, AlertCircle, TrendingUp, Sparkles,
} from 'lucide-vue-next'

defineEmits<{ navigate: [view: string, data?: unknown] }>()

const metrics = [
  { label: 'Produk Aktif', value: '2', hint: 'sedang tampil di peta', icon: Package, color: 'var(--kompak-secondary)' },
  { label: 'Transaksi Bulan Ini', value: '3', hint: '+1 dari bulan lalu', icon: Handshake, color: 'var(--kompak-primary)' },
  { label: 'Pendapatan Bulan Ini', value: 'Rp 4,5Jt', hint: '+18% dari bulan lalu', icon: Wallet, color: 'var(--kompak-accent)' },
]

const recommendations = [
  { id: 'r1', name: 'KMP Mekar Bersama', distance: '1,2 km', matchScore: 94, reason: 'Rutin membeli gula aren tiap bulan & sedang butuh 500 kg sekarang.', verified: true, activeNeed: true },
  { id: 'r2', name: 'Kop. Desa Sejahtera', distance: '3,5 km', matchScore: 81, reason: 'Sudah 6 bulan konsisten membeli gula aren.', verified: true, activeNeed: false },
  { id: 'r3', name: 'KMP Harapan Baru', distance: '7,8 km', matchScore: 72, reason: 'Berpotensi butuh gula aren berdasarkan pola musiman.', verified: true, activeNeed: false },
]

const products = [
  { id: 'pr1', name: 'Gula Aren Murni', qty: '150 kg', price: 'Rp 18.000/kg', status: 'verified' },
  { id: 'pr2', name: 'Gula Semut', qty: '80 kg', price: 'Rp 22.000/kg', status: 'pending' },
]

const transactions = [
  { id: 't1', koperasi: 'KMP Mekar Bersama', qty: '200 kg', date: '5 Jun 2026', value: 'Rp 3.600.000', status: 'selesai' },
  { id: 't2', koperasi: 'Kop. Desa Harapan', qty: '100 kg', date: '28 Jun 2026', value: 'Rp 1.800.000', status: 'dalam-perjalanan' },
  { id: 't3', koperasi: 'KMP Mekar Bersama', qty: '150 kg', date: '15 Jul 2026', value: 'Rp 2.700.000', status: 'dijadwalkan' },
]

const txStatus: Record<string, { label: string; color: string; bg: string }> = {
  selesai: { label: 'Selesai', color: 'var(--kompak-verified)', bg: 'var(--kompak-verified-bg)' },
  'dalam-perjalanan': { label: 'Dikirim', color: 'var(--kompak-secondary)', bg: 'rgba(140,174,62,0.15)' },
  dijadwalkan: { label: 'Dijadwalkan', color: 'var(--kompak-pending)', bg: 'var(--kompak-pending-bg)' },
}
</script>

<template>
  <div :style="{ flex: 1, overflowY: 'auto', background: 'var(--kompak-canvas)', fontFamily: 'var(--font-body)' }">
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
              fontFamily: 'var(--font-heading)',
              fontSize: '26px',
              fontWeight: 700,
              color: 'var(--kompak-text-dark)',
              letterSpacing: '-0.02em',
            }"
          >
            Halo, Pak Budi 👋
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
            <MapPin :size="13" /> Desa Ciawi, Kab. Bogor
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
              fontFamily: 'var(--font-heading)',
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
              fontFamily: 'var(--font-heading)',
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
                @click="$emit('navigate', 'entity-detail', { type: 'koperasi', name: rec.name })"
              >
                Lihat Profil
              </Button>
              <Button variant="primary" size="small" :style="{ flex: 1 }">
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
                fontFamily: 'var(--font-heading)',
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
              v-for="p in products"
              :key="p.id"
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
                }"
              >
                <Package :size="20" color="var(--kompak-secondary)" />
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
                fontFamily: 'var(--font-heading)',
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
              :key="tx.id"
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
              </div>
              <div :style="{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }">
                <span :style="{ fontSize: '13px', fontWeight: 600, color: 'var(--kompak-text-dark)' }">{{ tx.value }}</span>
                <span
                  :style="{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: txStatus[tx.status].color,
                    background: txStatus[tx.status].bg,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                  }"
                >
                  {{ txStatus[tx.status].label }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style>
@media (max-width: 760px) {
  .metric-row { grid-template-columns: 1fr !important; }
  .two-col { grid-template-columns: 1fr !important; }
}
</style>
