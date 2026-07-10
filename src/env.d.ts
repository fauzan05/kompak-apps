/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEMO_PRODUCER_ID?: string
  readonly VITE_DEMO_COOP_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'leaflet.markercluster' {
  import type * as L from 'leaflet'
  export default function markerClusterGroup(options?: L.MarkerClusterGroupOptions): L.MarkerClusterGroup
}
