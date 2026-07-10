<script setup lang="ts">
import { computed } from 'vue'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    isExpanded?: boolean
    className?: string
  }>(),
  { isExpanded: true },
)

const emit = defineEmits<{ toggle: [] }>()

const sidebarWidth = computed(() => (props.isExpanded ? '220px' : '60px'))
</script>

<template>
  <aside
    :class="className"
    :style="{
      width: sidebarWidth,
      height: '100vh',
      background: 'var(--kompak-surface-white)',
      borderRight: '1px solid var(--kompak-border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: isExpanded ? 'stretch' : 'center',
      padding: isExpanded ? '12px 10px' : '12px 0',
      flexShrink: 0,
      transition: 'width 0.2s ease',
      overflow: 'hidden',
    }"
  >
    <div
      :style="{
        display: 'flex',
        flexDirection: isExpanded ? 'row' : 'column',
        alignItems: 'center',
        gap: isExpanded ? '10px' : '8px',
        marginBottom: '16px',
        flexShrink: 0,
        padding: isExpanded ? '0 6px' : '0',
        justifyContent: isExpanded ? 'space-between' : 'center',
        width: '100%',
      }"
    >
      <div :style="{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }">
        <div
          :style="{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'var(--kompak-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }"
        >
          <span :style="{ color: '#fff', fontSize: '14px', fontWeight: 700, fontFamily: 'var(--font-body)' }">K</span>
        </div>
        <span
          v-if="isExpanded"
          :style="{
            fontFamily: 'var(--font-heading)',
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--kompak-text-dark)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }"
        >
          KOMPAK
        </span>
      </div>
      <button
        type="button"
        :title="isExpanded ? 'Perkecil sidebar' : 'Perlebar sidebar'"
        :style="{
          width: '28px',
          height: '28px',
          borderRadius: '6px',
          border: 'none',
          background: 'var(--kompak-card-bg)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: 'var(--kompak-text-muted)',
        }"
        @click="emit('toggle')"
      >
        <PanelLeftClose v-if="isExpanded" :size="16" />
        <PanelLeftOpen v-else :size="16" />
      </button>
    </div>

    <div
      :style="{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isExpanded ? 'stretch' : 'center',
        gap: '4px',
        flex: 1,
        width: '100%',
      }"
    >
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      :style="{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isExpanded ? 'stretch' : 'center',
        gap: '8px',
        marginTop: '8px',
        width: '100%',
      }"
    >
      <slot name="footer" />
    </div>
  </aside>
</template>
