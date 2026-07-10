<script setup lang="ts">
withDefaults(
  defineProps<{
    align?: 'justify' | 'start' | 'end' | 'center' | 'stack'
    className?: string
  }>(),
  { align: 'justify' },
)

const justifyMap: Record<string, string> = {
  justify: 'space-between',
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
}
</script>

<template>
  <div
    v-if="align === 'stack'"
    :class="className"
    style="display: flex; flex-direction: column; gap: 8px"
  >
    <slot />
  </div>
  <div
    v-else
    :class="className"
    :style="{
      display: 'flex',
      gap: '8px',
      justifyContent: justifyMap[align] ?? 'space-between',
      width: '100%',
    }"
  >
    <slot />
  </div>
</template>
