<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Home, Map, Settings, Sprout, Store, Leaf } from 'lucide-vue-next'
import {
  ThemeProvider,
  SidebarNavigation,
  SidebarButton,
  Avatar,
} from '@/components/ui'
import LandingPage from '@/components/LandingPage.vue'
import MapView from '@/components/MapView.vue'
import ProducerDashboard from '@/components/ProducerDashboard.vue'
import CoopDashboard from '@/components/CoopDashboard.vue'
import AddProductForm from '@/components/AddProductForm.vue'
import EntityDetail from '@/components/EntityDetail.vue'
import { useGeolocation } from '@/composables/useGeolocation'

const geo = useGeolocation()
onMounted(() => geo.init())

type View =
  | 'home'
  | 'map'
  | 'producer-dashboard'
  | 'coop-dashboard'
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
]

const mobileNav = [
  { id: 'home', icon: Home, label: 'Beranda', view: 'home' as View },
  { id: 'map', icon: Map, label: 'Peta', view: 'map' as View },
  { id: 'producer', icon: Sprout, label: 'Produsen', view: 'producer-dashboard' as View },
  { id: 'coop', icon: Store, label: 'Koperasi', view: 'coop-dashboard' as View },
]

const activeView = ref<View>('home')
const entityData = ref<EntityData | null>(null)
const sidebarExpanded = ref(localStorage.getItem('kompak-sidebar-expanded') !== 'false')

watch(sidebarExpanded, (value) => {
  localStorage.setItem('kompak-sidebar-expanded', String(value))
})

function toggleSidebar() {
  sidebarExpanded.value = !sidebarExpanded.value
}

function navigate(view: string, data?: unknown) {
  activeView.value = view as View
  if (data && typeof data === 'object') {
    entityData.value = data as EntityData
  }
}

function isNavActive(navId: string) {
  if (navId === 'home') return activeView.value === 'home'
  if (navId === 'map') return activeView.value === 'map' || activeView.value === 'entity-detail'
  if (navId === 'producer') return activeView.value === 'producer-dashboard' || activeView.value === 'add-product'
  if (navId === 'coop') return activeView.value === 'coop-dashboard'
  return false
}
</script>

<template>
  <ThemeProvider>
    <div
      class="flex h-screen overflow-hidden"
      :style="{ fontFamily: 'var(--font-body)', background: 'var(--kompak-canvas)' }"
    >
      <div class="hidden md:flex">
        <SidebarNavigation :is-expanded="sidebarExpanded" @toggle="toggleSidebar">
          <SidebarButton
            v-for="item in primaryNav"
            :key="item.id"
            :active="isNavActive(item.id)"
            :expanded="sidebarExpanded"
            :label="item.label"
            @click="activeView = item.view"
          >
            <component :is="item.icon" class="size-full" :stroke-width="1.5" />
          </SidebarButton>
          <template #footer>
            <SidebarButton :expanded="sidebarExpanded" label="Pengaturan">
              <Settings class="size-full" :stroke-width="1.5" />
            </SidebarButton>
            <div
              :style="{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarExpanded ? '10px' : '0',
                padding: sidebarExpanded ? '0 10px' : '0',
                justifyContent: sidebarExpanded ? 'flex-start' : 'center',
              }"
            >
              <Avatar type="initial" initials="PB" size="medium" shape="circle" />
              <span
                v-if="sidebarExpanded"
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
        </SidebarNavigation>
      </div>

      <div class="flex flex-col flex-1 min-w-0">
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
              <Leaf :size="16" color="var(--kompak-accent)" />
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
          <MapView v-else-if="activeView === 'map'" @navigate="navigate" />
          <ProducerDashboard v-else-if="activeView === 'producer-dashboard'" @navigate="navigate" />
          <CoopDashboard v-else-if="activeView === 'coop-dashboard'" @navigate="navigate" />
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
            @click="activeView = item.view"
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
    </div>
  </ThemeProvider>
</template>
