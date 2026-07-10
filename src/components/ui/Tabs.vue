<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  tabs: { id: string; label: string }[]
  defaultTab?: string
  className?: string
}>()

const emit = defineEmits<{ change: [id: string] }>()

const active = ref(props.defaultTab ?? props.tabs[0]?.id ?? '')

watch(active, (id) => emit('change', id))

function handleClick(id: string) {
  active.value = id
}
</script>

<template>
  <div :class="className">
    <div
      role="tablist"
      style="
        display: flex;
        border-bottom: 1px solid var(--kompak-border);
        background: var(--kompak-surface-white);
        overflow-x: auto;
      "
    >
      <button
        v-for="tab in tabs"
        :key="tab.id"
        role="tab"
        :aria-selected="tab.id === active"
        type="button"
        :style="{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '12px 16px',
          fontFamily: 'var(--font-body)',
          fontSize: '14px',
          fontWeight: tab.id === active ? 600 : 400,
          color: tab.id === active ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
          borderBottom: `2px solid ${tab.id === active ? 'var(--kompak-primary)' : 'transparent'}`,
          marginBottom: '-1px',
          whiteSpace: 'nowrap',
          transition: 'color 0.15s, border-color 0.15s',
        }"
        @click="handleClick(tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div role="tabpanel">
      <slot :active="active" />
    </div>
  </div>
</template>
