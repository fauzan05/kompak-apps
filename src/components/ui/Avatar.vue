<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    type?: 'image' | 'initial'
    src?: string
    initials?: string
    size?: 'small' | 'medium' | 'large'
    shape?: 'circle' | 'square'
    alt?: string
  }>(),
  { type: 'image', initials: 'U', size: 'medium', shape: 'circle', alt: 'Avatar' },
)

const px = computed(() => (props.size === 'small' ? 24 : props.size === 'medium' ? 32 : 40))
const radius = computed(() => (props.shape === 'circle' ? '50%' : '6px'))
const fontSize = computed(() => (props.size === 'small' ? '9px' : props.size === 'medium' ? '11px' : '14px'))
</script>

<template>
  <img
    v-if="type === 'image' && src"
    :src="src"
    :alt="alt"
    :style="{ width: `${px}px`, height: `${px}px`, borderRadius: radius, objectFit: 'cover' }"
  />
  <div
    v-else
    :style="{
      width: `${px}px`,
      height: `${px}px`,
      borderRadius: radius,
      background: 'var(--kompak-secondary)',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'var(--font-body)',
      fontSize,
      fontWeight: 700,
      flexShrink: 0,
    }"
  >
    {{ initials.slice(0, 2) }}
  </div>
</template>
