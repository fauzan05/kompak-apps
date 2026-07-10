<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
    style?: Record<string, string | number>
  }>(),
  { active: false, type: 'button' },
)
</script>

<template>
  <button
    :type="type"
    :class="className"
    :style="{
      width: '40px',
      height: '40px',
      borderRadius: '8px',
      border: 'none',
      background: active ? 'var(--kompak-card-bg)' : 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: active ? 'var(--kompak-primary)' : 'var(--kompak-text-muted)',
      opacity: active ? 1 : 0.6,
      transition: 'background 0.15s, opacity 0.15s',
      ...style,
    }"
  >
    <span style="display: flex; width: 20px; height: 20px">
      <slot />
    </span>
  </button>
</template>
