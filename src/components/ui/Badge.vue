<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    label: string
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'secondary'
    removable?: boolean
    className?: string
  }>(),
  { variant: 'default' },
)

const emit = defineEmits<{ remove: [] }>()

const variantStyles: Record<string, Record<string, string>> = {
  default: { background: 'var(--kompak-card-bg)', color: 'var(--kompak-text-dark)', border: '1px solid var(--kompak-border)' },
  success: { background: 'var(--kompak-verified-bg)', color: 'var(--kompak-verified)' },
  warning: { background: 'var(--kompak-pending-bg)', color: 'var(--kompak-pending)' },
  danger: { background: 'var(--kompak-danger-bg)', color: 'var(--kompak-danger)' },
  brand: { background: 'rgba(44,95,45,0.12)', color: 'var(--kompak-primary)' },
  secondary: { background: 'var(--kompak-card-bg)', color: 'var(--kompak-text-muted)' },
}

const style = computed(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
  padding: '3px 10px',
  borderRadius: 'var(--radius-full)',
  fontFamily: 'var(--font-body)',
  fontSize: '12px',
  fontWeight: 600,
  ...variantStyles[props.variant],
}))
</script>

<template>
  <span :class="className" :style="style">
    {{ label }}
    <button
      v-if="removable"
      type="button"
      style="background: none; border: none; cursor: pointer; padding: 0; line-height: 1; display: flex"
      @click="emit('remove')"
    >
      <span style="font-size: 14px; line-height: 1">×</span>
    </button>
  </span>
</template>
