import { onMounted, onUnmounted, ref, type Ref } from 'vue'

export function useInView(threshold = 0.15): { ref: Ref<HTMLElement | null>; visible: Ref<boolean> } {
  const elRef = ref<HTMLElement | null>(null)
  const visible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = elRef.value
    if (!el) return
    observer = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) visible.value = true
      },
      { threshold },
    )
    observer.observe(el)
  })

  onUnmounted(() => observer?.disconnect())

  return { ref: elRef, visible }
}
