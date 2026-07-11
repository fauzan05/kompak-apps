<script setup lang="ts">
import type { Component } from 'vue'
import {
  Home, FileText, Users, Briefcase, CalendarDays, Wallet, HandCoins,
  ShoppingCart, AppWindow, Stethoscope, Pill, BarChart3, PieChart,
  GraduationCap, Newspaper, Wrench, MessageSquareWarning,
} from 'lucide-vue-next'

interface MenuItem {
  id: string
  label: string
  icon: Component
  baru?: boolean
  enabled?: boolean
}

const props = withDefaults(defineProps<{
  activeId?: string
}>(), {
  activeId: 'kompak-app',
})

const emit = defineEmits<{ select: [id: string] }>()

const menuItems: MenuItem[] = [
  { id: 'beranda', label: 'Beranda', icon: Home },
  { id: 'formulir', label: 'Formulir Permohonan', icon: FileText, baru: true },
  { id: 'anggota', label: 'Anggota', icon: Users },
  { id: 'karyawan', label: 'Karyawan', icon: Briefcase, baru: true },
  { id: 'rat', label: 'Rapat Anggota Tahun (RAT)', icon: CalendarDays },
  { id: 'simpanan', label: 'Simpanan', icon: Wallet, baru: true },
  { id: 'pinjaman', label: 'Pinjaman', icon: HandCoins, baru: true },
  { id: 'penjualan', label: 'Penjualan', icon: ShoppingCart, baru: true },
  { id: 'kompak-app', label: 'Kompak App', icon: AppWindow, baru: true, enabled: true },
  { id: 'klinik', label: 'Klinik Desa', icon: Stethoscope, baru: true },
  { id: 'apotek', label: 'Apotek Desa', icon: Pill, baru: true },
  { id: 'laporan', label: 'Laporan Keuangan', icon: BarChart3 },
  { id: 'shu', label: 'SHU', icon: PieChart },
  { id: 'magang', label: 'Program Magang', icon: GraduationCap, baru: true },
  { id: 'artikel', label: 'Artikel Koperasi', icon: Newspaper },
  { id: 'penyedia', label: 'Penyedia Layanan', icon: Wrench, baru: true },
  { id: 'pengaduan', label: 'Pengaduan Anggota', icon: MessageSquareWarning, baru: true },
]

function onItemClick(item: MenuItem) {
  if (!item.enabled) return
  emit('select', item.id)
}
</script>

<template>
  <aside class="simkopdes-sidebar">
    <div class="simkopdes-sidebar__brand">
      <div class="simkopdes-sidebar__logo">S</div>
      <span class="simkopdes-sidebar__title">Simkopdes</span>
    </div>

    <nav class="simkopdes-sidebar__nav">
      <button
        v-for="item in menuItems"
        :key="item.id"
        type="button"
        class="simkopdes-sidebar__item"
        :class="{
          'simkopdes-sidebar__item--active': item.id === props.activeId,
          'simkopdes-sidebar__item--disabled': !item.enabled,
        }"
        :disabled="!item.enabled"
        :title="item.enabled ? item.label : `${item.label} (belum tersedia)`"
        @click="onItemClick(item)"
      >
        <component :is="item.icon" class="simkopdes-sidebar__icon" :stroke-width="1.5" />
        <span class="simkopdes-sidebar__label">{{ item.label }}</span>
        <span v-if="item.baru" class="simkopdes-sidebar__badge">BARU</span>
      </button>
    </nav>
  </aside>
</template>

<style scoped>
.simkopdes-sidebar {
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: #0b4a52;
  color: #fff;
  overflow: hidden;
}

.simkopdes-sidebar__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 20px 16px 16px;
  flex-shrink: 0;
}

.simkopdes-sidebar__logo {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

.simkopdes-sidebar__title {
  font-family: var(--font-heading);
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.3px;
}

.simkopdes-sidebar__nav {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0 16px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}

.simkopdes-sidebar__item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 11px 16px;
  border: none;
  background: transparent;
  color: rgba(255, 255, 255, 0.92);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;
}

.simkopdes-sidebar__item:hover:not(:disabled):not(.simkopdes-sidebar__item--active) {
  background: rgba(255, 255, 255, 0.08);
}

.simkopdes-sidebar__item--active {
  background: #fff;
  color: #0b4a52;
}

.simkopdes-sidebar__item--disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.simkopdes-sidebar__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.simkopdes-sidebar__label {
  flex: 1;
  min-width: 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.simkopdes-sidebar__badge {
  flex-shrink: 0;
  padding: 2px 6px;
  border-radius: 4px;
  background: #f5c518;
  color: #1a1a1a;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.3px;
  line-height: 1.2;
}

.simkopdes-sidebar__item--active .simkopdes-sidebar__badge {
  background: #f5c518;
  color: #1a1a1a;
}
</style>
