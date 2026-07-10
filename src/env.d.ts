/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<object, object, unknown>
  export default component
}

declare module 'leaflet.markercluster' {
  import type * as L from 'leaflet'
  export default function markerClusterGroup(options?: L.MarkerClusterGroupOptions): L.MarkerClusterGroup
}
