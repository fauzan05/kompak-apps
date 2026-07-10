<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    active?: boolean
    expanded?: boolean
    label?: string
    type?: 'button' | 'submit' | 'reset'
    className?: string
    style?: Record<string, string | number>
  }>(),
  { active: false, expanded: false, type: 'button' },
)

const buttonStyle = computed(() => {
  const base = {
    borderRadius: '8px',
    border: 'none',
    background: props.active ? 'var(--kompak-card-bg)' : 'transparent',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    color: props.active ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
    opacity: props.active ? 1 : 0.6,
    transition: 'background 0.15s, opacity 0.15s',
    ...props.style,
  }

  if (props.expanded) {
    return {
      ...base,
      width: '100%',
      height: '40px',
      justifyContent: 'flex-start',
      gap: '10px',
      padding: '0 10px',
    }
  }

  return {
    ...base,
    width: '40px',
    height: '40px',
    justifyContent: 'center',
  }
})
</script>

<template>
  <button :type="type" :class="className" :style="buttonStyle">
    <span :style="{ display: 'flex', width: '20px', height: '20px', flexShrink: 0 }">
      <slot />
    </span>
    <span
      v-if="expanded && label"
      :style="{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }"
    >
      {{ label }}
    </span>
  </button>
</template>
