<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Home, Map, Settings, Sprout, Store, Building2 } from 'lucide-vue-next'
import {
  ThemeProvider,
  NavbarNavigation,
  NavbarButton,
  Avatar,
} from '@/components/ui'
import LandingPage from '@/components/LandingPage.vue'
import MapView from '@/components/MapView.vue'
import ProducerDashboard from '@/components/ProducerDashboard.vue'
import CoopDashboard from '@/components/CoopDashboard.vue'
import AddProductForm from '@/components/AddProductForm.vue'
import EntityDetail from '@/components/EntityDetail.vue'
import OfftakerDashboard from '@/components/OfftakerDashboard.vue'
import SimkopdesShell from '@/components/portal/SimkopdesShell.vue'
import { useGeolocation } from '@/composables/useGeolocation'
import type { MapSearchPayload } from '@/api/types'

const geo = useGeolocation()
onMounted(() => geo.init())

type View =
  | 'home'
  | 'map'
  | 'producer-dashboard'
  | 'coop-dashboard'
  | 'offtaker-dashboard'
  | 'add-product'
  | 'entity-detail'

interface EntityData {
  id?: string
  type?: string
  name?: string
  lat?: number
  lng?: number
  city?: string
  distance?: string
  verified?: boolean
  commodities?: string[]
}

const primaryNav = [
  { id: 'home', icon: Home, label: 'Beranda', view: 'home' as View },
  { id: 'map', icon: Map, label: 'Peta Komoditas', view: 'map' as View },
  { id: 'producer', icon: Sprout, label: 'Dashboard Produsen', view: 'producer-dashboard' as View },
  { id: 'coop', icon: Store, label: 'Dashboard Koperasi', view: 'coop-dashboard' as View },
  { id: 'offtaker', icon: Building2, label: 'Dashboard Offtaker', view: 'offtaker-dashboard' as View },
]

const mobileNav = [
  { id: 'home', icon: Home, label: 'Beranda', view: 'home' as View },
  { id: 'map', icon: Map, label: 'Peta', view: 'map' as View },
  { id: 'producer', icon: Sprout, label: 'Produsen', view: 'producer-dashboard' as View },
  { id: 'coop', icon: Store, label: 'Koperasi', view: 'coop-dashboard' as View },
  { id: 'offtaker', icon: Building2, label: 'Offtaker', view: 'offtaker-dashboard' as View },
]

const activeView = ref<View>('home')
const entityData = ref<EntityData | null>(null)
const mapSearch = ref<MapSearchPayload | null>(null)

function navigate(view: string, data?: unknown) {
  activeView.value = view as View
  if (view === 'map') {
    mapSearch.value = data && typeof data === 'object' ? (data as MapSearchPayload) : null
    return
  }
  if (view === 'entity-detail' && data && typeof data === 'object') {
    entityData.value = data as EntityData
  }
}

function isNavActive(navId: string) {
  if (navId === 'home') return activeView.value === 'home'
  if (navId === 'map') return activeView.value === 'map' || activeView.value === 'entity-detail'
  if (navId === 'producer') return activeView.value === 'producer-dashboard' || activeView.value === 'add-product'
  if (navId === 'coop') return activeView.value === 'coop-dashboard'
  if (navId === 'offtaker') return activeView.value === 'offtaker-dashboard'
  return false
}
</script>

<template>
  <ThemeProvider>
    <SimkopdesShell>
      <div
        class="flex flex-col h-full w-full overflow-hidden"
        :style="{ fontFamily: 'var(--font-body)', background: 'var(--kompak-canvas)' }"
      >
      <NavbarNavigation class="hidden md:flex" @logo-click="navigate('home')">
        <NavbarButton
          v-for="item in primaryNav"
          :key="item.id"
          :active="isNavActive(item.id)"
          :label="item.label"
          @click="navigate(item.view)"
        >
          <component :is="item.icon" class="size-full" :stroke-width="1.5" />
        </NavbarButton>
        <template #actions>
          <button
            type="button"
            title="Pengaturan"
            :style="{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--kompak-text-muted)',
            }"
          >
            <Settings :size="20" :stroke-width="1.5" />
          </button>
          <div
            :style="{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }"
          >
            <Avatar type="initial" initials="PB" size="medium" shape="circle" />
            <span
              :style="{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--kompak-text-dark)',
                whiteSpace: 'nowrap',
              }"
            >
              Pak Budi
            </span>
          </div>
        </template>
      </NavbarNavigation>

      <div
        class="flex md:hidden items-center gap-md px-lg py-md"
        :style="{
          background: 'var(--kompak-primary-dark)',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 30,
          flexShrink: 0,
        }"
      >
        <div class="flex items-center gap-md flex-1">
          <div
            :style="{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }"
          >
            <Sprout :size="16" color="var(--kompak-accent)" />
          </div>
          <span
            :style="{
              fontFamily: 'var(--font-heading)',
              fontSize: '16px',
              fontWeight: 700,
              color: '#fff',
            }"
          >
            KOMPAK
          </span>
        </div>
        <span
          :style="{
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.6)',
            fontStyle: 'italic',
          }"
        >
          Satu Irama, Satu Data
        </span>
      </div>

      <div class="flex flex-1 flex-col min-h-0 overflow-hidden">
        <LandingPage v-if="activeView === 'home'" @navigate="navigate" />
        <MapView v-else-if="activeView === 'map'" :initial-search="mapSearch" @navigate="navigate" />
        <ProducerDashboard v-else-if="activeView === 'producer-dashboard'" @navigate="navigate" />
        <CoopDashboard v-else-if="activeView === 'coop-dashboard'" @navigate="navigate" />
        <OfftakerDashboard v-else-if="activeView === 'offtaker-dashboard'" @navigate="navigate" />
        <AddProductForm v-else-if="activeView === 'add-product'" @navigate="navigate" />
        <EntityDetail
          v-else-if="activeView === 'entity-detail'"
          :entity="entityData"
          @navigate="navigate"
        />
        <LandingPage v-else @navigate="navigate" />
      </div>

      <div
        class="flex md:hidden"
        :style="{
          background: 'var(--kompak-surface-white)',
          borderTop: '1px solid var(--kompak-border)',
          flexShrink: 0,
          zIndex: 30,
        }"
      >
        <button
          v-for="item in mobileNav"
          :key="item.id"
          type="button"
          class="flex flex-col items-center justify-center gap-xs flex-1"
          :style="{
            background: 'none',
            border: 'none',
            padding: '10px 4px 8px',
            cursor: 'pointer',
            borderTop: `2px solid ${isNavActive(item.id) ? 'var(--kompak-primary)' : 'transparent'}`,
          }"
          @click="navigate(item.view)"
        >
          <component
            :is="item.icon"
            :size="22"
            :color="isNavActive(item.id) ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)'"
            :stroke-width="isNavActive(item.id) ? 2 : 1.5"
          />
          <span
            :style="{
              fontFamily: 'var(--font-body)',
              fontSize: '10px',
              fontWeight: isNavActive(item.id) ? 600 : 400,
              color: isNavActive(item.id) ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
            }"
          >
            {{ item.label }}
          </span>
        </button>
      </div>
      </div>
    </SimkopdesShell>
  </ThemeProvider>
</template>
