<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })

const el = ref<HTMLElement | null>(null)
const visible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const node = el.value
  if (!node) return
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) visible.value = true
    },
    { threshold: 0.15 },
  )
  observer.observe(node)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div
    ref="el"
    :style="{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
    }"
  >
    <slot />
  </div>
</template>
