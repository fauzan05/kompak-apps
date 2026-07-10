<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'neutral' | 'subtle'
    size?: 'medium' | 'small'
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    className?: string
    style?: Record<string, string | number>
  }>(),
  { variant: 'primary', size: 'medium', type: 'button' },
)

const baseStyle = computed(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px',
  border: 'none',
  cursor: props.disabled ? 'not-allowed' : 'pointer',
  borderRadius: 'var(--radius-full)',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  lineHeight: 1,
  transition: 'background 0.15s, opacity 0.15s',
  opacity: props.disabled ? 0.5 : 1,
  whiteSpace: 'nowrap' as const,
  padding: props.size === 'small' ? '6px 14px' : '9px 18px',
  fontSize: props.size === 'small' ? '13px' : '14px',
  ...(props.variant === 'primary'
    ? { background: 'var(--kompak-primary)', color: '#fff' }
    : props.variant === 'neutral'
      ? {
          background: 'var(--kompak-surface-white)',
          color: 'var(--kompak-text-dark)',
          border: '1px solid var(--kompak-border-strong)',
        }
      : { background: 'transparent', color: 'var(--kompak-text-dark)' }),
  ...props.style,
}))
</script>

<template>
  <button :type="type" :disabled="disabled" :class="className" :style="baseStyle">
    <span v-if="$slots.iconStart" style="display: flex; align-items: center">
      <slot name="iconStart" />
    </span>
    <slot />
    <span v-if="$slots.iconEnd" style="display: flex; align-items: center">
      <slot name="iconEnd" />
    </span>
  </button>
</template>
