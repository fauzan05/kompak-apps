<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    label?: string
    type?: 'button' | 'submit' | 'reset'
    className?: string
    style?: Record<string, string | number>
  }>(),
  { active: false, type: 'button' },
)

const buttonStyle = computed(() => ({
  background: 'none',
  border: 'none',
  borderBottom: `2px solid ${props.active ? 'var(--kompak-primary)' : 'transparent'}`,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 14px',
  fontFamily: 'var(--font-body)',
  fontSize: '14px',
  fontWeight: props.active ? 600 : 500,
  color: props.active ? 'var(--kompak-text-dark)' : 'var(--kompak-text-muted)',
  transition: 'color 0.18s, border-color 0.18s',
  whiteSpace: 'nowrap',
  ...props.style,
}))
</script>

<template>
  <button :type="type" :class="className" :style="buttonStyle">
    <span :style="{ display: 'flex', width: '18px', height: '18px', flexShrink: 0 }">
      <slot />
    </span>
    <span v-if="label">{{ label }}</span>
  </button>
</template>
